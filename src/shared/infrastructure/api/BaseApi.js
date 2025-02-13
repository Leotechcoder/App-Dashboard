
class BaseApi {
  constructor(baseURL = import.meta.env.VITE_ROUTE_API) {
    this.baseURL = baseURL;
  }

  async request(endpoint, method = "GET", data = null) {
    const url = `${this.baseURL}${endpoint}`;
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };

    if (data) options.body = JSON.stringify(data);

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`❌ Error en ${method} ${url}:`, error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint);
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
