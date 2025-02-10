class BaseApi {
    constructor(baseURL) {
      this.baseURL = baseURL
    }
  
    async fetchData(endpoint, options = {}) {
      const url = `${this.baseURL}${endpoint}`
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        credentials: "include",
      })
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      return response.json()
    }
  
    get(endpoint) {
      return this.fetchData(endpoint)
    }
  
    post(endpoint, data) {
      return this.fetchData(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
      })
    }
  
    put(endpoint, data) {
      return this.fetchData(endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
      })
    }
  
    patch(endpoint, data) {
      return this.fetchData(endpoint, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
    }
  
    delete(endpoint) {
      return this.fetchData(endpoint, {
        method: "DELETE",
      })
    }
  }
  
  export default BaseApi
  
  