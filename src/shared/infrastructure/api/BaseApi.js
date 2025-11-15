class BaseApi {
  constructor(baseURL = import.meta.env.VITE_ROUTE_API) {
    this.baseURL = baseURL;
  }

  async request(endpoint, method = "GET", data = null) {
    const url = `${this.baseURL}${endpoint}`;

    // Detectar si viene un FormData
    const isFormData = data instanceof FormData;

    const options = {
      method,
      credentials: "include",
    };

    // Aplicamos headers SOLO si NO es FormData
    if (!isFormData) {
      options.headers = { "Content-Type": "application/json" };
    }

    // Cuerpo de la petición
    if (data) {
      options.body = isFormData ? data : JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      // Leemos como texto primero
      const text = await response.text();
      let result = {};

      if (text) {
        try {
          result = JSON.parse(text);
        } catch {
          result = { message: text };
        }
      }

      if (!response.ok) {
        throw new Error(result?.error || result?.message || `Error ${response.status}`);
      }

      return result?.message ? result : { ...result, message: "Operación completada" };
    } catch (error) {
      console.error(`❌ Error en ${method} ${url}:`, error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, "GET");
  }

  post(endpoint, data) {
    return this.request(endpoint, "POST", data);
  }

  put(endpoint, data) {
    return this.request(endpoint, "PUT", data);
  }

  patch(endpoint, data) {
    return this.request(endpoint, "PATCH", data);
  }

  delete(endpoint) {
    return this.request(endpoint, "DELETE");
  }
}

export default BaseApi;
