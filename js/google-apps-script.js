// ===== GOOGLE APPS SCRIPT CLIENT - SOLUCIÓN DEFINITIVA CORREGIDA =====
console.log('🚀 Inicializando GASClient - Conexión optimizada');

class GoogleAppsScriptClient {
    constructor() {
        this.baseUrl = 'https://script.google.com/macros/s/AKfycby4b3ANm05JN6DfFP7H_38ey_R9cnMxcOobqj76ywzofL54-xBvMB5DcZgYdvb2Nf47/exec';
        this.sheetId = '16y3zppISgDVGkLeAcFUnFIBLdsGouwmFMQYHpoNg6xQ';
        this.timeout = 15000; // Reducido para mejor UX
        console.log('✅ GASClient optimizado - Usando método GET');
    }

    async callFunction(functionName, data = {}) {
        console.log(`📡 [${functionName}] Conectando con Google Apps Script...`);

        // 🔥 USAR SOLO MÉTODO GET PARA EVITAR CORS
        return await this.tryGetMethod(functionName, data);
    }

    async tryGetMethod(functionName, data) {
        try {
            // Construir URL con parámetros GET
            const params = new URLSearchParams();
            params.append('action', functionName);
            params.append('sheetId', this.sheetId);
            params.append('timestamp', new Date().toISOString());
            params.append('source', 'web-app');
            params.append('origin', window.location.origin);
            
            // Agregar parámetros adicionales específicos de cada función
            if (functionName === 'getUsers') {
                params.append('diagnostic', 'true');
                params.append('includeRawData', 'false');
            }
            
            // Agregar parámetros del data
            for (const key in data) {
                if (data[key] !== undefined && data[key] !== null) {
                    if (typeof data[key] === 'object') {
                        params.append(key, JSON.stringify(data[key]));
                    } else {
                        params.append(key, data[key].toString());
                    }
                }
            }
            
            const url = `${this.baseUrl}?${params.toString()}`;
            console.log('🔗 URL GET optimizada:', url);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log(`✅ [${functionName}] GET exitoso:`, result);
            
            if (!result.success) {
                throw new Error(result.message || 'Error en la respuesta del servidor');
            }

            return result;
            
        } catch (error) {
            console.error(`❌ [${functionName}] Error GET:`, error);
            
            // 🔥 FALLBACK: Intentar con JSONP si GET falla
            if (error.name === 'TypeError' || error.name === 'AbortError') {
                return await this.tryJsonpMethod(functionName, data);
            }
            
            throw error;
        }
    }

    async tryJsonpMethod(functionName, data) {
        return new Promise((resolve) => {
            console.log('🔄 Intentando método JSONP...');
            
            const callbackName = 'gas_callback_' + Date.now();
            const scriptId = 'gas_script_' + Date.now();
            
            // Construir URL JSONP
            const params = new URLSearchParams();
            params.append('action', functionName);
            params.append('sheetId', this.sheetId);
            params.append('callback', callbackName);
            
            const url = `${this.baseUrl}?${params.toString()}`;
            
            const timeoutId = setTimeout(() => {
                delete window[callbackName];
                const script = document.getElementById(scriptId);
                if (script) script.remove();
                resolve({
                    success: false,
                    message: 'Timeout en método JSONP'
                });
            }, this.timeout);
            
            // Crear callback global
            window[callbackName] = (result) => {
                clearTimeout(timeoutId);
                delete window[callbackName];
                const script = document.getElementById(scriptId);
                if (script) script.remove();
                console.log(`✅ [${functionName}] JSONP exitoso:`, result);
                resolve(result);
            };
            
            // Crear script
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = url;
            script.onerror = () => {
                clearTimeout(timeoutId);
                delete window[callbackName];
                script.remove();
                resolve({
                    success: false,
                    message: 'Error cargando script JSONP'
                });
            };
            
            document.head.appendChild(script);
        });
    }

    async testConnection() {
        try {
            console.log('🔍 Probando conexión con Google Apps Script...');
            const result = await this.callFunction('testConnection');
            
            if (result.success) {
                console.log('✅ Prueba de conexión exitosa:', result);
                
                // Mostrar información útil en consola
                if (result.availableActions) {
                    console.log('🛠️ Acciones disponibles:', result.availableActions);
                }
                if (result.yourStructure) {
                    console.log('📊 Estructura de datos:', result.yourStructure);
                }
            } else {
                console.warn('⚠️ Prueba de conexión con advertencias:', result);
            }
            
            return result;
        } catch (error) {
            console.error('❌ Prueba de conexión fallida:', error);
            return {
                success: false,
                message: 'Error de conexión: ' + error.message,
                connectionTest: 'failed',
                error: error.toString()
            };
        }
    }

    async getUsers(options = {}) {
        console.log('👥 Solicitando usuarios REALES desde Google Sheets...');
        
        const requestData = {
            diagnostic: true,
            includeRawData: false,
            timestamp: new Date().toISOString(),
            ...options
        };
        
        try {
            const result = await this.callFunction('getUsers', requestData);
            
            if (result.success) {
                const userCount = result.users ? result.users.length : 0;
                console.log(`✅ ${userCount} usuarios cargados`);
                
                if (userCount === 0) {
                    console.warn('⚠️ Se cargaron 0 usuarios. Verificar:');
                    console.warn('   - ¿La hoja "Usuarios" existe?');
                    console.warn('   - ¿Hay datos en la hoja?');
                    console.warn('   - ¿La estructura de columnas es correcta?');
                    
                    if (result.debugInfo) {
                        console.log('🔍 Info debug:', result.debugInfo);
                    }
                }
            } else {
                console.error('❌ Error cargando usuarios:', result.message);
                
                // Información adicional para debugging
                if (result.debug) {
                    console.log('🐛 Debug info:', result.debug);
                }
            }
            
            return result;
        } catch (error) {
            console.error('💥 Error crítico cargando usuarios:', error);
            return {
                success: false,
                message: 'Error crítico: ' + error.message,
                users: [],
                error: error.toString()
            };
        }
    }

    async loginUser(credentials) {
        console.log('🔐 Intentando login con:', { 
            email: credentials.email, 
            hasPassword: !!credentials.password 
        });
        
        try {
            const result = await this.callFunction('loginUser', credentials);
            
            if (result.success) {
                console.log('✅ Login exitoso para:', result.user?.email || credentials.email);
            } else {
                console.warn('❌ Login fallido:', result.message);
            }
            
            return result;
        } catch (error) {
            console.error('💥 Error en login:', error);
            return {
                success: false,
                message: 'Error de conexión durante login: ' + error.message
            };
        }
    }

    // 🔥 NUEVO MÉTODO: Diagnóstico completo
    async runFullDiagnostic() {
        console.group('🔧 DIAGNÓSTICO COMPLETO GAS');
        
        // 1. Probar conexión básica
        console.log('1. 🔌 Probando conexión básica...');
        const connectionTest = await this.testConnection();
        
        // 2. Probar obtención de usuarios
        console.log('2. 👥 Probando carga de usuarios...');
        const usersTest = await this.getUsers({ diagnostic: true });
        
        // 3. Resumen del diagnóstico
        console.log('3. 📊 Resumen del diagnóstico:');
        console.log('   - Conexión:', connectionTest.success ? '✅ OK' : '❌ FALLÓ');
        console.log('   - Usuarios:', usersTest.success ? `✅ ${usersTest.users?.length || 0} usuarios` : '❌ FALLÓ');
        
        if (connectionTest.success && !usersTest.success) {
            console.log('   🚨 CONEXIÓN OK pero USUARIOS FALLÓ - Verificar estructura de datos');
        }
        
        console.groupEnd();
        
        return {
            connection: connectionTest,
            users: usersTest,
            overall: connectionTest.success && usersTest.success
        };
    }
}

// Inicializar GASClient global con mejor manejo de errores
if (typeof GASClient === 'undefined') {
    try {
        window.GASClient = new GoogleAppsScriptClient();
        console.log('🎉 GASClient inicializado - Listo para cargar datos REALES');
        
        // Probar conexión automáticamente después de 2 segundos
        setTimeout(() => {
            console.log('🔧 Ejecutando prueba de conexión automática...');
            GASClient.testConnection().then(result => {
                if (result.success) {
                    console.log('🔥 CONEXIÓN CONFIRMADA - Google Apps Script funcionando');
                    console.log('📊 Mensaje:', result.message);
                    
                    // Si hay estructura de datos, mostrarla
                    if (result.yourStructure) {
                        console.log('📋 Estructura detectada:', result.yourStructure);
                    }
                } else {
                    console.log('💥 CONEXIÓN FALLIDA - Verificar configuración');
                    console.log('🔧 Detalles:', result.message);
                    
                    // Sugerencias automáticas
                    console.log('💡 Sugerencias:');
                    console.log('   - Verificar que el Google Script esté desplegado');
                    console.log('   - Verificar los permisos del Script');
                    console.log('   - Verificar el sheetId en la configuración');
                }
            }).catch(error => {
                console.error('💥 Error inesperado en prueba automática:', error);
            });
        }, 2000);
        
    } catch (error) {
        console.error('💥 Error crítico inicializando GASClient:', error);
        window.GASClient = {
            testConnection: () => Promise.resolve({ success: false, message: 'Client no inicializado' }),
            getUsers: () => Promise.resolve({ success: false, message: 'Client no inicializado', users: [] }),
            loginUser: () => Promise.resolve({ success: false, message: 'Client no inicializado' })
        };
    }
} else {
    console.log('ℹ️ GASClient ya estaba inicializado');
}

// 🔥 EXPORTAR PARA MÓDULOS (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleAppsScriptClient;
}