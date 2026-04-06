process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/finance_backend_test?schema=public";
process.env.JWT_SECRET = "test-jwt-secret-123456";
process.env.JWT_EXPIRES_IN = "1h";
