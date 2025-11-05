// ===== SISTEMA DE AUTENTICACIÓN =====
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionToken = null;
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        this.loadSession();
        this.setupEventListeners();
        this.isInitialized = true;
        console.log('AuthManager inicializado');
    }

    // Cargar sesión existente
    loadSession() {
        try {
            const savedSession = AppUtils.getStorage(Constants.STORAGE_KEYS.USER_SESSION);
            const rememberMe = AppUtils.getStorage(Constants.STORAGE_KEYS.REMEMBER_ME);

            if (savedSession && rememberMe) {
                this.currentUser = savedSession.user;
                this.sessionToken = savedSession.token;
                
                // Validar sesión con el servidor
                this.validateCurrentSession();
            } else {
                this.showLoginUI();
            }
        } catch (error) {
            console.error('Error cargando sesión:', error);
            this.showLoginUI();
        }
    }

    // Validar sesión actual
    async validateCurrentSession() {
        if (!this.sessionToken) {
            this.showLoginUI();
            return;
        }

        try {
            const result = await GASClient.validateSession(this.sessionToken);
            
            if (result.success) {
                this.currentUser = result.user;
                this.showAppUI();
                this.dispatchEvent(Constants.EVENTS.LOGIN_SUCCESS, this.currentUser);
            } else {
                this.handleSessionExpired();
            }
        } catch (error) {
            console.error('Error validando sesión:', error);
            this.handleSessionExpired();
        }
    }

    // Iniciar sesión
    async login(credentials) {
        try {
            AppUtils.showElement('loadingOverlay');
            
            const result = await GASClient.loginUser(credentials);
            
            if (result.success) {
                this.currentUser = result.user;
                this.sessionToken = result.session.token;
                
                // Guardar sesión si "Recordarme" está activado
                if (credentials.rememberMe) {
                    AppUtils.setStorage(Constants.STORAGE_KEYS.USER_SESSION, {
                        user: this.currentUser,
                        token: this.sessionToken
                    });
                    AppUtils.setStorage(Constants.STORAGE_KEYS.REMEMBER_ME, true);
                }
                
                this.showAppUI();
                this.dispatchEvent(Constants.EVENTS.LOGIN_SUCCESS, this.currentUser);
                AppUtils.showToast('¡Bienvenido!', 'success');
                
            } else {
                throw new Error(result.message || 'Error en el inicio de sesión');
            }
            
        } catch (error) {
            console.error('Error en login:', error);
            AppUtils.showToast(error.message, 'error');
            this.dispatchEvent(Constants.EVENTS.AUTH_ERROR, error);
            
        } finally {
            AppUtils.hideElement('loadingOverlay');
        }
    }

    // Cerrar sesión
    async logout() {
        try {
            if (this.sessionToken) {
                await GASClient.logoutUser(this.sessionToken);
            }
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            this.clearSession();
            this.showLoginUI();
            this.dispatchEvent(Constants.EVENTS.LOGOUT);
            AppUtils.showToast('Sesión cerrada', 'info');
        }
    }

    // Limpiar sesión
    clearSession() {
        this.currentUser = null;
        this.sessionToken = null;
        AppUtils.removeStorage(Constants.STORAGE_KEYS.USER_SESSION);
        AppUtils.removeStorage(Constants.STORAGE_KEYS.REMEMBER_ME);
    }

    // Manejar sesión expirada
    handleSessionExpired() {
        this.clearSession();
        this.showLoginUI();
        this.dispatchEvent(Constants.EVENTS.SESSION_EXPIRED);
        AppUtils.showToast('Sesión expirada, por favor inicia sesión nuevamente', 'warning');
    }

    // Mostrar UI de login
    showLoginUI() {
        AppUtils.hideElement('mainNav');
        AppUtils.hideElement('dashboardSection');
        AppUtils.hideElement('logoutBtn');
        
        AppUtils.showElement('loginSection');
        AppUtils.showElement('installBtn');
    }

    // Mostrar UI de la aplicación
    showAppUI() {
        AppUtils.hideElement('loginSection');
        AppUtils.hideElement('installBtn');
        
        AppUtils.showElement('mainNav');
        AppUtils.showElement('dashboardSection');
        AppUtils.showElement('logoutBtn');
        
        this.updateUserInterface();
    }

    // Actualizar UI con datos del usuario
    updateUserInterface() {
        if (this.currentUser) {
            // Actualizar saludo
            const greetingElement = document.getElementById('userGreeting');
            if (greetingElement) {
                greetingElement.textContent = `Hola, ${this.currentUser.name}`;
            }

            // Actualizar título de la app
            document.title = `${AppConfig.APP_NAME} - ${this.currentUser.name}`;
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        // Formulario de login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLoginSubmit(e));
        }

        // Botón logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Validación en tiempo real
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmailField());
        }

        if (passwordInput) {
            passwordInput.addEventListener('blur', () => this.validatePasswordField());
        }
    }

    // Manejar envío del formulario de login
    handleLoginSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const credentials = {
            email: formData.get('email'),
            password: formData.get('password'),
            rememberMe: document.getElementById('rememberMe').checked
        };

        if (this.validateCredentials(credentials)) {
            this.login(credentials);
        }
    }

    // Validar credenciales
    validateCredentials(credentials) {
        let isValid = true;

        // Validar email
        if (!AppUtils.isValidEmail(credentials.email)) {
            this.showFieldError('emailError', 'Por favor ingresa un email válido');
            isValid = false;
        } else {
            this.hideFieldError('emailError');
        }

        // Validar contraseña
        if (!AppUtils.isValidPassword(credentials.password)) {
            this.showFieldError('passwordError', 'La contraseña debe tener al menos 6 caracteres');
            isValid = false;
        } else {
            this.hideFieldError('passwordError');
        }

        return isValid;
    }

    // Validación individual de campos
    validateEmailField() {
        const email = document.getElementById('email').value;
        if (email && !AppUtils.isValidEmail(email)) {
            this.showFieldError('emailError', 'Por favor ingresa un email válido');
            return false;
        } else {
            this.hideFieldError('emailError');
            return true;
        }
    }

    validatePasswordField() {
        const password = document.getElementById('password').value;
        if (password && !AppUtils.isValidPassword(password)) {
            this.showFieldError('passwordError', 'La contraseña debe tener al menos 6 caracteres');
            return false;
        } else {
            this.hideFieldError('passwordError');
            return true;
        }
    }

    // Helpers para mostrar/ocultar errores
    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(fieldId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    hideFieldError(fieldId) {
        const errorElement = document.getElementById(fieldId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    // Event dispatcher
    dispatchEvent(eventName, data = null) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    // Getters
    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return !!this.currentUser && !!this.sessionToken;
    }

    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }
}

// Instancia global del AuthManager
const Auth = new AuthManager();