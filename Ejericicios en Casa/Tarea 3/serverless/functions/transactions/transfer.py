"""
Función Lambda para realizar transferencias entre cuentas
"""

import json
import logging
import boto3
import uuid
from datetime import datetime
import os
import sys

# Agregar el directorio shared al path
sys.path.append('/opt/python')
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'shared'))

from models import Transaction, TransactionType, TransactionStatus, APIResponse
from utils import (
    validate_request_body, create_response, get_security_context, 
    log_transaction, validate_amount, generate_reference_number
)

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Cliente de DynamoDB
dynamodb = boto3.resource('dynamodb')

# Cliente de RDS Data API
rds_client = boto3.client('rds-data')

# Cliente de SNS para notificaciones
sns_client = boto3.client('sns')

# Cliente de SQS para procesamiento asíncrono
sqs_client = boto3.client('sqs')


def lambda_handler(event, context):
    """
    Handler principal para realizar transferencias
    
    Args:
        event: Evento de Lambda
        context: Contexto de Lambda
        
    Returns:
        Respuesta HTTP con resultado de la transferencia
    """
    try:
        # Validar método HTTP
        if event.get('httpMethod') != 'POST':
            return create_response(405, APIResponse(
                success=False,
                message="Método no permitido",
                error_code="METHOD_NOT_ALLOWED"
            ))
        
        # Validar cuerpo de la petición
        body = validate_request_body(event, [
            'from_account_id', 'to_account_id', 'amount', 'description'
        ])
        
        # Obtener contexto de seguridad
        security_context = get_security_context(event)
        
        if not security_context.user_id:
            return create_response(401, APIResponse(
                success=False,
                message="No autorizado",
                error_code="UNAUTHORIZED"
            ))
        
        # Validar datos de la transferencia
        validation_result = validate_transfer_data(body, security_context)
        if not validation_result['valid']:
            return create_response(400, APIResponse(
                success=False,
                message=validation_result['message'],
                error_code=validation_result['error_code']
            ))
        
        # Crear transacción
        transaction_id = str(uuid.uuid4())
        reference_number = generate_reference_number()
        
        # Procesar transferencia
        transfer_result = process_transfer(
            transaction_id=transaction_id,
            from_account_id=body['from_account_id'],
            to_account_id=body['to_account_id'],
            amount=body['amount'],
            description=body['description'],
            reference_number=reference_number,
            security_context=security_context
        )
        
        if transfer_result['success']:
            # Enviar notificaciones
            send_transfer_notifications(transfer_result['transaction_data'])
            
            # Registrar transacción exitosa
            log_transaction({
                'transaction_id': transaction_id,
                'action': 'TRANSFER_SUCCESS',
                'from_account_id': body['from_account_id'],
                'to_account_id': body['to_account_id'],
                'amount': body['amount']
            }, security_context)
            
            return create_response(200, APIResponse(
                success=True,
                message="Transferencia realizada exitosamente",
                data={
                    'transaction_id': transaction_id,
                    'reference_number': reference_number,
                    'status': 'completed',
                    'amount': body['amount'],
                    'timestamp': datetime.utcnow().isoformat()
                }
            ))
        else:
            # Registrar transacción fallida
            log_transaction({
                'transaction_id': transaction_id,
                'action': 'TRANSFER_FAILED',
                'from_account_id': body['from_account_id'],
                'to_account_id': body['to_account_id'],
                'amount': body['amount'],
                'error': transfer_result['error']
            }, security_context)
            
            return create_response(400, APIResponse(
                success=False,
                message=transfer_result['error'],
                error_code="TRANSFER_FAILED"
            ))
            
    except ValueError as e:
        logger.error(f"Error de validación: {str(e)}")
        return create_response(400, APIResponse(
            success=False,
            message=str(e),
            error_code="VALIDATION_ERROR"
        ))
    except Exception as e:
        logger.error(f"Error en transferencia: {str(e)}")
        return create_response(500, APIResponse(
            success=False,
            message="Error interno del servidor",
            error_code="INTERNAL_ERROR"
        ))


def validate_transfer_data(data: dict, security_context) -> dict:
    """
    Valida los datos de la transferencia
    
    Args:
        data: Datos de la transferencia
        security_context: Contexto de seguridad
        
    Returns:
        Resultado de la validación
    """
    try:
        # Validar monto
        amount = data.get('amount', 0)
        if not validate_amount(amount):
            return {
                'valid': False,
                'message': 'Monto inválido',
                'error_code': 'INVALID_AMOUNT'
            }
        
        # Validar que las cuentas sean diferentes
        if data['from_account_id'] == data['to_account_id']:
            return {
                'valid': False,
                'message': 'No se puede transferir a la misma cuenta',
                'error_code': 'SAME_ACCOUNT'
            }
        
        # Verificar que el usuario tenga acceso a la cuenta origen
        if not verify_account_access(security_context.user_id, data['from_account_id']):
            return {
                'valid': False,
                'message': 'No tiene acceso a la cuenta origen',
                'error_code': 'ACCESS_DENIED'
            }
        
        # Verificar que la cuenta origen tenga suficiente balance
        balance = get_account_balance(data['from_account_id'])
        if not balance or balance['balance'] < amount:
            return {
                'valid': False,
                'message': 'Fondos insuficientes',
                'error_code': 'INSUFFICIENT_FUNDS'
            }
        
        # Verificar que la cuenta destino exista
        if not account_exists(data['to_account_id']):
            return {
                'valid': False,
                'message': 'Cuenta destino no encontrada',
                'error_code': 'DESTINATION_ACCOUNT_NOT_FOUND'
            }
        
        return {'valid': True}
        
    except Exception as e:
        logger.error(f"Error validando transferencia: {str(e)}")
        return {
            'valid': False,
            'message': 'Error de validación',
            'error_code': 'VALIDATION_ERROR'
        }


def verify_account_access(user_id: str, account_id: str) -> bool:
    """
    Verifica que el usuario tenga acceso a la cuenta
    
    Args:
        user_id: ID del usuario
        account_id: ID de la cuenta
        
    Returns:
        True si tiene acceso
    """
    try:
        table_name = os.environ.get('ACCOUNTS_TABLE_NAME', 'bank-accounts')
        table = dynamodb.Table(table_name)
        
        response = table.get_item(
            Key={'account_id': account_id}
        )
        
        if 'Item' in response:
            account_data = response['Item']
            return account_data.get('user_id') == user_id
        
        return False
        
    except Exception as e:
        logger.error(f"Error verificando acceso a cuenta: {str(e)}")
        return False


def get_account_balance(account_id: str) -> dict:
    """
    Obtiene el balance de una cuenta
    
    Args:
        account_id: ID de la cuenta
        
    Returns:
        Datos del balance o None
    """
    try:
        table_name = os.environ.get('ACCOUNTS_TABLE_NAME', 'bank-accounts')
        table = dynamodb.Table(table_name)
        
        response = table.get_item(
            Key={'account_id': account_id}
        )
        
        if 'Item' in response:
            account_data = response['Item']
            return {
                'account_id': account_data['account_id'],
                'balance': float(account_data['balance']),
                'currency': account_data['currency']
            }
        
        return None
        
    except Exception as e:
        logger.error(f"Error obteniendo balance: {str(e)}")
        return None


def account_exists(account_id: str) -> bool:
    """
    Verifica si una cuenta existe
    
    Args:
        account_id: ID de la cuenta
        
    Returns:
        True si la cuenta existe
    """
    try:
        table_name = os.environ.get('ACCOUNTS_TABLE_NAME', 'bank-accounts')
        table = dynamodb.Table(table_name)
        
        response = table.get_item(
            Key={'account_id': account_id}
        )
        
        return 'Item' in response
        
    except Exception as e:
        logger.error(f"Error verificando existencia de cuenta: {str(e)}")
        return False


def process_transfer(transaction_id: str, from_account_id: str, to_account_id: str, 
                   amount: float, description: str, reference_number: str, 
                   security_context) -> dict:
    """
    Procesa la transferencia entre cuentas
    
    Args:
        transaction_id: ID de la transacción
        from_account_id: ID de la cuenta origen
        to_account_id: ID de la cuenta destino
        amount: Monto a transferir
        description: Descripción de la transferencia
        reference_number: Número de referencia
        security_context: Contexto de seguridad
        
    Returns:
        Resultado del procesamiento
    """
    try:
        # Crear registro de transacción
        transaction_data = create_transaction_record(
            transaction_id=transaction_id,
            from_account_id=from_account_id,
            to_account_id=to_account_id,
            amount=amount,
            description=description,
            reference_number=reference_number,
            security_context=security_context
        )
        
        # Procesar en base de datos híbrida
        # 1. Actualizar balance en DynamoDB (cache)
        update_balance_dynamodb(from_account_id, -amount)
        update_balance_dynamodb(to_account_id, amount)
        
        # 2. Enviar a cola SQS para procesamiento en RDS
        queue_transaction_for_rds(transaction_data)
        
        return {
            'success': True,
            'transaction_data': transaction_data
        }
        
    except Exception as e:
        logger.error(f"Error procesando transferencia: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }


def create_transaction_record(transaction_id: str, from_account_id: str, 
                           to_account_id: str, amount: float, description: str,
                           reference_number: str, security_context) -> dict:
    """
    Crea el registro de transacción en DynamoDB
    
    Args:
        transaction_id: ID de la transacción
        from_account_id: ID de la cuenta origen
        to_account_id: ID de la cuenta destino
        amount: Monto a transferir
        description: Descripción
        reference_number: Número de referencia
        security_context: Contexto de seguridad
        
    Returns:
        Datos de la transacción creada
    """
    try:
        table_name = os.environ.get('TRANSACTIONS_TABLE_NAME', 'bank-transactions')
        table = dynamodb.Table(table_name)
        
        current_time = datetime.utcnow().isoformat()
        
        transaction_data = {
            'transaction_id': transaction_id,
            'from_account_id': from_account_id,
            'to_account_id': to_account_id,
            'amount': amount,
            'transaction_type': 'transfer',
            'status': 'completed',
            'description': description,
            'reference_number': reference_number,
            'created_at': current_time,
            'updated_at': current_time,
            'user_id': security_context.user_id,
            'ip_address': security_context.ip_address,
            'session_id': security_context.session_id
        }
        
        table.put_item(Item=transaction_data)
        
        return transaction_data
        
    except Exception as e:
        logger.error(f"Error creando registro de transacción: {str(e)}")
        raise


def update_balance_dynamodb(account_id: str, amount_change: float):
    """
    Actualiza el balance en DynamoDB
    
    Args:
        account_id: ID de la cuenta
        amount_change: Cambio en el balance (positivo o negativo)
    """
    try:
        table_name = os.environ.get('ACCOUNTS_TABLE_NAME', 'bank-accounts')
        table = dynamodb.Table(table_name)
        
        table.update_item(
            Key={'account_id': account_id},
            UpdateExpression='ADD balance :amount SET updated_at = :timestamp',
            ExpressionAttributeValues={
                ':amount': amount_change,
                ':timestamp': datetime.utcnow().isoformat()
            }
        )
        
        logger.info(f"Balance actualizado en DynamoDB para cuenta {account_id}: {amount_change}")
        
    except Exception as e:
        logger.error(f"Error actualizando balance en DynamoDB: {str(e)}")
        raise


def queue_transaction_for_rds(transaction_data: dict):
    """
    Envía la transacción a la cola SQS para procesamiento en RDS
    
    Args:
        transaction_data: Datos de la transacción
    """
    try:
        queue_url = os.environ.get('TRANSACTION_QUEUE_URL')
        
        if queue_url:
            sqs_client.send_message(
                QueueUrl=queue_url,
                MessageBody=json.dumps(transaction_data),
                MessageAttributes={
                    'transaction_type': {
                        'StringValue': 'transfer',
                        'DataType': 'String'
                    },
                    'priority': {
                        'StringValue': 'high',
                        'DataType': 'String'
                    }
                }
            )
            
            logger.info(f"Transacción encolada para RDS: {transaction_data['transaction_id']}")
        
    except Exception as e:
        logger.error(f"Error encolando transacción: {str(e)}")


def send_transfer_notifications(transaction_data: dict):
    """
    Envía notificaciones sobre la transferencia
    
    Args:
        transaction_data: Datos de la transacción
    """
    try:
        topic_arn = os.environ.get('NOTIFICATIONS_TOPIC_ARN')
        
        if topic_arn:
            # Notificación para cuenta origen
            origin_message = {
                'account_id': transaction_data['from_account_id'],
                'type': 'transfer_debit',
                'amount': transaction_data['amount'],
                'reference_number': transaction_data['reference_number'],
                'description': transaction_data['description'],
                'timestamp': transaction_data['created_at']
            }
            
            # Notificación para cuenta destino
            destination_message = {
                'account_id': transaction_data['to_account_id'],
                'type': 'transfer_credit',
                'amount': transaction_data['amount'],
                'reference_number': transaction_data['reference_number'],
                'description': transaction_data['description'],
                'timestamp': transaction_data['created_at']
            }
            
            sns_client.publish(
                TopicArn=topic_arn,
                Message=json.dumps(origin_message),
                Subject='Transferencia realizada'
            )
            
            sns_client.publish(
                TopicArn=topic_arn,
                Message=json.dumps(destination_message),
                Subject='Transferencia recibida'
            )
            
            logger.info(f"Notificaciones enviadas para transacción: {transaction_data['transaction_id']}")
        
    except Exception as e:
        logger.error(f"Error enviando notificaciones: {str(e)}")
