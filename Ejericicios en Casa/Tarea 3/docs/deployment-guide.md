# Guía de Despliegue - Aplicación de Banca Móvil

## Prerrequisitos

### Herramientas Necesarias
- **Terraform** >= 1.0
- **AWS CLI** >= 2.0
- **Python** >= 3.9
- **Node.js** >= 16.0 (para Serverless Framework)
- **Git**

### Cuenta AWS
- Cuenta AWS con permisos de administrador
- Región preferida: `us-east-1`
- Límites de servicio verificados

### Configuración Inicial

```bash
# Configurar AWS CLI
aws configure
AWS Access Key ID: [YOUR_ACCESS_KEY]
AWS Secret Access Key: [YOUR_SECRET_KEY]
Default region name: us-east-1
Default output format: json

# Verificar configuración
aws sts get-caller-identity
```

## Estructura del Proyecto

```
banking-app/
├── serverless/                 # Código de funciones Lambda
│   ├── functions/              # Funciones individuales
│   ├── shared/                 # Código compartido
│   └── infrastructure/        # Configuración Terraform
├── diagrams/                   # Diagramas arquitectónicos
├── docs/                       # Documentación
└── tests/                      # Pruebas unitarias
```

## Paso 1: Configuración de Infraestructura

### 1.1 Inicializar Terraform

```bash
cd serverless/infrastructure

# Inicializar Terraform
terraform init

# Verificar configuración
terraform validate
```

### 1.2 Configurar Variables

Crear archivo `terraform.tfvars`:

```hcl
# terraform.tfvars
project_name = "banking-app"
environment  = "production"
aws_region   = "us-east-1"

# Configuración de red
vpc_cidr = "10.0.0.0/16"
availability_zones = ["us-east-1a", "us-east-1b"]

# Configuración de RDS
rds_instance_class = "db.serverless"
rds_min_capacity   = 0.5
rds_max_capacity   = 16
rds_backup_retention = 7

# Configuración de DynamoDB
dynamodb_billing_mode = "PAY_PER_REQUEST"

# Configuración de Lambda
lambda_timeout = 30
lambda_memory_size = 512

# Configuración de Cognito
cognito_password_min_length = 8
cognito_password_require_uppercase = true
cognito_password_require_lowercase = true
cognito_password_require_numbers = true
cognito_password_require_symbols = true
```

### 1.3 Planificar Despliegue

```bash
# Generar plan de ejecución
terraform plan -var-file="terraform.tfvars"

# Revisar cambios propuestos
# Verificar que todos los recursos sean correctos
```

### 1.4 Desplegar Infraestructura

```bash
# Aplicar cambios
terraform apply -var-file="terraform.tfvars"

# Confirmar con 'yes' cuando se solicite
# El proceso tomará aproximadamente 15-20 minutos
```

### 1.5 Verificar Despliegue

```bash
# Ver outputs importantes
terraform output

# Verificar recursos creados
aws ec2 describe-vpcs --filters "Name=tag:Project,Values=banking-app"
aws rds describe-db-clusters --db-cluster-identifier banking-app-production-aurora-cluster
aws dynamodb list-tables --query 'TableNames[?contains(@, `banking-app`)]'
```

## Paso 2: Configuración de Funciones Lambda

### 2.1 Instalar Dependencias

```bash
cd serverless

# Instalar Serverless Framework
npm install -g serverless

# Instalar dependencias Python
pip install -r requirements.txt
```

### 2.2 Configurar Variables de Entorno

Crear archivo `.env.production`:

```bash
# .env.production
USER_POOL_ID=$(terraform output -raw user_pool_id)
COGNITO_CLIENT_ID=$(terraform output -raw user_pool_client_id)
USERS_TABLE_NAME=$(terraform output -raw users_table_name)
ACCOUNTS_TABLE_NAME=$(terraform output -raw accounts_table_name)
TRANSACTIONS_TABLE_NAME=$(terraform output -raw transactions_table_name)
AUDIT_TABLE_NAME=$(terraform output -raw audit_table_name)
RDS_CLUSTER_ARN=$(terraform output -raw rds_cluster_arn)
RDS_SECRET_ARN=$(terraform output -raw rds_secret_arn)
API_GATEWAY_URL=$(terraform output -raw api_gateway_url)
```

### 2.3 Desplegar Funciones

```bash
# Desplegar todas las funciones
serverless deploy --stage production

# Verificar despliegue
serverless info --stage production
```

### 2.4 Configurar Permisos

```bash
# Verificar permisos de Lambda
aws lambda get-function --function-name banking-app-production-auth-login

# Verificar logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/banking-app"
```

## Paso 3: Configuración de Base de Datos

### 3.1 Conectar a Aurora PostgreSQL

```bash
# Obtener endpoint de RDS
RDS_ENDPOINT=$(terraform output -raw rds_endpoint)

# Obtener credenciales
aws secretsmanager get-secret-value \
  --secret-id banking-app-production-rds-credentials \
  --query SecretString --output text | jq -r '.password'
```

### 3.2 Ejecutar Scripts de Base de Datos

```bash
# Conectar a la base de datos
psql -h $RDS_ENDPOINT -U dbadmin -d banking

# Ejecutar scripts de inicialización
\i database_setup.sql
```

### 3.3 Verificar Tablas

```sql
-- Verificar tablas creadas
\dt

-- Verificar estructura de tablas
\d users
\d accounts
\d transactions
\d audit_logs
```

## Paso 4: Configuración de Monitoreo

### 4.1 Configurar CloudWatch Dashboards

```bash
# Crear dashboard
aws cloudwatch put-dashboard \
  --dashboard-name "BankingApp-Production" \
  --dashboard-body file://monitoring/dashboard.json
```

### 4.2 Configurar Alertas

```bash
# Crear alarmas
aws cloudwatch put-metric-alarm \
  --alarm-name "BankingApp-High-Error-Rate" \
  --alarm-description "High error rate in banking app" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

### 4.3 Configurar Logs

```bash
# Verificar log groups
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/banking-app"

# Configurar retención de logs
aws logs put-retention-policy \
  --log-group-name "/aws/lambda/banking-app-production-auth-login" \
  --retention-in-days 30
```

## Paso 5: Pruebas de Funcionamiento

### 5.1 Pruebas de API

```bash
# Obtener URL del API Gateway
API_URL=$(terraform output -raw api_gateway_url)

# Probar endpoint de salud
curl -X GET $API_URL/health

# Probar registro de usuario
curl -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "phone": "+1234567890",
    "first_name": "Test",
    "last_name": "User",
    "date_of_birth": "1990-01-01",
    "address": "123 Test St"
  }'
```

### 5.2 Pruebas de Base de Datos

```sql
-- Verificar datos de prueba
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM accounts;
SELECT COUNT(*) FROM transactions;
```

### 5.3 Pruebas de Seguridad

```bash
# Probar autenticación
curl -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'

# Verificar token JWT
# El token debe ser válido y contener claims correctos
```

## Paso 6: Configuración de Producción

### 6.1 Configurar DNS

```bash
# Configurar dominio personalizado
aws apigateway create-domain-name \
  --domain-name api.banking-app.com \
  --certificate-arn arn:aws:acm:us-east-1:123456789012:certificate/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 6.2 Configurar SSL/TLS

```bash
# Obtener certificado SSL
aws acm request-certificate \
  --domain-name api.banking-app.com \
  --validation-method DNS
```

### 6.3 Configurar Backup

```bash
# Configurar backup automático de RDS
aws rds modify-db-cluster \
  --db-cluster-identifier banking-app-production-aurora-cluster \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00"
```

## Paso 7: Verificación Final

### 7.1 Checklist de Despliegue

- [ ] Infraestructura Terraform desplegada
- [ ] Funciones Lambda desplegadas
- [ ] Base de datos Aurora configurada
- [ ] Tablas DynamoDB creadas
- [ ] Cognito User Pool configurado
- [ ] API Gateway funcionando
- [ ] Monitoreo configurado
- [ ] Alertas configuradas
- [ ] Backup configurado
- [ ] Pruebas pasando

### 7.2 Comandos de Verificación

```bash
# Verificar estado general
terraform show

# Verificar funciones Lambda
aws lambda list-functions --query 'Functions[?contains(FunctionName, `banking-app`)]'

# Verificar base de datos
aws rds describe-db-clusters --db-cluster-identifier banking-app-production-aurora-cluster

# Verificar DynamoDB
aws dynamodb list-tables --query 'TableNames[?contains(@, `banking-app`)]'

# Verificar Cognito
aws cognito-idp list-user-pools --max-items 10
```

## Solución de Problemas

### Problemas Comunes

#### 1. Error de Permisos
```bash
# Verificar permisos de AWS
aws sts get-caller-identity

# Verificar políticas IAM
aws iam list-attached-user-policies --user-name your-username
```

#### 2. Error de Conectividad RDS
```bash
# Verificar security groups
aws ec2 describe-security-groups --group-ids sg-xxxxxxxxx

# Verificar subnets
aws ec2 describe-subnets --subnet-ids subnet-xxxxxxxxx
```

#### 3. Error de Lambda
```bash
# Verificar logs
aws logs get-log-events \
  --log-group-name "/aws/lambda/banking-app-production-auth-login" \
  --log-stream-name "2024/01/01/[$LATEST]xxxxxxxxx"
```

#### 4. Error de DynamoDB
```bash
# Verificar tabla
aws dynamodb describe-table --table-name banking-app-production-users

# Verificar permisos
aws iam get-role-policy --role-name banking-app-production-lambda-role --policy-name DynamoDBPolicy
```

### Logs Importantes

```bash
# Logs de Terraform
tail -f terraform.log

# Logs de Lambda
aws logs tail "/aws/lambda/banking-app-production-auth-login" --follow

# Logs de RDS
aws logs tail "/aws/rds/cluster/banking-app-production-aurora-cluster/postgresql" --follow
```

## Mantenimiento

### Actualizaciones Regulares

```bash
# Actualizar dependencias Python
pip install --upgrade -r requirements.txt

# Actualizar Terraform
terraform init -upgrade

# Actualizar funciones Lambda
serverless deploy --stage production
```

### Backup y Recuperación

```bash
# Crear snapshot manual de RDS
aws rds create-db-cluster-snapshot \
  --db-cluster-identifier banking-app-production-aurora-cluster \
  --db-cluster-snapshot-identifier banking-app-production-manual-snapshot-$(date +%Y%m%d)

# Crear backup de DynamoDB
aws dynamodb create-backup \
  --table-name banking-app-production-users \
  --backup-name banking-app-production-users-backup-$(date +%Y%m%d)
```

### Monitoreo Continuo

```bash
# Verificar métricas
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Errors \
  --dimensions Name=FunctionName,Value=banking-app-production-auth-login \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-01T23:59:59Z \
  --period 300 \
  --statistics Sum
```

## Conclusión

Esta guía proporciona los pasos necesarios para desplegar exitosamente la aplicación de banca móvil en AWS. El proceso está diseñado para ser repetible y confiable, con verificaciones en cada paso para asegurar el éxito del despliegue.

### Próximos Pasos
1. Configurar CI/CD pipeline
2. Implementar pruebas automatizadas
3. Configurar monitoreo avanzado
4. Preparar documentación de usuario
5. Planificar estrategia de backup y disaster recovery
