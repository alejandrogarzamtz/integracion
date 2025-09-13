-- Script de inicialización de la base de datos Aurora PostgreSQL
-- Aplicación de Banca Móvil - Arquitectura Híbrida

-- Crear base de datos si no existe
CREATE DATABASE banking;

-- Conectar a la base de datos banking
\c banking;

-- Crear esquema principal
CREATE SCHEMA IF NOT EXISTS banking_app;

-- Configurar búsqueda de esquemas
SET search_path TO banking_app, public;

-- Crear extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear extensión para encriptación
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear extensión para funciones de fecha
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    cognito_user_id VARCHAR(255) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    address TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    account_status VARCHAR(20) DEFAULT 'pending_verification',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE
);

-- Tabla de cuentas bancarias
CREATE TABLE IF NOT EXISTS accounts (
    account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('checking', 'savings', 'business')),
    balance DECIMAL(15,2) DEFAULT 0.00 CHECK (balance >= 0),
    currency VARCHAR(3) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_transaction_date TIMESTAMP WITH TIME ZONE,
    daily_transaction_limit DECIMAL(15,2) DEFAULT 10000.00,
    monthly_transaction_limit DECIMAL(15,2) DEFAULT 50000.00
);

-- Tabla de transacciones
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_account_id UUID REFERENCES accounts(account_id) ON DELETE SET NULL,
    to_account_id UUID REFERENCES accounts(account_id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'transfer', 'payment', 'refund')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    description TEXT,
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100)
);

-- Tabla de auditoría
CREATE TABLE IF NOT EXISTS audit_logs (
    audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    account_id UUID REFERENCES accounts(account_id) ON DELETE SET NULL,
    transaction_id UUID REFERENCES transactions(transaction_id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Tabla de sesiones
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    cognito_session_id VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    device_info JSONB
);

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

-- Tabla de límites de transacciones
CREATE TABLE IF NOT EXISTS transaction_limits (
    limit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(account_id) ON DELETE CASCADE,
    limit_type VARCHAR(50) NOT NULL,
    limit_amount DECIMAL(15,2) NOT NULL,
    period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly', 'yearly')),
    current_usage DECIMAL(15,2) DEFAULT 0.00,
    period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    period_end TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización de consultas
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_cognito_user_id ON users(cognito_user_id);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_account_number ON accounts(account_number);
CREATE INDEX IF NOT EXISTS idx_accounts_account_type ON accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_accounts_is_active ON accounts(is_active);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_from_account_id ON transactions(from_account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_to_account_id ON transactions(to_account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_reference_number ON transactions(reference_number);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_account_id ON audit_logs(account_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_transaction_id ON audit_logs(transaction_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_is_sent ON notifications(is_sent);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

CREATE INDEX IF NOT EXISTS idx_transaction_limits_user_id ON transaction_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_transaction_limits_account_id ON transaction_limits(account_id);
CREATE INDEX IF NOT EXISTS idx_transaction_limits_limit_type ON transaction_limits(limit_type);
CREATE INDEX IF NOT EXISTS idx_transaction_limits_is_active ON transaction_limits(is_active);

-- Funciones para actualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transaction_limits_updated_at BEFORE UPDATE ON transaction_limits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para generar número de cuenta único
CREATE OR REPLACE FUNCTION generate_account_number()
RETURNS VARCHAR(20) AS $$
DECLARE
    new_number VARCHAR(20);
    exists_count INTEGER;
BEGIN
    LOOP
        -- Generar número de cuenta de 10 dígitos
        new_number := LPAD(FLOOR(RANDOM() * 10000000000)::TEXT, 10, '0');
        
        -- Verificar si ya existe
        SELECT COUNT(*) INTO exists_count
        FROM accounts
        WHERE account_number = new_number;
        
        -- Si no existe, salir del loop
        IF exists_count = 0 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Función para generar número de referencia único
CREATE OR REPLACE FUNCTION generate_reference_number()
RETURNS VARCHAR(50) AS $$
DECLARE
    new_reference VARCHAR(50);
    exists_count INTEGER;
    date_prefix VARCHAR(10);
BEGIN
    -- Prefijo con fecha
    date_prefix := TO_CHAR(NOW(), 'YYYYMMDD');
    
    LOOP
        -- Generar número de referencia
        new_reference := 'TXN-' || date_prefix || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8));
        
        -- Verificar si ya existe
        SELECT COUNT(*) INTO exists_count
        FROM transactions
        WHERE reference_number = new_reference;
        
        -- Si no existe, salir del loop
        IF exists_count = 0 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_reference;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar límites de transacción
CREATE OR REPLACE FUNCTION check_transaction_limits(
    p_user_id UUID,
    p_account_id UUID,
    p_amount DECIMAL(15,2),
    p_transaction_type VARCHAR(20)
)
RETURNS BOOLEAN AS $$
DECLARE
    daily_limit DECIMAL(15,2);
    monthly_limit DECIMAL(15,2);
    daily_usage DECIMAL(15,2);
    monthly_usage DECIMAL(15,2);
BEGIN
    -- Obtener límites de la cuenta
    SELECT daily_transaction_limit, monthly_transaction_limit
    INTO daily_limit, monthly_limit
    FROM accounts
    WHERE account_id = p_account_id AND is_active = true;
    
    -- Calcular uso diario
    SELECT COALESCE(SUM(amount), 0)
    INTO daily_usage
    FROM transactions
    WHERE from_account_id = p_account_id
    AND DATE(created_at) = CURRENT_DATE
    AND status = 'completed';
    
    -- Calcular uso mensual
    SELECT COALESCE(SUM(amount), 0)
    INTO monthly_usage
    FROM transactions
    WHERE from_account_id = p_account_id
    AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
    AND status = 'completed';
    
    -- Verificar límites
    IF (daily_usage + p_amount) > daily_limit THEN
        RETURN false;
    END IF;
    
    IF (monthly_usage + p_amount) > monthly_limit THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Función para procesar transferencia
CREATE OR REPLACE FUNCTION process_transfer(
    p_from_account_id UUID,
    p_to_account_id UUID,
    p_amount DECIMAL(15,2),
    p_description TEXT,
    p_user_id UUID,
    p_ip_address INET,
    p_user_agent TEXT,
    p_session_id VARCHAR(100)
)
RETURNS UUID AS $$
DECLARE
    transaction_id UUID;
    reference_number VARCHAR(50);
    from_balance DECIMAL(15,2);
    to_balance DECIMAL(15,2);
BEGIN
    -- Verificar que las cuentas existan y estén activas
    IF NOT EXISTS (SELECT 1 FROM accounts WHERE account_id = p_from_account_id AND is_active = true) THEN
        RAISE EXCEPTION 'Cuenta origen no encontrada o inactiva';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM accounts WHERE account_id = p_to_account_id AND is_active = true) THEN
        RAISE EXCEPTION 'Cuenta destino no encontrada o inactiva';
    END IF;
    
    -- Verificar que el usuario tenga acceso a la cuenta origen
    IF NOT EXISTS (SELECT 1 FROM accounts WHERE account_id = p_from_account_id AND user_id = p_user_id) THEN
        RAISE EXCEPTION 'No tiene acceso a la cuenta origen';
    END IF;
    
    -- Verificar límites de transacción
    IF NOT check_transaction_limits(p_user_id, p_from_account_id, p_amount, 'transfer') THEN
        RAISE EXCEPTION 'Límite de transacción excedido';
    END IF;
    
    -- Obtener balances actuales
    SELECT balance INTO from_balance FROM accounts WHERE account_id = p_from_account_id;
    SELECT balance INTO to_balance FROM accounts WHERE account_id = p_to_account_id;
    
    -- Verificar fondos suficientes
    IF from_balance < p_amount THEN
        RAISE EXCEPTION 'Fondos insuficientes';
    END IF;
    
    -- Generar número de referencia
    reference_number := generate_reference_number();
    
    -- Crear transacción
    INSERT INTO transactions (
        from_account_id,
        to_account_id,
        user_id,
        amount,
        transaction_type,
        status,
        description,
        reference_number,
        ip_address,
        user_agent,
        session_id
    ) VALUES (
        p_from_account_id,
        p_to_account_id,
        p_user_id,
        p_amount,
        'transfer',
        'completed',
        p_description,
        reference_number,
        p_ip_address,
        p_user_agent,
        p_session_id
    ) RETURNING transaction_id INTO transaction_id;
    
    -- Actualizar balances
    UPDATE accounts SET balance = balance - p_amount, updated_at = NOW() WHERE account_id = p_from_account_id;
    UPDATE accounts SET balance = balance + p_amount, updated_at = NOW() WHERE account_id = p_to_account_id;
    
    -- Registrar en auditoría
    INSERT INTO audit_logs (
        user_id,
        account_id,
        transaction_id,
        action,
        resource_type,
        resource_id,
        new_values,
        ip_address,
        user_agent,
        session_id
    ) VALUES (
        p_user_id,
        p_from_account_id,
        transaction_id,
        'TRANSFER_DEBIT',
        'transaction',
        transaction_id::TEXT,
        jsonb_build_object('amount', p_amount, 'to_account', p_to_account_id),
        p_ip_address,
        p_user_agent,
        p_session_id
    );
    
    INSERT INTO audit_logs (
        user_id,
        account_id,
        transaction_id,
        action,
        resource_type,
        resource_id,
        new_values,
        ip_address,
        user_agent,
        session_id
    ) VALUES (
        p_user_id,
        p_to_account_id,
        transaction_id,
        'TRANSFER_CREDIT',
        'transaction',
        transaction_id::TEXT,
        jsonb_build_object('amount', p_amount, 'from_account', p_from_account_id),
        p_ip_address,
        p_user_agent,
        p_session_id
    );
    
    RETURN transaction_id;
END;
$$ LANGUAGE plpgsql;

-- Datos de prueba (solo para desarrollo)
INSERT INTO users (
    email,
    first_name,
    last_name,
    phone,
    date_of_birth,
    address,
    is_active,
    is_verified,
    account_status
) VALUES (
    'admin@banking-app.com',
    'Admin',
    'User',
    '+1234567890',
    '1990-01-01',
    '123 Admin Street, City, State 12345',
    true,
    true,
    'verified'
) ON CONFLICT (email) DO NOTHING;

-- Crear cuenta de prueba para el usuario admin
INSERT INTO accounts (
    user_id,
    account_number,
    account_type,
    balance,
    currency
) 
SELECT 
    u.user_id,
    generate_account_number(),
    'checking',
    10000.00,
    'USD'
FROM users u
WHERE u.email = 'admin@banking-app.com'
ON CONFLICT (account_number) DO NOTHING;

-- Crear vista para consultas comunes
CREATE OR REPLACE VIEW user_account_summary AS
SELECT 
    u.user_id,
    u.email,
    u.first_name,
    u.last_name,
    u.is_active as user_active,
    COUNT(a.account_id) as total_accounts,
    SUM(CASE WHEN a.is_active THEN 1 ELSE 0 END) as active_accounts,
    SUM(CASE WHEN a.is_active THEN a.balance ELSE 0 END) as total_balance,
    MAX(a.last_transaction_date) as last_transaction_date
FROM users u
LEFT JOIN accounts a ON u.user_id = a.user_id
GROUP BY u.user_id, u.email, u.first_name, u.last_name, u.is_active;

-- Crear vista para transacciones recientes
CREATE OR REPLACE VIEW recent_transactions AS
SELECT 
    t.transaction_id,
    t.reference_number,
    t.amount,
    t.transaction_type,
    t.status,
    t.description,
    t.created_at,
    fa.account_number as from_account_number,
    ta.account_number as to_account_number,
    u.first_name || ' ' || u.last_name as user_name
FROM transactions t
LEFT JOIN accounts fa ON t.from_account_id = fa.account_id
LEFT JOIN accounts ta ON t.to_account_id = ta.account_id
LEFT JOIN users u ON t.user_id = u.user_id
ORDER BY t.created_at DESC;

-- Comentarios en las tablas
COMMENT ON TABLE users IS 'Tabla de usuarios del sistema bancario';
COMMENT ON TABLE accounts IS 'Tabla de cuentas bancarias';
COMMENT ON TABLE transactions IS 'Tabla de transacciones bancarias';
COMMENT ON TABLE audit_logs IS 'Tabla de logs de auditoría';
COMMENT ON TABLE user_sessions IS 'Tabla de sesiones de usuario';
COMMENT ON TABLE notifications IS 'Tabla de notificaciones';
COMMENT ON TABLE transaction_limits IS 'Tabla de límites de transacciones';

-- Comentarios en columnas importantes
COMMENT ON COLUMN users.email IS 'Email único del usuario';
COMMENT ON COLUMN accounts.balance IS 'Balance actual de la cuenta';
COMMENT ON COLUMN transactions.amount IS 'Monto de la transacción';
COMMENT ON COLUMN transactions.status IS 'Estado de la transacción';

-- Configuración de seguridad
-- Revocar permisos públicos
REVOKE ALL ON SCHEMA banking_app FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA banking_app FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA banking_app FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA banking_app FROM PUBLIC;

-- Crear usuario para la aplicación
CREATE USER banking_app_user WITH PASSWORD 'secure_password_here';

-- Otorgar permisos necesarios
GRANT USAGE ON SCHEMA banking_app TO banking_app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA banking_app TO banking_app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA banking_app TO banking_app_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA banking_app TO banking_app_user;

-- Configurar permisos por defecto para nuevas tablas
ALTER DEFAULT PRIVILEGES IN SCHEMA banking_app GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO banking_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA banking_app GRANT USAGE, SELECT ON SEQUENCES TO banking_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA banking_app GRANT EXECUTE ON FUNCTIONS TO banking_app_user;

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Base de datos inicializada exitosamente para la aplicación de banca móvil';
    RAISE NOTICE 'Esquema: banking_app';
    RAISE NOTICE 'Usuario de aplicación: banking_app_user';
    RAISE NOTICE 'Tablas creadas: users, accounts, transactions, audit_logs, user_sessions, notifications, transaction_limits';
    RAISE NOTICE 'Funciones creadas: generate_account_number, generate_reference_number, check_transaction_limits, process_transfer';
    RAISE NOTICE 'Vistas creadas: user_account_summary, recent_transactions';
END $$;
