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

            // Mostrar toast de bienvenida
            AppUtils.showToast('Sistema cargado correctamente', 'success');

        } catch (error) {
            console.error('❌ Error inicializando la aplicación:', error);
            AppUtils.showToast('Error inicializando la aplicación', 'error');
        }
    }

    async initializeCoreModules() {
        // Los módulos se inicializan automáticamente al cargarse
        // AuthManager ya se inicializa en su constructor
        
        // Configuración por defecto si no existe
        if (typeof AppConfig === 'undefined') {
            window.AppConfig = {
                APP_NAME: 'App Modular',
                ROLES: {
                    ADMIN: 'admin',
                    USER: 'user'
                }
            };
        }
        
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

        // Navegación entre secciones
        this.setupNavigation();

        // Manejar errors globales
        window.addEventListener('error', (e) => {
            console.error('Error global:', e.error);
        });

        // Manejar promesas no capturadas
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promesa no capturada:', e.reason);
            AppUtils.showToast('Error inesperado en la aplicación', 'error');
            e.preventDefault();
        });
    }

    setupNavigation() {
        // Navegación principal
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Botón diagnóstico
        const diagnosticBtn = document.getElementById('diagnosticBtn');
        if (diagnosticBtn) {
            diagnosticBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'verify-users.html';
            });
        }
    }

    showSection(sectionName) {
        // Ocultar todos los paneles
        const panes = document.querySelectorAll('.section-pane');
        panes.forEach(pane => pane.classList.remove('active'));
        
        // Mostrar panel seleccionado
        const targetPane = document.getElementById(sectionName + 'Pane');
        if (targetPane) {
            targetPane.classList.add('active');
        }
        
        // Actualizar navegación activa
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === sectionName) {
                item.classList.add('active');
            }
        });
        
        // Actualizar breadcrumbs
        this.updateBreadcrumbs(sectionName);
    }

    updateBreadcrumbs(sectionName) {
        const breadcrumbs = document.getElementById('breadcrumbs');
        if (breadcrumbs) {
            const sectionTitles = {
                dashboard: 'Dashboard',
                users: 'Usuarios',
                settings: 'Configuración'
            };
            
            breadcrumbs.innerHTML = `
                <a href="#dashboard" class="breadcrumb-item">Dashboard</a>
                <span class="breadcrumb-separator">/</span>
                <span class="breadcrumb-item active">${sectionTitles[sectionName] || sectionName}</span>
            `;
        }
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
        
        // Mostrar dashboard por defecto
        this.showSection('dashboard');
        
        // Actualizar métricas del dashboard
        this.updateDashboardMetrics();
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
            if (section === 'settings' && userRole !== 'admin') {
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

    updateDashboardMetrics() {
        // Actualizar métricas del dashboard
        if (window.GASClient) {
            GASClient.getUsers().then(result => {
                if (result.success && result.users) {
                    document.getElementById('totalUsers').textContent = result.users.length;
                }
            });
        }
        
        // Actualizar otras métricas
        document.getElementById('activeSessions').textContent = '1';
        document.getElementById('totalLogins').textContent = '1';
    }

    loadUserModules(user) {
        // Cargar módulos específicos basados en el usuario
        console.log('Cargando módulos para usuario:', user.role);
    }

    unloadUserModules() {
        // Limpiar módulos específicos del usuario
        console.log('Descargando módulos de usuario');
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
    if (AppUtils.isLocalhost()) {
        window.AppUtils = AppUtils;
        window.Auth = Auth;
        console.log('🔧 Modo desarrollo: utilidades expuestas globalmente');
    }
});