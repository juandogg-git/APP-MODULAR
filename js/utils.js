// ===== UTILIDADES GENERALES =====
class AppUtils {
    // Mostrar/ocultar elementos
    static showElement(id) {
        const element = document.getElementById(id);
        if (element) element.style.display = 'block';
    }

    static hideElement(id) {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    }

    // Mensajes de usuario
    static showToast(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toastContainer') || this.createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        `;

        toastContainer.appendChild(toast);

        // Animación de entrada
        setTimeout(() => toast.classList.add('show'), 100);

        // Cerrar toast
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.removeToast(toast));

        // Auto-remover
        if (duration > 0) {
            setTimeout(() => this.removeToast(toast), duration);
        }

        return toast;
    }

    // Navegación entre páginas
    static navigateTo(page) {
        try {
            window.location.href = page;
            return true;
        } catch (error) {
            console.error('Error navegando a:', page, error);
            return false;
        }
    }

    // Verificar si estamos en localhost (para desarrollo)
    static isLocalhost() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname === '';
    }

    static createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    static removeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 300);
    }

    // Validaciones
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isValidPassword(password) {
        return password && password.length >= 6;
    }

    // Formateo de datos
    static formatDate(date) {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Storage helpers
    static setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error guardando en storage:', error);
            return false;
        }
    }

    static getStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error leyendo storage:', error);
            return defaultValue;
        }
    }

    static removeStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removiendo storage:', error);
            return false;
        }
    }

    // Loading states
    static setLoading(button, isLoading) {
        if (!button) return;

        const text = button.querySelector('.btn-text');
        const loading = button.querySelector('.btn-loading');

        if (isLoading) {
            button.disabled = true;
            if (text) text.style.display = 'none';
            if (loading) loading.style.display = 'block';
            button.classList.add('loading');
        } else {
            button.disabled = false;
            if (text) text.style.display = 'block';
            if (loading) loading.style.display = 'none';
            button.classList.remove('loading');
        }
    }
}

// Constantes globales (si no existen en config.js)
if (typeof Constants === 'undefined') {
    window.Constants = {
        STORAGE_KEYS: {
            USER_SESSION: 'user_session',
            REMEMBER_ME: 'remember_me'
        },
        EVENTS: {
            LOGIN_SUCCESS: 'loginSuccess',
            LOGOUT: 'logout',
            SESSION_EXPIRED: 'sessionExpired',
            AUTH_ERROR: 'authError'
        }
    };
}