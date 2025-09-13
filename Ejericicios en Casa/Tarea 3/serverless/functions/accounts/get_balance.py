"""
Función Lambda para obtener el balance de una cuenta
"""

import json
import logging
import boto3
import os
import sys

# Agregar el directorio shared al path
sys.path.append('/opt/python')
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'shared'))

from models import Account, APIResponse
from utils import validate_request_body, create_response, get_security_context, log_transaction

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Cliente de DynamoDB
dynamodb = boto3.resource('dynamodb')

# Cliente de RDS Data API para consultas SQL
rds_client = boto3.client('rds-data')


def lambda_handler(event, context):
    """
    Handler principal para obtener el balance de una cuenta
    
    Args:
        event: Evento de Lambda
        context: Contexto de Lambda
        
    Returns:
        Respuesta HTTP con el balance de la cuenta
    """
    try:
        # Validar método HTTP
        if event.get('httpMethod') != 'GET':
            return create_response(405, APIResponse(
                success=False,
                message="Método no permitido",
                error_code="METHOD_NOT_ALLOWED"
            ))
        
        # Obtener contexto de seguridad
        security_context = get_security_context(event)
        
        if not security_context.user_id:
            return create_response(401, APIResponse(
                success=False,
                message="No autorizado",
                error_code="UNAUTHORIZED"
            ))
        
        # Obtener account_id de los parámetros de la ruta
        account_id = event.get('pathParameters', {}).get('account_id')
        
        if not account_id:
            return create_response(400, APIResponse(
                success=False,
                message="ID de cuenta requerido",
                error_code="MISSING_ACCOUNT_ID"
            ))
        
        # Verificar que el usuario tenga acceso a esta cuenta
        if not verify_account_access(security_context.user_id, account_id):
            return create_response(403, APIResponse(
                success=False,
                message="Acceso denegado a esta cuenta",
                error_code="ACCESS_DENIED"
            ))
        
        # Obtener balance de la cuenta
        balance_data = get_account_balance(account_id)
        
        if balance_data:
            # Registrar consulta de balance
            log_transaction({
                'transaction_id': f"BALANCE_QUERY_{account_id}",
                'action': 'GET_BALANCE',
                'account_id': account_id,
                'amount': balance_data['balance']
            }, security_context)
            
            return create_response(200, APIResponse(
                success=True,
                message="Balance obtenido exitosamente",
                data=balance_data
            ))
        else:
            return create_response(404, APIResponse(
                success=False,
                message="Cuenta no encontrada",
                error_code="ACCOUNT_NOT_FOUND"
            ))
            
    except Exception as e:
        logger.error(f"Error obteniendo balance: {str(e)}")
        return create_response(500, APIResponse(
            success=False,
            message="Error interno del servidor",
            error_code="INTERNAL_ERROR"
        ))


def verify_account_access(user_id: str, account_id: str) -> bool:
    """
    Verifica que el usuario tenga acceso a la cuenta
    
    Args:
        user_id: ID del usuario
        account_id: ID de la cuenta
        
    Returns:
        True si tiene acceso, False en caso contrario
    """
    try:
        # Consultar en la base de datos híbrida
        # Primero verificar en DynamoDB (cache)
        table_name = os.environ.get('ACCOUNTS_TABLE_NAME', 'bank-accounts')
        table = dynamodb.Table(table_name)
        
        response = table.get_item(
            Key={'account_id': account_id}
        )
        
        if 'Item' in response:
            account_data = response['Item']
            return account_data.get('user_id') == user_id
        
        # Si no está en cache, consultar en RDS
        return verify_account_access_rds(user_id, account_id)
        
    except Exception as e:
        logger.error(f"Error verificando acceso a cuenta: {str(e)}")
        return False


def verify_account_access_rds(user_id: str, account_id: str) -> bool:
    """
    Verifica acceso a cuenta en RDS (base de datos principal)
    
    Args:
        user_id: ID del usuario
        account_id: ID de la cuenta
        
    Returns:
        True si tiene acceso
    """
    try:
        cluster_arn = os.environ.get('RDS_CLUSTER_ARN')
        secret_arn = os.environ.get('RDS_SECRET_ARN')
        database_name = os.environ.get('RDS_DATABASE_NAME', 'banking')
        
        if not cluster_arn or not secret_arn:
            logger.warning("Configuración de RDS faltante, usando solo DynamoDB")
            return False
        
        # Consulta SQL para verificar acceso
        sql = """
        SELECT COUNT(*) as count 
        FROM accounts 
        WHERE account_id = :account_id 
        AND user_id = :user_id 
        AND is_active = true
        """
        
        response = rds_client.execute_statement(
            resourceArn=cluster_arn,
            secretArn=secret_arn,
            database=database_name,
            sql=sql,
            parameters=[
                {'name': 'account_id', 'value': {'stringValue': account_id}},
                {'name': 'user_id', 'value': {'stringValue': user_id}}
            ]
        )
        
        if response['records']:
            count = response['records'][0][0]['longValue']
            return count > 0
        
        return False
        
    except Exception as e:
        logger.error(f"Error verificando acceso en RDS: {str(e)}")
        return False


def get_account_balance(account_id: str) -> dict:
    """
    Obtiene el balance de una cuenta
    
    Args:
        account_id: ID de la cuenta
        
    Returns:
        Datos del balance o None si no se encuentra
    """
    try:
        # Intentar obtener desde DynamoDB primero (cache)
        balance_data = get_balance_from_dynamodb(account_id)
        
        if balance_data:
            return balance_data
        
        # Si no está en cache, obtener desde RDS
        return get_balance_from_rds(account_id)
        
    except Exception as e:
        logger.error(f"Error obteniendo balance: {str(e)}")
        return None


def get_balance_from_dynamodb(account_id: str) -> dict:
    """
    Obtiene balance desde DynamoDB (cache)
    
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
                'account_number': account_data['account_number'],
                'account_type': account_data['account_type'],
                'balance': float(account_data['balance']),
                'currency': account_data['currency'],
                'last_updated': account_data['updated_at'],
                'source': 'cache'
            }
        
        return None
        
    except Exception as e:
        logger.error(f"Error obteniendo balance desde DynamoDB: {str(e)}")
        return None


def get_balance_from_rds(account_id: str) -> dict:
    """
    Obtiene balance desde RDS (fuente principal)
    
    Args:
        account_id: ID de la cuenta
        
    Returns:
        Datos del balance o None
    """
    try:
        cluster_arn = os.environ.get('RDS_CLUSTER_ARN')
        secret_arn = os.environ.get('RDS_SECRET_ARN')
        database_name = os.environ.get('RDS_DATABASE_NAME', 'banking')
        
        if not cluster_arn or not secret_arn:
            logger.warning("Configuración de RDS faltante")
            return None
        
        # Consulta SQL para obtener balance
        sql = """
        SELECT 
            account_id,
            account_number,
            account_type,
            balance,
            currency,
            updated_at
        FROM accounts 
        WHERE account_id = :account_id 
        AND is_active = true
        """
        
        response = rds_client.execute_statement(
            resourceArn=cluster_arn,
            secretArn=secret_arn,
            database=database_name,
            sql=sql,
            parameters=[
                {'name': 'account_id', 'value': {'stringValue': account_id}}
            ]
        )
        
        if response['records']:
            record = response['records'][0]
            return {
                'account_id': record[0]['stringValue'],
                'account_number': record[1]['stringValue'],
                'account_type': record[2]['stringValue'],
                'balance': float(record[3]['doubleValue']),
                'currency': record[4]['stringValue'],
                'last_updated': record[5]['stringValue'],
                'source': 'database'
            }
        
        return None
        
    except Exception as e:
        logger.error(f"Error obteniendo balance desde RDS: {str(e)}")
        return None


def get_all_accounts_handler(event, context):
    """
    Handler para obtener todas las cuentas de un usuario
    
    Args:
        event: Evento de Lambda
        context: Contexto de Lambda
        
    Returns:
        Respuesta HTTP con todas las cuentas del usuario
    """
    try:
        # Validar método HTTP
        if event.get('httpMethod') != 'GET':
            return create_response(405, APIResponse(
                success=False,
                message="Método no permitido",
                error_code="METHOD_NOT_ALLOWED"
            ))
        
        # Obtener contexto de seguridad
        security_context = get_security_context(event)
        
        if not security_context.user_id:
            return create_response(401, APIResponse(
                success=False,
                message="No autorizado",
                error_code="UNAUTHORIZED"
            ))
        
        # Obtener todas las cuentas del usuario
        accounts = get_user_accounts(security_context.user_id)
        
        # Registrar consulta
        log_transaction({
            'transaction_id': f"ACCOUNTS_QUERY_{security_context.user_id}",
            'action': 'GET_ALL_ACCOUNTS',
            'user_id': security_context.user_id,
            'account_count': len(accounts)
        }, security_context)
        
        return create_response(200, APIResponse(
            success=True,
            message="Cuentas obtenidas exitosamente",
            data={'accounts': accounts}
        ))
        
    except Exception as e:
        logger.error(f"Error obteniendo cuentas: {str(e)}")
        return create_response(500, APIResponse(
            success=False,
            message="Error interno del servidor",
            error_code="INTERNAL_ERROR"
        ))


def get_user_accounts(user_id: str) -> list:
    """
    Obtiene todas las cuentas de un usuario
    
    Args:
        user_id: ID del usuario
        
    Returns:
        Lista de cuentas del usuario
    """
    try:
        table_name = os.environ.get('ACCOUNTS_TABLE_NAME', 'bank-accounts')
        table = dynamodb.Table(table_name)
        
        response = table.query(
            IndexName='user_id-index',
            KeyConditionExpression='user_id = :user_id',
            ExpressionAttributeValues={
                ':user_id': user_id
            }
        )
        
        accounts = []
        for item in response['Items']:
            accounts.append({
                'account_id': item['account_id'],
                'account_number': item['account_number'],
                'account_type': item['account_type'],
                'balance': float(item['balance']),
                'currency': item['currency'],
                'created_at': item['created_at'],
                'is_active': item['is_active']
            })
        
        return accounts
        
    except Exception as e:
        logger.error(f"Error obteniendo cuentas del usuario: {str(e)}")
        return []
