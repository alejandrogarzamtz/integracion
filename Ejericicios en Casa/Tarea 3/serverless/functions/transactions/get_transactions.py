"""
Función Lambda para obtener el historial de transacciones
"""

import json
import logging
import boto3
import os
import sys
from datetime import datetime, timedelta

# Agregar el directorio shared al path
sys.path.append('/opt/python')
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'shared'))

from models import Transaction, APIResponse
from utils import create_response, get_security_context, log_transaction

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Cliente de DynamoDB
dynamodb = boto3.resource('dynamodb')


def lambda_handler(event, context):
    """
    Handler principal para obtener transacciones
    
    Args:
        event: Evento de Lambda
        context: Contexto de Lambda
        
    Returns:
        Respuesta HTTP con el historial de transacciones
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
        
        # Obtener parámetros de consulta
        query_params = event.get('queryStringParameters') or {}
        
        account_id = query_params.get('account_id')
        limit = int(query_params.get('limit', 50))
        offset = int(query_params.get('offset', 0))
        start_date = query_params.get('start_date')
        end_date = query_params.get('end_date')
        transaction_type = query_params.get('transaction_type')
        
        # Validar límites
        if limit > 100:
            limit = 100
        
        # Obtener transacciones
        transactions = get_transactions(
            user_id=security_context.user_id,
            account_id=account_id,
            limit=limit,
            offset=offset,
            start_date=start_date,
            end_date=end_date,
            transaction_type=transaction_type
        )
        
        # Registrar consulta
        log_transaction({
            'transaction_id': f"TRANSACTIONS_QUERY_{security_context.user_id}",
            'action': 'GET_TRANSACTIONS',
            'user_id': security_context.user_id,
            'account_id': account_id,
            'limit': limit,
            'offset': offset
        }, security_context)
        
        return create_response(200, APIResponse(
            success=True,
            message="Transacciones obtenidas exitosamente",
            data={
                'transactions': transactions,
                'pagination': {
                    'limit': limit,
                    'offset': offset,
                    'count': len(transactions)
                }
            }
        ))
        
    except Exception as e:
        logger.error(f"Error obteniendo transacciones: {str(e)}")
        return create_response(500, APIResponse(
            success=False,
            message="Error interno del servidor",
            error_code="INTERNAL_ERROR"
        ))


def get_transactions(user_id: str, account_id: str = None, limit: int = 50, 
                    offset: int = 0, start_date: str = None, end_date: str = None,
                    transaction_type: str = None) -> list:
    """
    Obtiene transacciones del usuario
    
    Args:
        user_id: ID del usuario
        account_id: ID de la cuenta (opcional)
        limit: Límite de resultados
        offset: Desplazamiento
        start_date: Fecha de inicio (opcional)
        end_date: Fecha de fin (opcional)
        transaction_type: Tipo de transacción (opcional)
        
    Returns:
        Lista de transacciones
    """
    try:
        table_name = os.environ.get('TRANSACTIONS_TABLE_NAME', 'bank-transactions')
        table = dynamodb.Table(table_name)
        
        # Construir expresión de filtro
        filter_expression = 'user_id = :user_id'
        expression_values = {':user_id': user_id}
        
        if account_id:
            filter_expression += ' AND (from_account_id = :account_id OR to_account_id = :account_id)'
            expression_values[':account_id'] = account_id
        
        if transaction_type:
            filter_expression += ' AND transaction_type = :transaction_type'
            expression_values[':transaction_type'] = transaction_type
        
        if start_date:
            filter_expression += ' AND created_at >= :start_date'
            expression_values[':start_date'] = start_date
        
        if end_date:
            filter_expression += ' AND created_at <= :end_date'
            expression_values[':end_date'] = end_date
        
        # Realizar consulta
        response = table.scan(
            FilterExpression=filter_expression,
            ExpressionAttributeValues=expression_values,
            Limit=limit + offset  # Obtener más para poder hacer offset
        )
        
        # Aplicar offset y limit manualmente
        items = response['Items']
        
        # Ordenar por fecha de creación (más recientes primero)
        items.sort(key=lambda x: x['created_at'], reverse=True)
        
        # Aplicar paginación
        paginated_items = items[offset:offset + limit]
        
        # Formatear transacciones
        transactions = []
        for item in paginated_items:
            transaction = format_transaction(item)
            transactions.append(transaction)
        
        return transactions
        
    except Exception as e:
        logger.error(f"Error obteniendo transacciones: {str(e)}")
        return []


def format_transaction(item: dict) -> dict:
    """
    Formatea una transacción para la respuesta
    
    Args:
        item: Item de DynamoDB
        
    Returns:
        Transacción formateada
    """
    try:
        return {
            'transaction_id': item['transaction_id'],
            'from_account_id': item.get('from_account_id'),
            'to_account_id': item.get('to_account_id'),
            'amount': float(item['amount']),
            'transaction_type': item['transaction_type'],
            'status': item['status'],
            'description': item['description'],
            'reference_number': item['reference_number'],
            'created_at': item['created_at'],
            'updated_at': item['updated_at'],
            'metadata': item.get('metadata', {})
        }
        
    except Exception as e:
        logger.error(f"Error formateando transacción: {str(e)}")
        return {}


def get_transaction_by_id_handler(event, context):
    """
    Handler para obtener una transacción específica por ID
    
    Args:
        event: Evento de Lambda
        context: Contexto de Lambda
        
    Returns:
        Respuesta HTTP con la transacción
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
        
        # Obtener transaction_id de los parámetros de la ruta
        transaction_id = event.get('pathParameters', {}).get('transaction_id')
        
        if not transaction_id:
            return create_response(400, APIResponse(
                success=False,
                message="ID de transacción requerido",
                error_code="MISSING_TRANSACTION_ID"
            ))
        
        # Obtener transacción
        transaction = get_transaction_by_id(transaction_id, security_context.user_id)
        
        if transaction:
            # Registrar consulta
            log_transaction({
                'transaction_id': transaction_id,
                'action': 'GET_TRANSACTION_BY_ID',
                'user_id': security_context.user_id
            }, security_context)
            
            return create_response(200, APIResponse(
                success=True,
                message="Transacción obtenida exitosamente",
                data=transaction
            ))
        else:
            return create_response(404, APIResponse(
                success=False,
                message="Transacción no encontrada",
                error_code="TRANSACTION_NOT_FOUND"
            ))
        
    except Exception as e:
        logger.error(f"Error obteniendo transacción: {str(e)}")
        return create_response(500, APIResponse(
            success=False,
            message="Error interno del servidor",
            error_code="INTERNAL_ERROR"
        ))


def get_transaction_by_id(transaction_id: str, user_id: str) -> dict:
    """
    Obtiene una transacción específica por ID
    
    Args:
        transaction_id: ID de la transacción
        user_id: ID del usuario
        
    Returns:
        Transacción o None si no se encuentra
    """
    try:
        table_name = os.environ.get('TRANSACTIONS_TABLE_NAME', 'bank-transactions')
        table = dynamodb.Table(table_name)
        
        response = table.get_item(
            Key={'transaction_id': transaction_id}
        )
        
        if 'Item' in response:
            item = response['Item']
            
            # Verificar que el usuario tenga acceso a esta transacción
            if item.get('user_id') == user_id:
                return format_transaction(item)
        
        return None
        
    except Exception as e:
        logger.error(f"Error obteniendo transacción por ID: {str(e)}")
        return None


def get_transaction_summary_handler(event, context):
    """
    Handler para obtener resumen de transacciones
    
    Args:
        event: Evento de Lambda
        context: Contexto de Lambda
        
    Returns:
        Respuesta HTTP con resumen de transacciones
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
        
        # Obtener parámetros de consulta
        query_params = event.get('queryStringParameters') or {}
        account_id = query_params.get('account_id')
        period = query_params.get('period', 'month')  # day, week, month, year
        
        # Calcular fechas según el período
        end_date = datetime.utcnow()
        if period == 'day':
            start_date = end_date - timedelta(days=1)
        elif period == 'week':
            start_date = end_date - timedelta(weeks=1)
        elif period == 'month':
            start_date = end_date - timedelta(days=30)
        elif period == 'year':
            start_date = end_date - timedelta(days=365)
        else:
            start_date = end_date - timedelta(days=30)
        
        # Obtener resumen
        summary = get_transaction_summary(
            user_id=security_context.user_id,
            account_id=account_id,
            start_date=start_date.isoformat(),
            end_date=end_date.isoformat()
        )
        
        # Registrar consulta
        log_transaction({
            'transaction_id': f"SUMMARY_QUERY_{security_context.user_id}",
            'action': 'GET_TRANSACTION_SUMMARY',
            'user_id': security_context.user_id,
            'account_id': account_id,
            'period': period
        }, security_context)
        
        return create_response(200, APIResponse(
            success=True,
            message="Resumen obtenido exitosamente",
            data=summary
        ))
        
    except Exception as e:
        logger.error(f"Error obteniendo resumen: {str(e)}")
        return create_response(500, APIResponse(
            success=False,
            message="Error interno del servidor",
            error_code="INTERNAL_ERROR"
        ))


def get_transaction_summary(user_id: str, account_id: str = None, 
                           start_date: str = None, end_date: str = None) -> dict:
    """
    Obtiene resumen de transacciones
    
    Args:
        user_id: ID del usuario
        account_id: ID de la cuenta (opcional)
        start_date: Fecha de inicio
        end_date: Fecha de fin
        
    Returns:
        Resumen de transacciones
    """
    try:
        # Obtener todas las transacciones en el período
        transactions = get_transactions(
            user_id=user_id,
            account_id=account_id,
            start_date=start_date,
            end_date=end_date,
            limit=1000  # Obtener más para el resumen
        )
        
        # Calcular estadísticas
        total_transactions = len(transactions)
        total_amount = sum(t['amount'] for t in transactions)
        
        # Separar por tipo
        deposits = [t for t in transactions if t['transaction_type'] == 'deposit']
        withdrawals = [t for t in transactions if t['transaction_type'] == 'withdrawal']
        transfers_out = [t for t in transactions if t['transaction_type'] == 'transfer' and t['from_account_id'] == account_id]
        transfers_in = [t for t in transactions if t['transaction_type'] == 'transfer' and t['to_account_id'] == account_id]
        
        return {
            'period': {
                'start_date': start_date,
                'end_date': end_date
            },
            'summary': {
                'total_transactions': total_transactions,
                'total_amount': total_amount,
                'deposits': {
                    'count': len(deposits),
                    'amount': sum(t['amount'] for t in deposits)
                },
                'withdrawals': {
                    'count': len(withdrawals),
                    'amount': sum(t['amount'] for t in withdrawals)
                },
                'transfers_out': {
                    'count': len(transfers_out),
                    'amount': sum(t['amount'] for t in transfers_out)
                },
                'transfers_in': {
                    'count': len(transfers_in),
                    'amount': sum(t['amount'] for t in transfers_in)
                }
            }
        }
        
    except Exception as e:
        logger.error(f"Error calculando resumen: {str(e)}")
        return {}
