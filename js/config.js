// ==========================================================================
// CONFIGURACIÓN PRINCIPAL DE LA APLICACIÓN - VALORES GLOBALES
// ==========================================================================

/**
 * Configuración centralizada de la aplicación Modular PWA
 * @description Contiene todas las constantes, URLs y configuraciones del sistema
 * @type {Object}
 */
window.AppConfig = {
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
    APP_NAME: 'Sistema de Gestión JM',
    
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
        GET_USER_DATA: 'getUserData',
        
        /** Obtención de lista de usuarios */
        GET_USERS: 'getUsers',
        
        /** Prueba de conexión con el servidor */
        TEST_CONNECTION: 'testConnection'
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
    },
    
    // ==========================================================================
    // CONFIGURACIÓN DE LA UI - VALORES VISUALES
    // ==========================================================================
    
    /**
     * Configuración relacionada con la interfaz de usuario
     * @type {Object}
     */
    UI: {
        /** Tiempo de duración de las notificaciones toast */
        TOAST_DURATION: 4000,
        
        /** Tiempo de animaciones en milisegundos */
        ANIMATION_DURATION: 300,
        
        /** Breakpoints para diseño responsive */
        BREAKPOINTS: {
            MOBILE: 768,
            TABLET: 1024,
            DESKTOP: 1200
        }
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
window.Constants = {
    
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
        APP_SETTINGS: 'app_settings',
        
        /** Tema de la aplicación (claro/oscuro) */
        THEME: 'app_theme'
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
        AUTH_ERROR: 'authError',
        
        /** Disparado cuando la aplicación está lista */
        APP_READY: 'appReady',
        
        /** Disparado cuando cambia el tema */
        THEME_CHANGED: 'themeChanged'
    },
    
    // ==========================================================================
    // MENSAJES DE LA APLICACIÓN - TEXTO PARA UI
    // ==========================================================================
    
    /**
     * Mensajes estándar para la interfaz de usuario
     * @description Centraliza todos los textos para facilitar internacionalización
     * @type {Object}
     */
    MESSAGES: {
        LOGIN: {
            SUCCESS: '¡Bienvenido!',
            ERROR: 'Error en el inicio de sesión',
            INVALID_CREDENTIALS: 'Email o contraseña incorrectos',
            SESSION_EXPIRED: 'Tu sesión ha expirado'
        },
        ERROR: {
            CONNECTION: 'Error de conexión con el servidor',
            UNEXPECTED: 'Error inesperado en la aplicación',
            PERMISSION: 'No tienes permisos para esta acción'
        },
        SUCCESS: {
            OPERATION_COMPLETED: 'Operación completada correctamente',
            SETTINGS_SAVED: 'Configuración guardada'
        }
    }
};

// ==========================================================================
// COMPATIBILIDAD CON CÓDIGO EXISTENTE
// ==========================================================================

// Para compatibilidad con código que espera estas variables globales
if (typeof GAS_URL === 'undefined') {
    window.GAS_URL = AppConfig.APPS_SCRIPT_URL;
}

if (typeof SHEET_ID === 'undefined') {
    window.SHEET_ID = AppConfig.SHEET_ID;
}

// ==========================================================================
// VERIFICACIÓN DE CONFIGURACIÓN EN CONSOLA
// ==========================================================================

console.log('✅ Config.js cargado - AppConfig:', {
    app: AppConfig.APP_NAME,
    version: AppConfig.VERSION,
    endpoints: Object.keys(AppConfig.ENDPOINTS),
    roles: Object.keys(AppConfig.ROLES)
});