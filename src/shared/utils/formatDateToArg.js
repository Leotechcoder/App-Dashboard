// 🔹 Función para formatear una fecha ISO a formato argentino corto (DD/MM/YY)
export const formatDateToArg = (isoDate) => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  };