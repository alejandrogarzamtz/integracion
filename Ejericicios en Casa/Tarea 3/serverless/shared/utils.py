"""
Utilidades compartidas para las funciones serverless
"""

import json
import logging
import boto3
from typing import Dict, Any, Optional
from datetime import datetime
from models import APIResponse, SecurityContext
import os


# Configuración de logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Cliente de AWS Secrets Manager
secrets_client = boto3.client('secretsmanager')

# Cliente de AWS KMS
kms_client = boto3.client('kms')

# Cliente de DynamoDB
dynamodb = boto3.resource('dynamodb')


def get_secret(secret_name: str) -> Dict[str, Any]:
    """
    Obtiene un secreto de AWS Secrets Manager
    
    Args:
        secret_name: Nombre del secreto
        
    Returns:
        Diccionario con el secreto
    """
    try:
        response = secrets_client.get_secret_value(SecretId=secret_name)
        return json.loads(response['SecretString'])
    except Exception as e:
        logger.error(f"Error obteniendo secreto {secret_name}: {str(e)}")
        raise


def encrypt_data(data: str, key_id: str) -> str:
    """
    Encripta datos usando AWS KMS
    
    Args:
        data: Datos a encriptar
        key_id: ID de la clave KMS
        
    Returns:
        Datos encriptados en base64
    """
    try:
        response = kms_client.encrypt(
            KeyId=key_id,
            Plaintext=data
        )
        return response['CiphertextBlob'].decode('utf-8')
    except Exception as e:
        logger.error(f"Error encriptando datos: {str(e)}")
        raise


def decrypt_data(encrypted_data: str, key_id: str) -> str:
    """
    Desencripta datos usando AWS KMS
    
    Args:
        encrypted_data: Datos encriptados
        key_id: ID de la clave KMS
        
    Returns:
        Datos desencriptados
    """
    try:
        response = kms_client.decrypt(
            CiphertextBlob=encrypted_data.encode('utf-8'),
            KeyId=key_id
        )
        return response['Plaintext'].decode('utf-8')
    except Exception as e:
        logger.error(f"Error desencriptando datos: {str(e)}")
        raise


def validate_request_body(event: Dict[str, Any], required_fields: list) -> Dict[str, Any]:
    """
    Valida el cuerpo de la petición
    
    Args:
        event: Evento de Lambda
        required_fields: Campos requeridos
        
    Returns:
        Cuerpo de la petición parseado
        
    Raises:
        ValueError: Si faltan campos requeridos
    """
    try:
        body = json.loads(event.get('body', '{}'))
        
        for field in required_fields:
            if field not in body:
                raise ValueError(f"Campo requerido faltante: {field}")
        
        return body
    except json.JSONDecodeError:
        raise ValueError("Cuerpo de la petición inválido")
    except Exception as e:
        logger.error(f"Error validando petición: {str(e)}")
        raise


def create_response(status_code: int, body: APIResponse) -> Dict[str, Any]:
    """
    Crea una respuesta HTTP estándar
    
    Args:
        status_code: Código de estado HTTP
        body: Cuerpo de la respuesta
        
    Returns:
        Respuesta HTTP formateada
    """
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
        },
        'body': json.dumps(body.__dict__, default=str)
    }


def get_security_context(event: Dict[str, Any]) -> SecurityContext:
    """
    Extrae el contexto de seguridad del evento
    
    Args:
        event: Evento de Lambda
        
    Returns:
        Contexto de seguridad
    """
    request_context = event.get('requestContext', {})
    authorizer = request_context.get('authorizer', {})
    
    return SecurityContext(
        user_id=authorizer.get('user_id', ''),
        account_id=authorizer.get('account_id'),
        permissions=authorizer.get('permissions', []),
        session_id=authorizer.get('session_id', ''),
        ip_address=request_context.get('identity', {}).get('sourceIp', ''),
        user_agent=event.get('headers', {}).get('User-Agent', '')
    )


def log_transaction(transaction_data: Dict[str, Any], security_context: SecurityContext):
    """
    Registra una transacción en DynamoDB para auditoría
    
    Args:
        transaction_data: Datos de la transacción
        security_context: Contexto de seguridad
    """
    try:
        table_name = os.environ.get('AUDIT_TABLE_NAME', 'bank-audit-logs')
        table = dynamodb.Table(table_name)
        
        audit_record = {
            'transaction_id': transaction_data.get('transaction_id'),
            'user_id': security_context.user_id,
            'account_id': security_context.account_id,
            'action': transaction_data.get('action'),
            'timestamp': datetime.utcnow().isoformat(),
            'ip_address': security_context.ip_address,
            'user_agent': security_context.user_agent,
            'session_id': security_context.session_id,
            'data': transaction_data
        }
        
        table.put_item(Item=audit_record)
        logger.info(f"Transacción auditada: {transaction_data.get('transaction_id')}")
        
    except Exception as e:
        logger.error(f"Error registrando transacción: {str(e)}")


def validate_amount(amount: float) -> bool:
    """
    Valida que el monto sea válido
    
    Args:
        amount: Monto a validar
        
    Returns:
        True si es válido, False en caso contrario
    """
    return amount > 0 and amount <= 1000000  # Límite de $1M por transacción


def generate_reference_number() -> str:
    """
    Genera un número de referencia único para transacciones
    
    Returns:
        Número de referencia único
    """
    import uuid
    return f"TXN-{datetime.utcnow().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
