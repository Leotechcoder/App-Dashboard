// 🔹 Función para formatear una fecha ISO a formato argentino corto (DD/MM/YY)
export const formatDateToArg = (isoDate) => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  };
// 🔹 Retorna los minutos transcurridos desde una fecha hasta ahora
export function getMinutesAgo(date) {
  if (!date) return 0;
  const diffMs = Date.now() - new Date(date).getTime();
  return Math.floor(diffMs / 60000);
}

// 🔹 Retorna el color del semáforo según la antigüedad de la orden (en minutos)
//    Pensado para usarse con CSS vars del tema
export function getAgeColor(minutes) {
  if (minutes < 10) return "green";   // var(--green)
  if (minutes < 20) return "yellow";  // var(--yellow)
  return "destructive";               // var(--destructive)
}

// 🔹 Etiqueta legible: "5 min", "1 h 10 min"
export function formatMinutesAgo(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} h ${m} min` : `${h} h`;
}
