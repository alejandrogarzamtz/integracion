# Módulo DynamoDB para almacenamiento de datos de sesión y cache
# Tablas para usuarios, cuentas, transacciones y auditoría

# Tabla de Usuarios
resource "aws_dynamodb_table" "users" {
  name           = "${var.project_name}-${var.environment}-users"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "email"
  
  attribute {
    name = "email"
    type = "S"
  }
  
  attribute {
    name = "user_id"
    type = "S"
  }
  
  # Global Secondary Index para consultas por user_id
  global_secondary_index {
    name            = "user_id-index"
    hash_key        = "user_id"
    projection_type = "ALL"
  }
  
  # Configuración de encriptación
  server_side_encryption {
    enabled = true
  }
  
  # Configuración de punto en el tiempo
  point_in_time_recovery {
    enabled = true
  }
  
  # Configuración de TTL
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-users-table"
  }
}

# Tabla de Cuentas
resource "aws_dynamodb_table" "accounts" {
  name           = "${var.project_name}-${var.environment}-accounts"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "account_id"
  
  attribute {
    name = "account_id"
    type = "S"
  }
  
  attribute {
    name = "user_id"
    type = "S"
  }
  
  attribute {
    name = "account_number"
    type = "S"
  }
  
  # Global Secondary Index para consultas por user_id
  global_secondary_index {
    name            = "user_id-index"
    hash_key        = "user_id"
    projection_type = "ALL"
  }
  
  # Global Secondary Index para consultas por account_number
  global_secondary_index {
    name            = "account_number-index"
    hash_key        = "account_number"
    projection_type = "ALL"
  }
  
  # Configuración de encriptación
  server_side_encryption {
    enabled = true
  }
  
  # Configuración de punto en el tiempo
  point_in_time_recovery {
    enabled = true
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-accounts-table"
  }
}

# Tabla de Transacciones
resource "aws_dynamodb_table" "transactions" {
  name           = "${var.project_name}-${var.environment}-transactions"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "transaction_id"
  
  attribute {
    name = "transaction_id"
    type = "S"
  }
  
  attribute {
    name = "user_id"
    type = "S"
  }
  
  attribute {
    name = "account_id"
    type = "S"
  }
  
  attribute {
    name = "created_at"
    type = "S"
  }
  
  # Global Secondary Index para consultas por user_id
  global_secondary_index {
    name            = "user_id-index"
    hash_key        = "user_id"
    range_key       = "created_at"
    projection_type = "ALL"
  }
  
  # Global Secondary Index para consultas por account_id
  global_secondary_index {
    name            = "account_id-index"
    hash_key        = "account_id"
    range_key       = "created_at"
    projection_type = "ALL"
  }
  
  # Configuración de encriptación
  server_side_encryption {
    enabled = true
  }
  
  # Configuración de punto en el tiempo
  point_in_time_recovery {
    enabled = true
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-transactions-table"
  }
}

# Tabla de Auditoría
resource "aws_dynamodb_table" "audit" {
  name           = "${var.project_name}-${var.environment}-audit"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "audit_id"
  
  attribute {
    name = "audit_id"
    type = "S"
  }
  
  attribute {
    name = "user_id"
    type = "S"
  }
  
  attribute {
    name = "timestamp"
    type = "S"
  }
  
  attribute {
    name = "activity"
    type = "S"
  }
  
  # Global Secondary Index para consultas por user_id
  global_secondary_index {
    name            = "user_id-index"
    hash_key        = "user_id"
    range_key       = "timestamp"
    projection_type = "ALL"
  }
  
  # Global Secondary Index para consultas por actividad
  global_secondary_index {
    name            = "activity-index"
    hash_key        = "activity"
    range_key       = "timestamp"
    projection_type = "ALL"
  }
  
  # Configuración de encriptación
  server_side_encryption {
    enabled = true
  }
  
  # Configuración de punto en el tiempo
  point_in_time_recovery {
    enabled = true
  }
  
  # Configuración de TTL para limpieza automática (retener por 7 años)
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-audit-table"
  }
}

# Tabla de Sesiones (para cache de sesiones activas)
resource "aws_dynamodb_table" "sessions" {
  name           = "${var.project_name}-${var.environment}-sessions"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "session_id"
  
  attribute {
    name = "session_id"
    type = "S"
  }
  
  attribute {
    name = "user_id"
    type = "S"
  }
  
  # Global Secondary Index para consultas por user_id
  global_secondary_index {
    name            = "user_id-index"
    hash_key        = "user_id"
    projection_type = "ALL"
  }
  
  # Configuración de encriptación
  server_side_encryption {
    enabled = true
  }
  
  # Configuración de TTL para limpieza automática de sesiones expiradas
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-sessions-table"
  }
}

# Tabla de Notificaciones (para cache de notificaciones pendientes)
resource "aws_dynamodb_table" "notifications" {
  name           = "${var.project_name}-${var.environment}-notifications"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "notification_id"
  
  attribute {
    name = "notification_id"
    type = "S"
  }
  
  attribute {
    name = "user_id"
    type = "S"
  }
  
  attribute {
    name = "created_at"
    type = "S"
  }
  
  # Global Secondary Index para consultas por user_id
  global_secondary_index {
    name            = "user_id-index"
    hash_key        = "user_id"
    range_key       = "created_at"
    projection_type = "ALL"
  }
  
  # Configuración de encriptación
  server_side_encryption {
    enabled = true
  }
  
  # Configuración de TTL para limpieza automática (retener por 30 días)
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-notifications-table"
  }
}

# DynamoDB Streams para procesamiento en tiempo real
resource "aws_dynamodb_table" "transactions_stream" {
  name           = "${var.project_name}-${var.environment}-transactions-stream"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "transaction_id"
  
  attribute {
    name = "transaction_id"
    type = "S"
  }
  
  # Habilitar DynamoDB Streams
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
  
  # Configuración de encriptación
  server_side_encryption {
    enabled = true
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-transactions-stream-table"
  }
}

# CloudWatch Alarms para monitoreo
resource "aws_cloudwatch_metric_alarm" "dynamodb_throttles" {
  count = 5
  
  alarm_name          = "${var.project_name}-${var.environment}-dynamodb-throttles-${count.index}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "ThrottledRequests"
  namespace           = "AWS/DynamoDB"
  period              = "300"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "This metric monitors dynamodb throttles"
  
  dimensions = {
    TableName = [
      aws_dynamodb_table.users.name,
      aws_dynamodb_table.accounts.name,
      aws_dynamodb_table.transactions.name,
      aws_dynamodb_table.audit.name,
      aws_dynamodb_table.sessions.name
    ][count.index]
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-dynamodb-throttles-alarm-${count.index}"
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
output "users_table_name" {
  description = "Nombre de la tabla de usuarios"
  value       = aws_dynamodb_table.users.name
}

output "users_table_arn" {
  description = "ARN de la tabla de usuarios"
  value       = aws_dynamodb_table.users.arn
}

output "accounts_table_name" {
  description = "Nombre de la tabla de cuentas"
  value       = aws_dynamodb_table.accounts.name
}

output "accounts_table_arn" {
  description = "ARN de la tabla de cuentas"
  value       = aws_dynamodb_table.accounts.arn
}

output "transactions_table_name" {
  description = "Nombre de la tabla de transacciones"
  value       = aws_dynamodb_table.transactions.name
}

output "transactions_table_arn" {
  description = "ARN de la tabla de transacciones"
  value       = aws_dynamodb_table.transactions.arn
}

output "audit_table_name" {
  description = "Nombre de la tabla de auditoría"
  value       = aws_dynamodb_table.audit.name
}

output "audit_table_arn" {
  description = "ARN de la tabla de auditoría"
  value       = aws_dynamodb_table.audit.arn
}

output "sessions_table_name" {
  description = "Nombre de la tabla de sesiones"
  value       = aws_dynamodb_table.sessions.name
}

output "sessions_table_arn" {
  description = "ARN de la tabla de sesiones"
  value       = aws_dynamodb_table.sessions.arn
}

output "notifications_table_name" {
  description = "Nombre de la tabla de notificaciones"
  value       = aws_dynamodb_table.notifications.name
}

output "notifications_table_arn" {
  description = "ARN de la tabla de notificaciones"
  value       = aws_dynamodb_table.notifications.arn
}
