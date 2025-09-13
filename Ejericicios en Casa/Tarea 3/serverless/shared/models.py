"""
Modelos de datos compartidos para la aplicación de banca móvil
"""

from dataclasses import dataclass
from typing import Optional, List
from datetime import datetime
from enum import Enum


class TransactionType(Enum):
    """Tipos de transacciones bancarias"""
    DEPOSIT = "deposit"
    WITHDRAWAL = "withdrawal"
    TRANSFER = "transfer"
    PAYMENT = "payment"
    REFUND = "refund"


class TransactionStatus(Enum):
    """Estados de transacciones"""
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class AccountType(Enum):
    """Tipos de cuenta bancaria"""
    CHECKING = "checking"
    SAVINGS = "savings"
    BUSINESS = "business"


@dataclass
class User:
    """Modelo de usuario"""
    user_id: str
    email: str
    phone: str
    first_name: str
    last_name: str
    date_of_birth: str
    address: str
    created_at: datetime
    updated_at: datetime
    is_active: bool = True
    is_verified: bool = False


@dataclass
class Account:
    """Modelo de cuenta bancaria"""
    account_id: str
    user_id: str
    account_number: str
    account_type: AccountType
    balance: float
    currency: str
    created_at: datetime
    updated_at: datetime
    is_active: bool = True


@dataclass
class Transaction:
    """Modelo de transacción"""
    transaction_id: str
    account_id: str
    amount: float
    transaction_type: TransactionType
    status: TransactionStatus
    description: str
    reference_number: str
    created_at: datetime
    updated_at: datetime
    metadata: Optional[dict] = None


@dataclass
class AuthResponse:
    """Respuesta de autenticación"""
    access_token: str
    refresh_token: str
    expires_in: int
    token_type: str = "Bearer"


@dataclass
class APIResponse:
    """Respuesta estándar de la API"""
    success: bool
    message: str
    data: Optional[dict] = None
    error_code: Optional[str] = None
    timestamp: datetime = None

    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.utcnow()


@dataclass
class SecurityContext:
    """Contexto de seguridad para las funciones"""
    user_id: str
    account_id: Optional[str]
    permissions: List[str]
    session_id: str
    ip_address: str
    user_agent: str
