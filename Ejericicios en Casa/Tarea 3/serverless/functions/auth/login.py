"""
Función Lambda para autenticación de usuarios
"""

import json
import logging
import boto3
import hashlib
import hmac
import base64
from datetime import datetime, timedelta
import os
import sys

# Agregar el directorio shared al path
sys.path.append('/opt/python')
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'shared'))

from models import User, AuthResponse, APIResponse
from utils import validate_request_body, create_response, get_secret, encrypt_data

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Cliente de Cognito
cognito_client = boto3.client('cognito-idp')

# Cliente de DynamoDB
dynamodb = boto3.resource('dynamodb')


def lambda_handler(event, context):
    """
    Handler principal para la función de login
    
    Args:
        event: Evento de Lambda
        context: Contexto de Lambda
        
    Returns:
        Respuesta HTTP con tokens de autenticación
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
        body = validate_request_body(event, ['email', 'password'])
        
        email = body['email']
        password = body['password']
        
        # Autenticar usuario con Cognito
        auth_response = authenticate_user(email, password)
        
        if auth_response:
            # Registrar login exitoso
            log_user_activity(email, 'LOGIN_SUCCESS', event)
            
            return create_response(200, APIResponse(
                success=True,
                message="Autenticación exitosa",
                data=auth_response.__dict__
            ))
        else:
            # Registrar intento fallido
            log_user_activity(email, 'LOGIN_FAILED', event)
            
            return create_response(401, APIResponse(
                success=False,
                message="Credenciales inválidas",
                error_code="INVALID_CREDENTIALS"
            ))
            
    except ValueError as e:
        logger.error(f"Error de validación: {str(e)}")
        return create_response(400, APIResponse(
            success=False,
            message=str(e),
            error_code="VALIDATION_ERROR"
        ))
    except Exception as e:
        logger.error(f"Error en login: {str(e)}")
        return create_response(500, APIResponse(
            success=False,
            message="Error interno del servidor",
            error_code="INTERNAL_ERROR"
        ))


def authenticate_user(email: str, password: str) -> AuthResponse:
    """
    Autentica un usuario usando AWS Cognito
    
    Args:
        email: Email del usuario
        password: Contraseña del usuario
        
    Returns:
        Respuesta de autenticación o None si falla
    """
    try:
        user_pool_id = os.environ.get('USER_POOL_ID')
        client_id = os.environ.get('COGNITO_CLIENT_ID')
        
        if not user_pool_id or not client_id:
            raise Exception("Configuración de Cognito faltante")
        
        # Intentar autenticación con Cognito
        response = cognito_client.admin_initiate_auth(
            UserPoolId=user_pool_id,
            ClientId=client_id,
            AuthFlow='ADMIN_NO_SRP_AUTH',
            AuthParameters={
                'USERNAME': email,
                'PASSWORD': password
            }
        )
        
        if 'AuthenticationResult' in response:
            auth_result = response['AuthenticationResult']
            
            # Generar tokens adicionales si es necesario
            access_token = auth_result['AccessToken']
            refresh_token = auth_result.get('RefreshToken', '')
            expires_in = auth_result['ExpiresIn']
            
            # Obtener información del usuario
            user_info = get_user_info(email)
            
            return AuthResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                expires_in=expires_in,
                token_type="Bearer"
            )
        
        return None
        
    except cognito_client.exceptions.NotAuthorizedException:
        logger.warning(f"Credenciales inválidas para usuario: {email}")
        return None
    except cognito_client.exceptions.UserNotFoundException:
        logger.warning(f"Usuario no encontrado: {email}")
        return None
    except Exception as e:
        logger.error(f"Error autenticando usuario {email}: {str(e)}")
        raise


def get_user_info(email: str) -> dict:
    """
    Obtiene información del usuario desde DynamoDB
    
    Args:
        email: Email del usuario
        
    Returns:
        Información del usuario
    """
    try:
        table_name = os.environ.get('USERS_TABLE_NAME', 'bank-users')
        table = dynamodb.Table(table_name)
        
        response = table.get_item(
            Key={'email': email}
        )
        
        if 'Item' in response:
            return response['Item']
        
        return {}
        
    except Exception as e:
        logger.error(f"Error obteniendo información del usuario {email}: {str(e)}")
        return {}


def log_user_activity(email: str, activity: str, event: dict):
    """
    Registra actividad del usuario para auditoría
    
    Args:
        email: Email del usuario
        activity: Tipo de actividad
        event: Evento de Lambda
    """
    try:
        table_name = os.environ.get('AUDIT_TABLE_NAME', 'bank-audit-logs')
        table = dynamodb.Table(table_name)
        
        request_context = event.get('requestContext', {})
        
        audit_record = {
            'user_email': email,
            'activity': activity,
            'timestamp': datetime.utcnow().isoformat(),
            'ip_address': request_context.get('identity', {}).get('sourceIp', ''),
            'user_agent': event.get('headers', {}).get('User-Agent', ''),
            'session_id': str(hashlib.md5(f"{email}{datetime.utcnow()}".encode()).hexdigest()[:16])
        }
        
        table.put_item(Item=audit_record)
        logger.info(f"Actividad registrada: {activity} para {email}")
        
    except Exception as e:
        logger.error(f"Error registrando actividad: {str(e)}")


def refresh_token_handler(event, context):
    """
    Handler para refrescar tokens de autenticación
    
    Args:
        event: Evento de Lambda
        context: Contexto de Lambda
        
    Returns:
        Respuesta HTTP con nuevos tokens
    """
    try:
        if event.get('httpMethod') != 'POST':
            return create_response(405, APIResponse(
                success=False,
                message="Método no permitido",
                error_code="METHOD_NOT_ALLOWED"
            ))
        
        body = validate_request_body(event, ['refresh_token'])
        refresh_token = body['refresh_token']
        
        user_pool_id = os.environ.get('USER_POOL_ID')
        client_id = os.environ.get('COGNITO_CLIENT_ID')
        
        response = cognito_client.admin_initiate_auth(
            UserPoolId=user_pool_id,
            ClientId=client_id,
            AuthFlow='REFRESH_TOKEN_AUTH',
            AuthParameters={
                'REFRESH_TOKEN': refresh_token
            }
        )
        
        if 'AuthenticationResult' in response:
            auth_result = response['AuthenticationResult']
            
            return create_response(200, APIResponse(
                success=True,
                message="Token refrescado exitosamente",
                data={
                    'access_token': auth_result['AccessToken'],
                    'expires_in': auth_result['ExpiresIn'],
                    'token_type': 'Bearer'
                }
            ))
        
        return create_response(401, APIResponse(
            success=False,
            message="Token de refresh inválido",
            error_code="INVALID_REFRESH_TOKEN"
        ))
        
    except Exception as e:
        logger.error(f"Error refrescando token: {str(e)}")
        return create_response(500, APIResponse(
            success=False,
            message="Error interno del servidor",
            error_code="INTERNAL_ERROR"
        ))
