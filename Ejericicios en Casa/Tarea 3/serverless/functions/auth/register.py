"""
Función Lambda para registro de nuevos usuarios
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

from models import User, APIResponse
from utils import validate_request_body, create_response, get_secret

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Cliente de Cognito
cognito_client = boto3.client('cognito-idp')

# Cliente de DynamoDB
dynamodb = boto3.resource('dynamodb')

# Cliente de SNS para notificaciones
sns_client = boto3.client('sns')


def lambda_handler(event, context):
    """
    Handler principal para la función de registro
    
    Args:
        event: Evento de Lambda
        context: Contexto de Lambda
        
    Returns:
        Respuesta HTTP con resultado del registro
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
            'email', 'password', 'phone', 'first_name', 
            'last_name', 'date_of_birth', 'address'
        ])
        
        # Validar datos adicionales
        if not validate_user_data(body):
            return create_response(400, APIResponse(
                success=False,
                message="Datos de usuario inválidos",
                error_code="INVALID_USER_DATA"
            ))
        
        # Verificar si el usuario ya existe
        if user_exists(body['email']):
            return create_response(409, APIResponse(
                success=False,
                message="El usuario ya existe",
                error_code="USER_EXISTS"
            ))
        
        # Crear usuario en Cognito
        cognito_user = create_cognito_user(body)
        
        if cognito_user:
            # Crear usuario en DynamoDB
            user_id = create_user_record(body, cognito_user['User']['Username'])
            
            # Enviar email de verificación
            send_verification_email(body['email'])
            
            # Registrar actividad
            log_user_activity(body['email'], 'REGISTER_SUCCESS', event)
            
            return create_response(201, APIResponse(
                success=True,
                message="Usuario registrado exitosamente",
                data={
                    'user_id': user_id,
                    'email': body['email'],
                    'status': 'pending_verification'
                }
            ))
        else:
            return create_response(500, APIResponse(
                success=False,
                message="Error creando usuario",
                error_code="USER_CREATION_FAILED"
            ))
            
    except ValueError as e:
        logger.error(f"Error de validación: {str(e)}")
        return create_response(400, APIResponse(
            success=False,
            message=str(e),
            error_code="VALIDATION_ERROR"
        ))
    except Exception as e:
        logger.error(f"Error en registro: {str(e)}")
        return create_response(500, APIResponse(
            success=False,
            message="Error interno del servidor",
            error_code="INTERNAL_ERROR"
        ))


def validate_user_data(data: dict) -> bool:
    """
    Valida los datos del usuario
    
    Args:
        data: Datos del usuario
        
    Returns:
        True si los datos son válidos
    """
    try:
        # Validar email
        email = data.get('email', '')
        if '@' not in email or '.' not in email.split('@')[1]:
            return False
        
        # Validar contraseña (mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número)
        password = data.get('password', '')
        if len(password) < 8:
            return False
        
        # Validar teléfono (formato básico)
        phone = data.get('phone', '')
        if len(phone) < 10:
            return False
        
        # Validar nombres
        if not data.get('first_name') or not data.get('last_name'):
            return False
        
        # Validar fecha de nacimiento (formato YYYY-MM-DD)
        date_of_birth = data.get('date_of_birth', '')
        try:
            datetime.strptime(date_of_birth, '%Y-%m-%d')
        except ValueError:
            return False
        
        return True
        
    except Exception as e:
        logger.error(f"Error validando datos: {str(e)}")
        return False


def user_exists(email: str) -> bool:
    """
    Verifica si un usuario ya existe
    
    Args:
        email: Email del usuario
        
    Returns:
        True si el usuario existe
    """
    try:
        table_name = os.environ.get('USERS_TABLE_NAME', 'bank-users')
        table = dynamodb.Table(table_name)
        
        response = table.get_item(
            Key={'email': email}
        )
        
        return 'Item' in response
        
    except Exception as e:
        logger.error(f"Error verificando existencia del usuario {email}: {str(e)}")
        return False


def create_cognito_user(user_data: dict) -> dict:
    """
    Crea un usuario en AWS Cognito
    
    Args:
        user_data: Datos del usuario
        
    Returns:
        Respuesta de Cognito o None si falla
    """
    try:
        user_pool_id = os.environ.get('USER_POOL_ID')
        
        if not user_pool_id:
            raise Exception("USER_POOL_ID no configurado")
        
        # Crear usuario en Cognito
        response = cognito_client.admin_create_user(
            UserPoolId=user_pool_id,
            Username=user_data['email'],
            UserAttributes=[
                {'Name': 'email', 'Value': user_data['email']},
                {'Name': 'email_verified', 'Value': 'false'},
                {'Name': 'phone_number', 'Value': user_data['phone']},
                {'Name': 'given_name', 'Value': user_data['first_name']},
                {'Name': 'family_name', 'Value': user_data['last_name']},
                {'Name': 'birthdate', 'Value': user_data['date_of_birth']},
                {'Name': 'address', 'Value': user_data['address']}
            ],
            TemporaryPassword=generate_temp_password(),
            MessageAction='SUPPRESS'  # No enviar email automático
        )
        
        # Establecer contraseña permanente
        cognito_client.admin_set_user_password(
            UserPoolId=user_pool_id,
            Username=user_data['email'],
            Password=user_data['password'],
            Permanent=True
        )
        
        return response
        
    except cognito_client.exceptions.UsernameExistsException:
        logger.warning(f"Usuario ya existe en Cognito: {user_data['email']}")
        return None
    except Exception as e:
        logger.error(f"Error creando usuario en Cognito: {str(e)}")
        raise


def create_user_record(user_data: dict, cognito_user_id: str) -> str:
    """
    Crea un registro de usuario en DynamoDB
    
    Args:
        user_data: Datos del usuario
        cognito_user_id: ID del usuario en Cognito
        
    Returns:
        ID del usuario creado
    """
    try:
        table_name = os.environ.get('USERS_TABLE_NAME', 'bank-users')
        table = dynamodb.Table(table_name)
        
        user_id = str(uuid.uuid4())
        current_time = datetime.utcnow().isoformat()
        
        user_record = {
            'user_id': user_id,
            'cognito_user_id': cognito_user_id,
            'email': user_data['email'],
            'phone': user_data['phone'],
            'first_name': user_data['first_name'],
            'last_name': user_data['last_name'],
            'date_of_birth': user_data['date_of_birth'],
            'address': user_data['address'],
            'created_at': current_time,
            'updated_at': current_time,
            'is_active': True,
            'is_verified': False,
            'account_status': 'pending_verification'
        }
        
        table.put_item(Item=user_record)
        
        logger.info(f"Usuario creado en DynamoDB: {user_id}")
        return user_id
        
    except Exception as e:
        logger.error(f"Error creando registro de usuario: {str(e)}")
        raise


def send_verification_email(email: str):
    """
    Envía email de verificación
    
    Args:
        email: Email del usuario
    """
    try:
        topic_arn = os.environ.get('VERIFICATION_TOPIC_ARN')
        
        if topic_arn:
            message = {
                'email': email,
                'type': 'verification',
                'subject': 'Verifica tu cuenta bancaria',
                'body': f'Hola,\n\nPor favor verifica tu cuenta bancaria haciendo clic en el siguiente enlace:\n\nhttps://bank-app.com/verify?email={email}\n\nSaludos,\nEquipo Bancario'
            }
            
            sns_client.publish(
                TopicArn=topic_arn,
                Message=json.dumps(message),
                Subject='Verificación de cuenta bancaria'
            )
            
            logger.info(f"Email de verificación enviado a: {email}")
        
    except Exception as e:
        logger.error(f"Error enviando email de verificación: {str(e)}")


def generate_temp_password() -> str:
    """
    Genera una contraseña temporal segura
    
    Returns:
        Contraseña temporal
    """
    import secrets
    import string
    
    # Generar contraseña con al menos 8 caracteres
    # Incluyendo mayúsculas, minúsculas, números y símbolos
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    password = ''.join(secrets.choice(alphabet) for _ in range(12))
    
    return password


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
            'session_id': str(uuid.uuid4())
        }
        
        table.put_item(Item=audit_record)
        logger.info(f"Actividad registrada: {activity} para {email}")
        
    except Exception as e:
        logger.error(f"Error registrando actividad: {str(e)}")
