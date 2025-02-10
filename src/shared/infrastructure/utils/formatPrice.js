export const formatPrice = (price) => {
    const scope1 = price.replace("$", "")
    return Number.parseFloat(scope1.replace(/\./g, "").replace(",", "."))
  }
  
  export const formattedSubTotal = (subTotal) =>
    subTotal.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    })
  
  