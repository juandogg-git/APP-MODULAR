// ==========================================================================
// CONFIGURACIÓN PRINCIPAL DE LA APLICACIÓN - VALORES GLOBALES
// ==========================================================================

/**
 * Configuración centralizada de la aplicación Modular PWA
 * @description Contiene todas las constantes, URLs y configuraciones del sistema
 * @type {Object}
 */
const AppConfig = {
    // ==========================================================================
    // CONFIGURACIÓN GOOGLE SERVICES - INTEGRACIÓN CON BACKEND
    // ==========================================================================
    
    /**
     * ID de Google Sheets para almacenamiento de datos
     * @description Identificador único de la hoja de cálculo donde se guardarán los datos
     * @type {string}
     */
    SHEET_ID: '16y3zppISgDVGkLeAcFUnFIBLdsGouwmFMQYHpoNg6xQ',
    
    /**
     * URL de Google Apps Script para comunicación con backend
     * @description Endpoint principal para todas las operaciones del servidor
     * @type {string}
     */
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycby4b3ANm05JN6DfFP7H_38ey_R9cnMxcOobqj76ywzofL54-xBvMB5DcZgYdvb2Nf47/exec',

    // ==========================================================================
    // CONFIGURACIÓN GENERAL DE LA APLICACIÓN
    // ==========================================================================
    
    /**
     * Nombre de la aplicación para mostrar en UI y metadata
     * @type {string}
     */
    APP_NAME: 'App Modular PWA',
    
    /**
     * Versión semántica de la aplicación para control de cambios
     * @type {string}
     */
    VERSION: '1.0.0',
    
    // ==========================================================================
    // CONFIGURACIÓN DE SEGURIDAD Y SESIONES
    // ==========================================================================
    
    /**
     * Tiempo de expiración de sesión activa en milisegundos
     * @description 1 hora = 60 minutos * 60 segundos * 1000 milisegundos
     * @type {number}
     */
    SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hora
    
    /**
     * Duración de sesión cuando se usa "Recordarme" en milisegundos
     * @description 30 días = 30 días * 24 horas * 60 minutos * 60 segundos * 1000 milisegundos
     * @type {number}
     */
    REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 días

    // ==========================================================================
    // ENDPOINTS DE GOOGLE APPS SCRIPT - MAPEO DE FUNCIONES
    // ==========================================================================
    
    /**
     * Mapeo de nombres de funciones disponibles en el backend
     * @description Conecta las acciones del frontend con las funciones del backend
     * @type {Object}
     */
    ENDPOINTS: {
        /** Autenticación de usuario con email y contraseña */
        LOGIN: 'loginUser',
        
        /** Validación de token de sesión activa */
        VALIDATE_SESSION: 'validateSession',
        
        /** Cierre de sesión y limpieza de tokens */
        LOGOUT: 'logoutUser',
        
        /** Obtención de datos del perfil de usuario */
        GET_USER_DATA: 'getUserData'
    },

    // ==========================================================================
    // SISTEMA DE ROLES Y PERMISOS
    // ==========================================================================
    
    /**
     * Roles de usuario disponibles en el sistema
     * @description Define los niveles de acceso y permisos
     * @type {Object}
     */
    ROLES: {
        /** Usuario estándar - Acceso básico a funcionalidades */
        USER: 'user',
        
        /** Administrador - Acceso completo al sistema */
        ADMIN: 'admin',
        
        /** Moderador - Acceso intermedio para gestión de contenido */
        MODERATOR: 'moderator'
    },

    // ==========================================================================
    // ESTADOS DE LA APLICACIÓN - MÁQUINA DE ESTADOS
    // ==========================================================================
    
    /**
     * Estados posibles del ciclo de vida de la aplicación
     * @description Controla la UI y flujo según el estado actual
     * @type {Object}
     */
    STATES: {
        /** Estado inicial - Usuario no autenticado */
        LOGGED_OUT: 'logged_out',
        
        /** Sesión activa - Usuario autenticado correctamente */
        LOGGED_IN: 'logged_in',
        
        /** Estado de carga - Operaciones en progreso */
        LOADING: 'loading',
        
        /** Estado de error - Algo salió mal */
        ERROR: 'error'
    }
};

// ==========================================================================
// CONSTANTES DE LA APLICACIÓN - VALORES INMUTABLES
// ==========================================================================

/**
 * Constantes globales de la aplicación
 * @description Valores que no cambian durante la ejecución y son utilizados en múltiples módulos
 * @type {Object}
 */
const Constants = {
    
    // ==========================================================================
    // CLAVES DE ALMACENAMIENTO LOCAL - LOCALSTORAGE KEYS
    // ==========================================================================
    
    /**
     * Claves utilizadas para almacenamiento en localStorage
     * @description Garantiza consistencia en los nombres de las claves de almacenamiento
     * @type {Object}
     */
    STORAGE_KEYS: {
        /** Almacena la sesión del usuario (token, datos) */
        USER_SESSION: 'user_session',
        
        /** Indica si el usuario seleccionó "Recordarme" */
        REMEMBER_ME: 'remember_me',
        
        /** Configuraciones de preferencias de la aplicación */
        APP_SETTINGS: 'app_settings'
    },

    // ==========================================================================
    // EVENTOS PERSONALIZADOS - SISTEMA DE COMUNICACIÓN ENTRE MÓDULOS
    // ==========================================================================
    
    /**
     * Eventos personalizados para comunicación entre componentes
     * @description Sistema pub/sub para desacoplar módulos
     * @type {Object}
     */
    EVENTS: {
        /** Disparado cuando el login es exitoso */
        LOGIN_SUCCESS: 'loginSuccess',
        
        /** Disparado cuando el usuario cierra sesión */
        LOGOUT: 'logout',
        
        /** Disparado cuando la sesión expira automáticamente */
        SESSION_EXPIRED: 'sessionExpired',
        
        /** Disparado cuando ocurre un error de autenticación */
        AUTH_ERROR: 'authError'
    }
};

// ==========================================================================
// EXPORTACIÓN PARA MÓDULOS (SI SE USA ES6 MODULES)
// ==========================================================================

// Nota: Para usar en entornos con módulos ES6, descomentar:
// export { AppConfig, Constants };


