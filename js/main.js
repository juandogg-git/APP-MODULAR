// ===== APLICACIÓN PRINCIPAL =====
class ModularApp {
    constructor() {
        this.modules = new Map();
        this.isInitialized = false;
    }

    async init() {
        try {
            console.log('🚀 Inicializando App Modular PWA...');

            // Inicializar módulos básicos
            await this.initializeCoreModules();

            // Configurar event listeners globales
            this.setupGlobalEventListeners();

            // Verificar estado de autenticación
            this.checkAuthStatus();

            this.isInitialized = true;
            console.log('✅ App Modular PWA inicializada correctamente');

        } catch (error) {
            console.error('❌ Error inicializando la aplicación:', error);
            AppUtils.showToast('Error inicializando la aplicación', 'error');
        }
    }

    async initializeCoreModules() {
        // Los módulos se inicializan automáticamente al cargarse
        // AuthManager ya se inicializa en su constructor
        
        // Aquí se pueden inicializar otros módulos cuando se agreguen
        console.log('Módulos core inicializados');
    }

    setupGlobalEventListeners() {
        // Eventos de autenticación
        document.addEventListener(Constants.EVENTS.LOGIN_SUCCESS, (e) => {
            console.log('Login exitoso:', e.detail);
            this.onUserLogin(e.detail);
        });

        document.addEventListener(Constants.EVENTS.LOGOUT, () => {
            console.log('Usuario cerró sesión');
            this.onUserLogout();
        });

        document.addEventListener(Constants.EVENTS.SESSION_EXPIRED, () => {
            console.log('Sesión expirada');
            AppUtils.showToast('Tu sesión ha expirado', 'warning');
        });

        // Manejar errors globales
        window.addEventListener('error', (e) => {
            console.error('Error global:', e.error);
        });

        // Manejar promesas no capturadas
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promesa no capturada:', e.reason);
            e.preventDefault();
        });
    }

    checkAuthStatus() {
        if (Auth.isLoggedIn()) {
            console.log('Usuario ya está autenticado');
            this.onUserLogin(Auth.getCurrentUser());
        } else {
            console.log('Usuario no autenticado');
        }
    }

    onUserLogin(user) {
        // Actualizar UI con datos del usuario
        this.updateUserInterface(user);
        
        // Cargar módulos específicos del usuario
        this.loadUserModules(user);
        
        // Inicializar dashboard si existe
        if (typeof Dashboard !== 'undefined') {
            Dashboard.init();
        }
    }

    onUserLogout() {
        // Limpiar módulos de usuario
        this.unloadUserModules();
        
        // Resetear UI
        this.resetUserInterface();
    }

    updateUserInterface(user) {
        // Actualizar elementos de la UI con datos del usuario
        const greetingElement = document.getElementById('userGreeting');
        if (greetingElement) {
            greetingElement.textContent = `Hola, ${user.name}`;
        }

        // Actualizar navegación basada en roles
        this.updateNavigation(user.role);
    }

    updateNavigation(userRole) {
        // Mostrar/ocultar elementos de navegación basados en el rol
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            const section = item.getAttribute('data-section');
            
            // Ejemplo: ocultar configuración para usuarios no admin
            if (section === 'settings' && userRole !== AppConfig.ROLES.ADMIN) {
                item.style.display = 'none';
            } else {
                item.style.display = 'block';
            }
        });
    }

    resetUserInterface() {
        // Restablecer UI al estado de logout
        const greetingElement = document.getElementById('userGreeting');
        if (greetingElement) {
            greetingElement.textContent = 'Hola, Usuario';
        }

        // Mostrar todos los items de navegación
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.style.display = 'block';
        });

        // Resetear formulario de login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
        }
    }

    loadUserModules(user) {
        // Cargar módulos específicos basados en el usuario
        console.log('Cargando módulos para usuario:', user.role);
        
        // Ejemplo: cargar dashboard manager para todos los usuarios
        // Los módulos se cargan mediante script tags en el HTML
    }

    unloadUserModules() {
        // Limpiar módulos específicos del usuario
        console.log('Descargando módulos de usuario');
        
        // Los módulos pueden limpiar sus estados internos
        if (typeof Dashboard !== 'undefined' && Dashboard.cleanup) {
            Dashboard.cleanup();
        }
    }

    // Registrar módulos dinámicamente
    registerModule(name, moduleInstance) {
        this.modules.set(name, moduleInstance);
        console.log(`Módulo registrado: ${name}`);
    }

    // Obtener módulo
    getModule(name) {
        return this.modules.get(name);
    }

    // Método para desarrollo: estado de la app
    getAppStatus() {
        return {
            initialized: this.isInitialized,
            user: Auth.getCurrentUser(),
            loggedIn: Auth.isLoggedIn(),
            modules: Array.from(this.modules.keys()),
            config: AppConfig
        };
    }
}

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
document.addEventListener('DOMContentLoaded', async () => {
    // Crear instancia global de la aplicación
    window.App = new ModularApp();
    
    // Inicializar cuando el DOM esté listo
    await window.App.init();
    
    // Exponer utilidades globales para desarrollo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.AppUtils = AppUtils;
        window.Auth = Auth;
        window.GASClient = GASClient;
    }
});

// Exportar para módulos (si se usa ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModularApp, AppUtils, Auth, GASClient };
}