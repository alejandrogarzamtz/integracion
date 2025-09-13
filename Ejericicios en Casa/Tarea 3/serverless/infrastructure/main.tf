# Configuración principal de Terraform para la arquitectura de banca móvil
# Arquitectura híbrida con AWS (nube pública) y RDS (nube privada)

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "bank-terraform-state"
    key    = "banking-app/terraform.tfstate"
    region = "us-east-1"
  }
}

# Configuración del proveedor AWS
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "Banking-Mobile-App"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Variables
variable "aws_region" {
  description = "Región de AWS"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Ambiente de despliegue"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
  default     = "banking-app"
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# VPC y Networking
module "vpc" {
  source = "./modules/vpc"
  
  project_name = var.project_name
  environment  = var.environment
  region       = var.aws_region
}

# Cognito User Pool para autenticación
module "cognito" {
  source = "./modules/cognito"
  
  project_name = var.project_name
  environment  = var.environment
  
  depends_on = [module.vpc]
}

# DynamoDB Tables
module "dynamodb" {
  source = "./modules/dynamodb"
  
  project_name = var.project_name
  environment  = var.environment
}

# RDS Aurora Cluster (Base de datos principal)
module "rds" {
  source = "./modules/rds"
  
  project_name = var.project_name
  environment  = var.environment
  
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  
  depends_on = [module.vpc]
}

# Lambda Functions
module "lambda_functions" {
  source = "./modules/lambda"
  
  project_name = var.project_name
  environment  = var.environment
  
  user_pool_id = module.cognito.user_pool_id
  user_pool_client_id = module.cognito.user_pool_client_id
  
  users_table_name        = module.dynamodb.users_table_name
  accounts_table_name     = module.dynamodb.accounts_table_name
  transactions_table_name = module.dynamodb.transactions_table_name
  audit_table_name        = module.dynamodb.audit_table_name
  
  rds_cluster_arn = module.rds.cluster_arn
  rds_secret_arn  = module.rds.secret_arn
  
  depends_on = [module.cognito, module.dynamodb, module.rds]
}

# API Gateway
module "api_gateway" {
  source = "./modules/api-gateway"
  
  project_name = var.project_name
  environment  = var.environment
  
  lambda_functions = module.lambda_functions.functions
  
  depends_on = [module.lambda_functions]
}

# SNS Topics para notificaciones
module "sns" {
  source = "./modules/sns"
  
  project_name = var.project_name
  environment  = var.environment
}

# SQS Queues para procesamiento asíncrono
module "sqs" {
  source = "./modules/sqs"
  
  project_name = var.project_name
  environment  = var.environment
}

# CloudWatch Logs y Monitoring
module "monitoring" {
  source = "./modules/monitoring"
  
  project_name = var.project_name
  environment  = var.environment
  
  lambda_functions = module.lambda_functions.functions
  
  depends_on = [module.lambda_functions]
}

# S3 Buckets
module "s3" {
  source = "./modules/s3"
  
  project_name = var.project_name
  environment  = var.environment
}

# KMS Keys para encriptación
module "kms" {
  source = "./modules/kms"
  
  project_name = var.project_name
  environment  = var.environment
}

# Outputs
output "api_gateway_url" {
  description = "URL del API Gateway"
  value       = module.api_gateway.api_gateway_url
}

output "user_pool_id" {
  description = "ID del User Pool de Cognito"
  value       = module.cognito.user_pool_id
}

output "user_pool_client_id" {
  description = "ID del Client de Cognito"
  value       = module.cognito.user_pool_client_id
}

output "rds_endpoint" {
  description = "Endpoint de RDS"
  value       = module.rds.endpoint
  sensitive   = true
}

output "dynamodb_tables" {
  description = "Nombres de las tablas de DynamoDB"
  value       = {
    users        = module.dynamodb.users_table_name
    accounts     = module.dynamodb.accounts_table_name
    transactions = module.dynamodb.transactions_table_name
    audit        = module.dynamodb.audit_table_name
  }
}
