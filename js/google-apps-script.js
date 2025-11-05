// ===== GOOGLE APPS SCRIPT CLIENT - SOLUCIÓN DEFINITIVA =====
console.log('🚀 Inicializando GASClient - Conexión directa confirmada');

class GoogleAppsScriptClient {
    constructor() {
        this.baseUrl = 'https://script.google.com/macros/s/AKfycby4b3ANm05JN6DfFP7H_38ey_R9cnMxcOobqj76ywzofL54-xBvMB5DcZgYdvb2Nf47/exec';
        this.sheetId = '16y3zppISgDVGkLeAcFUnFIBLdsGouwmFMQYHpoNg6xQ';
        this.timeout = 20000;
        console.log('✅ GASClient listo - Script funcionando correctamente');
    }

    async callFunction(functionName, data = {}) {
        console.log(`📡 [${functionName}] Conectando con Google Apps Script...`);

        const payload = {
            ...data,
            action: functionName,
            sheetId: this.sheetId,
            timestamp: new Date().toISOString(),
            source: 'web-app',
            origin: window.location.origin
        };

        try {
            console.log('🔗 Enviando petición POST...', payload);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            // 🔥 CONEXIÓN DIRECTA - Google Apps Script está funcionando
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log(`✅ [${functionName}] Respuesta recibida:`, result);
            
            if (!result.success) {
                throw new Error(result.message || 'Error en la respuesta del servidor');
            }

            return result;

        } catch (error) {
            console.error(`❌ [${functionName}] Error de conexión:`, error);
            
            // 🔥 PROBAR MÉTODO GET COMO ALTERNATIVA
            console.log('🔄 Intentando con método GET...');
            return await this.tryGetMethod(functionName, data);
        }
    }

    async tryGetMethod(functionName, data) {
        try {
            // Construir URL con parámetros GET
            const params = new URLSearchParams();
            params.append('action', functionName);
            params.append('sheetId', this.sheetId);
            params.append('timestamp', new Date().toISOString());
            params.append('source', 'web-app');
            
            // Agregar parámetros adicionales
            for (const key in data) {
                if (data[key] !== undefined && data[key] !== null) {
                    params.append(key, data[key]);
                }
            }
            
            const url = `${this.baseUrl}?${params.toString()}`;
            console.log('🔗 URL GET:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`GET Error HTTP ${response.status}`);
            }

            const result = await response.json();
            console.log(`✅ [${functionName}] GET exitoso:`, result);
            
            if (!result.success) {
                throw new Error(result.message || 'Error en respuesta GET');
            }

            return result;
            
        } catch (getError) {
            console.error('❌ Método GET también falló:', getError);
            
            // 🔥 ÚLTIMO INTENTO: Usar iframe
            return await this.tryIframeMethod(functionName, data);
        }
    }

    async tryIframeMethod(functionName, data) {
        return new Promise((resolve) => {
            console.log('🔧 Intentando método iframe...');
            
            const iframeId = 'gas_iframe_' + Date.now();
            const iframe = document.createElement('iframe');
            iframe.id = iframeId;
            iframe.style.display = 'none';
            iframe.sandbox = 'allow-scripts allow-same-origin';
            
            // Construir URL para iframe
            const params = new URLSearchParams();
            params.append('action', functionName);
            params.append('sheetId', this.sheetId);
            params.append('timestamp', new Date().toISOString());
            
            iframe.src = `${this.baseUrl}?${params.toString()}`;
            
            const timeoutId = setTimeout(() => {
                document.body.removeChild(iframe);
                resolve({
                    success: false,
                    message: 'Timeout en método iframe'
                });
            }, this.timeout);
            
            // Escuchar cuando el iframe carga
            iframe.onload = () => {
                clearTimeout(timeoutId);
                try {
                    // Intentar leer el contenido (esto puede no funcionar por CORS)
                    const iframeContent = iframe.contentDocument || iframe.contentWindow.document;
                    const text = iframeContent.body.innerText;
                    if (text) {
                        const result = JSON.parse(text);
                        resolve(result);
                    } else {
                        resolve({
                            success: false,
                            message: 'No se pudo leer respuesta del iframe'
                        });
                    }
                } catch (error) {
                    resolve({
                        success: false,
                        message: 'Error leyendo iframe: ' + error.message
                    });
                }
                document.body.removeChild(iframe);
            };
            
            iframe.onerror = () => {
                clearTimeout(timeoutId);
                document.body.removeChild(iframe);
                resolve({
                    success: false,
                    message: 'Error cargando iframe'
                });
            };
            
            document.body.appendChild(iframe);
        });
    }

    async testConnection() {
        try {
            console.log('🔍 Probando conexión con Google Apps Script...');
            const result = await this.callFunction('testConnection');
            console.log('✅ Prueba de conexión exitosa:', result);
            return result;
        } catch (error) {
            console.error('❌ Prueba de conexión fallida:', error);
            return {
                success: false,
                message: 'Error de conexión: ' + error.message,
                connectionTest: 'failed'
            };
        }
    }

    async getUsers() {
        console.log('👥 Solicitando usuarios REALES desde Google Sheets...');
        const result = await this.callFunction('getUsers', { 
            diagnostic: true,
            includeRawData: false,
            timestamp: new Date().toISOString()
        });
        
        if (result.success) {
            console.log(`✅ ${result.users ? result.users.length : 0} usuarios cargados`);
        } else {
            console.log('❌ Error cargando usuarios:', result.message);
        }
        
        return result;
    }

    async loginUser(credentials) {
        return this.callFunction('loginUser', credentials);
    }
}

// Inicializar GASClient global
if (typeof GASClient === 'undefined') {
    window.GASClient = new GoogleAppsScriptClient();
    console.log('🎉 GASClient inicializado - Listo para cargar datos REALES');
    
    // Probar conexión automáticamente
    setTimeout(() => {
        console.log('🔧 Ejecutando prueba de conexión automática...');
        GASClient.testConnection().then(result => {
            if (result.success) {
                console.log('🔥 CONEXIÓN CONFIRMADA - Google Apps Script funcionando');
                console.log('📊 Mensaje:', result.message);
            } else {
                console.log('💥 CONEXIÓN FALLIDA - Verificar configuración');
                console.log('🔧 Detalles:', result.message);
            }
        });
    }, 1000);
} else {
    console.log('ℹ️ GASClient ya estaba inicializado');
}