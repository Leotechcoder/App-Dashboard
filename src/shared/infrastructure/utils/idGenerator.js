export const idGenerator = (tabla) => {
    const fecha = new Date().toLocaleString().slice(0, 9).replace(/\//g, "")
    return `${tabla.slice(0, 2)}-${fecha}-${Math.floor(Math.random() * 1000)}`
  }
  
  