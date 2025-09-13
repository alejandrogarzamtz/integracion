# Arquitectura Cloud para Aplicación de Banca Móvil

## Descripción del Proyecto

Este proyecto simula el diseño de una arquitectura cloud para una aplicación de banca móvil utilizando una nube híbrida y funciones serverless. La solución combina servicios en la nube pública (AWS) con infraestructura privada para cumplir con los requisitos de seguridad y compliance bancario.

## Arquitectura

### Componentes Principales

1. **Frontend Mobile**: Aplicación móvil nativa (iOS/Android)
2. **API Gateway**: Punto de entrada único para todas las solicitudes
3. **Funciones Serverless**: Lógica de negocio ejecutada en AWS Lambda
4. **Base de Datos**: PostgreSQL en RDS (datos sensibles) + DynamoDB (datos de sesión)
5. **Almacenamiento**: S3 para documentos y archivos
6. **Monitoreo**: CloudWatch para logs y métricas
7. **Seguridad**: Cognito para autenticación, KMS para encriptación

### Patrón de Nube Híbrida

- **Nube Pública (AWS)**: Funciones serverless, API Gateway, servicios de autenticación
- **Nube Privada**: Base de datos principal con datos sensibles, servicios de compliance
- **Conectividad**: VPN o Direct Connect para comunicación segura

## Estructura del Proyecto

```
tarea-3/
├── serverless/
│   ├── functions/
│   │   ├── auth/
│   │   ├── accounts/
│   │   ├── transactions/
│   │   └── notifications/
│   ├── infrastructure/
│   └── shared/
├── diagrams/
├── docs/
└── tests/
```

## Tecnologías Utilizadas

- **Backend**: Python 3.9, AWS Lambda, API Gateway
- **Base de Datos**: PostgreSQL, DynamoDB
- **Infraestructura**: Terraform, AWS CDK
- **Autenticación**: AWS Cognito
- **Monitoreo**: CloudWatch, X-Ray
- **Seguridad**: AWS KMS, Secrets Manager

## Instalación y Despliegue

Ver documentación específica en cada directorio del proyecto.
