# Módulo Cognito para autenticación y autorización
# Configuración de User Pool y User Pool Client

# Cognito User Pool
resource "aws_cognito_user_pool" "main" {
  name = "${var.project_name}-${var.environment}-user-pool"
  
  # Configuración de políticas de contraseña
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }
  
  # Configuración de políticas de usuario
  username_attributes = ["email"]
  
  # Configuración de esquema de usuario
  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }
  
  schema {
    name                = "given_name"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }
  
  schema {
    name                = "family_name"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }
  
  schema {
    name                = "phone_number"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }
  
  schema {
    name                = "birthdate"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }
  
  schema {
    name                = "address"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }
  
  # Configuración de verificación de email
  auto_verified_attributes = ["email"]
  
  # Configuración de MFA
  mfa_configuration = "OPTIONAL"
  
  software_token_mfa_configuration {
    enabled = true
  }
  
  # Configuración de recuperación de cuenta
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
    
    recovery_mechanism {
      name     = "verified_phone_number"
      priority = 2
    }
  }
  
  # Configuración de administración de usuarios
  admin_create_user_config {
    allow_admin_create_user_only = false
    
    invite_message_template {
      email_subject = "Tu cuenta bancaria está lista"
      email_message = "Tu cuenta bancaria ha sido creada. Tu nombre de usuario es {username} y tu contraseña temporal es {####}."
      sms_message   = "Tu cuenta bancaria ha sido creada. Tu nombre de usuario es {username} y tu contraseña temporal es {####}."
    }
  }
  
  # Configuración de dispositivos
  device_configuration {
    challenge_required_on_new_device      = true
    device_only_remembered_on_user_prompt = false
  }
  
  # Configuración de dominio personalizado (opcional)
  domain = "${var.project_name}-${var.environment}-auth"
  
  tags = {
    Name = "${var.project_name}-${var.environment}-user-pool"
  }
}

# Cognito User Pool Client
resource "aws_cognito_user_pool_client" "main" {
  name         = "${var.project_name}-${var.environment}-client"
  user_pool_id = aws_cognito_user_pool.main.id
  
  # Configuración de flujos de autenticación
  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH"
  ]
  
  # Configuración de tokens
  generate_secret                      = false
  prevent_user_existence_errors        = "ENABLED"
  enable_token_revocation              = true
  enable_propagate_additional_user_context_data = true
  
  # Configuración de refresh tokens
  refresh_token_validity = 30
  
  # Configuración de acceso tokens
  access_token_validity = 1
  
  # Configuración de ID tokens
  id_token_validity = 1
  
  # Configuración de callback URLs
  callback_urls = [
    "https://${var.project_name}.com/callback",
    "http://localhost:3000/callback"
  ]
  
  logout_urls = [
    "https://${var.project_name}.com/logout",
    "http://localhost:3000/logout"
  ]
  
  # Configuración de scopes
  allowed_oauth_flows = [
    "code",
    "implicit"
  ]
  
  allowed_oauth_scopes = [
    "email",
    "openid",
    "profile",
    "aws.cognito.signin.user.admin"
  ]
  
  allowed_oauth_flows_user_pool_client = true
  
  # Configuración de lectura de atributos
  read_attributes = [
    "email",
    "email_verified",
    "given_name",
    "family_name",
    "phone_number",
    "phone_number_verified",
    "birthdate",
    "address"
  ]
  
  # Configuración de escritura de atributos
  write_attributes = [
    "email",
    "given_name",
    "family_name",
    "phone_number",
    "birthdate",
    "address"
  ]
  
  # Configuración de seguridad
  supported_identity_providers = ["COGNITO"]
  
  tags = {
    Name = "${var.project_name}-${var.environment}-client"
  }
}

# Cognito User Pool Domain
resource "aws_cognito_user_pool_domain" "main" {
  domain       = "${var.project_name}-${var.environment}-auth"
  user_pool_id = aws_cognito_user_pool.main.id
}

# Cognito Identity Pool (opcional, para acceso a recursos AWS)
resource "aws_cognito_identity_pool" "main" {
  identity_pool_name = "${var.project_name}-${var.environment}-identity-pool"
  
  allow_unauthenticated_identities = false
  
  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.main.id
    provider_name           = aws_cognito_user_pool.main.endpoint
    server_side_token_check = true
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-identity-pool"
  }
}

# IAM Role para usuarios autenticados
resource "aws_iam_role" "authenticated" {
  name = "${var.project_name}-${var.environment}-cognito-authenticated-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.main.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "authenticated"
          }
        }
      }
    ]
  })
  
  tags = {
    Name = "${var.project_name}-${var.environment}-authenticated-role"
  }
}

# IAM Policy para usuarios autenticados
resource "aws_iam_role_policy" "authenticated" {
  name = "${var.project_name}-${var.environment}-authenticated-policy"
  role = aws_iam_role.authenticated.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          "arn:aws:dynamodb:*:*:table/${var.project_name}-${var.environment}-*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = [
          "arn:aws:s3:::${var.project_name}-${var.environment}-*/*"
        ]
      }
    ]
  })
}

# Asignar rol a Identity Pool
resource "aws_cognito_identity_pool_roles_attachment" "main" {
  identity_pool_id = aws_cognito_identity_pool.main.id
  
  roles = {
    authenticated = aws_iam_role.authenticated.arn
  }
}

# CloudWatch Log Group para Cognito
resource "aws_cloudwatch_log_group" "cognito" {
  name              = "/aws/cognito/userpool/${aws_cognito_user_pool.main.name}"
  retention_in_days = 30
  
  tags = {
    Name = "${var.project_name}-${var.environment}-cognito-logs"
  }
}

# Variables
variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
}

variable "environment" {
  description = "Ambiente de despliegue"
  type        = string
}

# Outputs
output "user_pool_id" {
  description = "ID del User Pool"
  value       = aws_cognito_user_pool.main.id
}

output "user_pool_arn" {
  description = "ARN del User Pool"
  value       = aws_cognito_user_pool.main.arn
}

output "user_pool_client_id" {
  description = "ID del User Pool Client"
  value       = aws_cognito_user_pool_client.main.id
}

output "user_pool_client_secret" {
  description = "Secret del User Pool Client"
  value       = aws_cognito_user_pool_client.main.client_secret
  sensitive   = true
}

output "user_pool_domain" {
  description = "Dominio del User Pool"
  value       = aws_cognito_user_pool_domain.main.domain
}

output "identity_pool_id" {
  description = "ID del Identity Pool"
  value       = aws_cognito_identity_pool.main.id
}

output "authenticated_role_arn" {
  description = "ARN del rol para usuarios autenticados"
  value       = aws_iam_role.authenticated.arn
}
