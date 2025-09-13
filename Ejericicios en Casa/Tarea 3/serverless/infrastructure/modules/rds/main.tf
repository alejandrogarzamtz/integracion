# Módulo RDS Aurora PostgreSQL para base de datos principal
# Configuración de cluster Aurora Serverless v2 con alta disponibilidad

# DB Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-db-subnet-group"
  subnet_ids = var.private_subnet_ids
  
  tags = {
    Name = "${var.project_name}-${var.environment}-db-subnet-group"
  }
}

# Security Group para RDS
resource "aws_security_group" "rds" {
  name_prefix = "${var.project_name}-${var.environment}-rds-"
  vpc_id      = var.vpc_id
  
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-rds-sg"
  }
}

# KMS Key para encriptación de RDS
resource "aws_kms_key" "rds" {
  description             = "KMS key for RDS encryption"
  deletion_window_in_days = 7
  
  tags = {
    Name = "${var.project_name}-${var.environment}-rds-kms-key"
  }
}

resource "aws_kms_alias" "rds" {
  name          = "alias/${var.project_name}-${var.environment}-rds"
  target_key_id = aws_kms_key.rds.key_id
}

# Secrets Manager para credenciales de RDS
resource "aws_secretsmanager_secret" "rds" {
  name                    = "${var.project_name}-${var.environment}-rds-credentials"
  description             = "RDS database credentials"
  recovery_window_in_days = 7
  
  tags = {
    Name = "${var.project_name}-${var.environment}-rds-secret"
  }
}

resource "aws_secretsmanager_secret_version" "rds" {
  secret_id = aws_secretsmanager_secret.rds.id
  secret_string = jsonencode({
    username = "dbadmin"
    password = random_password.db_password.result
    engine   = "postgres"
    host     = aws_rds_cluster.main.endpoint
    port     = 5432
    dbname   = "banking"
  })
}

# Password aleatorio para la base de datos
resource "random_password" "db_password" {
  length  = 32
  special = true
}

# Aurora Cluster
resource "aws_rds_cluster" "main" {
  cluster_identifier      = "${var.project_name}-${var.environment}-aurora-cluster"
  engine                  = "aurora-postgresql"
  engine_version          = "15.4"
  database_name           = "banking"
  master_username         = "dbadmin"
  master_password         = random_password.db_password.result
  
  # Configuración de red
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  
  # Configuración de backup
  backup_retention_period = 7
  preferred_backup_window = "03:00-04:00"
  preferred_maintenance_window = "sun:04:00-sun:05:00"
  
  # Configuración de encriptación
  storage_encrypted = true
  kms_key_id       = aws_kms_key.rds.arn
  
  # Configuración de logging
  enabled_cloudwatch_logs_exports = ["postgresql"]
  
  # Configuración de seguridad
  deletion_protection = true
  
  # Configuración de Aurora Serverless v2
  serverlessv2_scaling_configuration {
    max_capacity = 16
    min_capacity = 0.5
  }
  
  # Configuración de punto en el tiempo
  point_in_time_recovery_enabled = true
  
  tags = {
    Name = "${var.project_name}-${var.environment}-aurora-cluster"
  }
}

# Aurora Cluster Instances
resource "aws_rds_cluster_instance" "main" {
  count              = 2
  identifier         = "${var.project_name}-${var.environment}-aurora-instance-${count.index + 1}"
  cluster_identifier = aws_rds_cluster.main.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.main.engine
  engine_version     = aws_rds_cluster.main.engine_version
  
  # Configuración de performance insights
  performance_insights_enabled = true
  performance_insights_retention_period = 7
  
  # Configuración de monitoreo
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_enhanced_monitoring.arn
  
  tags = {
    Name = "${var.project_name}-${var.environment}-aurora-instance-${count.index + 1}"
  }
}

# IAM Role para Enhanced Monitoring
resource "aws_iam_role" "rds_enhanced_monitoring" {
  name = "${var.project_name}-${var.environment}-rds-enhanced-monitoring-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })
  
  tags = {
    Name = "${var.project_name}-${var.environment}-rds-enhanced-monitoring-role"
  }
}

resource "aws_iam_role_policy_attachment" "rds_enhanced_monitoring" {
  role       = aws_iam_role.rds_enhanced_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# CloudWatch Log Groups para RDS
resource "aws_cloudwatch_log_group" "rds_postgresql" {
  name              = "/aws/rds/cluster/${aws_rds_cluster.main.cluster_identifier}/postgresql"
  retention_in_days = 30
  
  tags = {
    Name = "${var.project_name}-${var.environment}-rds-postgresql-logs"
  }
}

# CloudWatch Alarms para monitoreo
resource "aws_cloudwatch_metric_alarm" "rds_cpu" {
  alarm_name          = "${var.project_name}-${var.environment}-rds-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors RDS CPU utilization"
  
  dimensions = {
    DBClusterIdentifier = aws_rds_cluster.main.cluster_identifier
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-rds-cpu-alarm"
  }
}

resource "aws_cloudwatch_metric_alarm" "rds_connections" {
  alarm_name          = "${var.project_name}-${var.environment}-rds-connections-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors RDS database connections"
  
  dimensions = {
    DBClusterIdentifier = aws_rds_cluster.main.cluster_identifier
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-rds-connections-alarm"
  }
}

resource "aws_cloudwatch_metric_alarm" "rds_freeable_memory" {
  alarm_name          = "${var.project_name}-${var.environment}-rds-freeable-memory-low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "FreeableMemory"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "1000000000"  # 1GB
  alarm_description   = "This metric monitors RDS freeable memory"
  
  dimensions = {
    DBClusterIdentifier = aws_rds_cluster.main.cluster_identifier
  }
  
  tags = {
    Name = "${var.project_name}-${var.environment}-rds-freeable-memory-alarm"
  }
}

# Snapshot automático
resource "aws_db_cluster_snapshot" "manual" {
  count              = 1
  db_cluster_identifier          = aws_rds_cluster.main.id
  db_cluster_snapshot_identifier = "${var.project_name}-${var.environment}-manual-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"
  
  tags = {
    Name = "${var.project_name}-${var.environment}-manual-snapshot"
  }
  
  lifecycle {
    ignore_changes = [db_cluster_snapshot_identifier]
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

variable "vpc_id" {
  description = "ID de la VPC"
  type        = string
}

variable "private_subnet_ids" {
  description = "IDs de las subnets privadas"
  type        = list(string)
}

# Outputs
output "cluster_id" {
  description = "ID del cluster Aurora"
  value       = aws_rds_cluster.main.cluster_identifier
}

output "cluster_arn" {
  description = "ARN del cluster Aurora"
  value       = aws_rds_cluster.main.arn
}

output "cluster_endpoint" {
  description = "Endpoint del cluster Aurora"
  value       = aws_rds_cluster.main.endpoint
}

output "cluster_reader_endpoint" {
  description = "Endpoint de lectura del cluster Aurora"
  value       = aws_rds_cluster.main.reader_endpoint
}

output "cluster_port" {
  description = "Puerto del cluster Aurora"
  value       = aws_rds_cluster.main.port
}

output "secret_arn" {
  description = "ARN del secreto de RDS"
  value       = aws_secretsmanager_secret.rds.arn
}

output "kms_key_id" {
  description = "ID de la clave KMS"
  value       = aws_kms_key.rds.key_id
}

output "security_group_id" {
  description = "ID del security group de RDS"
  value       = aws_security_group.rds.id
}
