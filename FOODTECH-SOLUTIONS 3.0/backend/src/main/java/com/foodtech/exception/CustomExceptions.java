package com.foodtech.exception;

import org.springframework.http.HttpStatus;

public class CustomExceptions {
    
    // Constructor privado para evitar instanciación
    private CustomExceptions() {
        throw new UnsupportedOperationException("Esta es una clase de utilidad y no puede ser instanciada");
    }
    
    // Excepción para recursos no encontrados
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }
    
    // Excepción para validación de datos
    public static class ValidationException extends RuntimeException {
        public ValidationException(String message) {
            super(message);
        }
    }
    
    // Excepción para operaciones no permitidas
    public static class OperationNotAllowedException extends RuntimeException {
        public OperationNotAllowedException(String message) {
            super(message);
        }
    }
    
    // Excepción para errores de autenticación
    public static class AuthenticationException extends RuntimeException {
        public AuthenticationException(String message) {
            super(message);
        }
    }
    
    // Excepción para errores de autorización
    public static class AuthorizationException extends RuntimeException {
        public AuthorizationException(String message) {
            super(message);
        }
    }
    
    // Excepción para errores de negocio
    public static class BusinessException extends RuntimeException {
        private final HttpStatus status;
        
        public BusinessException(String message) {
            this(message, HttpStatus.BAD_REQUEST);
        }
        
        public BusinessException(String message, HttpStatus status) {
            super(message);
            this.status = status;
        }
        
        public HttpStatus getStatus() {
            return status;
        }
    }
    
    // Excepción para errores de base de datos
    public static class DatabaseException extends RuntimeException {
        public DatabaseException(String message) {
            super(message);
        }
        
        public DatabaseException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}