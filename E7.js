import { API_BASE_URL, API_KEY } from './Constante.js';

// Función auxiliar para manejar solicitudes fetch
async function fetchJson(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Respuesta no exitosa desde ${url}: ${response.status} ${response.statusText}. Respuesta cruda: ${text}`);
        }

        const text = await response.text();
        if (!text) {
            throw new Error(`Respuesta vacía desde ${url}`);
        }

        try {
            return JSON.parse(text);
        } catch (jsonError) {
            throw new Error(`Error al parsear JSON desde ${url}: ${jsonError.message}. Respuesta cruda: ${text}`);
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error(`Solicitud a ${url} expiró`);
        }
        throw new Error(`Error en fetch a ${url}: ${error.message}`);
    } finally {
        clearTimeout(timeoutId);
    }
}

async function submitSolution() {
    const apiUrl = "https://your-api-url.com";
    console.log('Enviando solución:', { urbase_urll: apiUrl });
    const response = await fetchJson(`${API_BASE_URL}/v1/s1/e7/solution`, {
        method: 'POST',
        headers: {
            'API-KEY': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ base_url: apiUrl })
    });
    console.log('Respuesta del servidor:', response);
    return response;
}

submitSolution()
    .then(result => console.log('Resultado final:', result))
    .catch(error => console.error('Error:', error));