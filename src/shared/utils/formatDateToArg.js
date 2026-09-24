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
  if (minutes < 30) return "green";   // var(--green)
  if (minutes < 40) return "yellow";  // var(--yellow)
  return "destructive";               // var(--destructive)
}

// 🔹 Etiqueta legible: "5 min", "1 h 10 min"
export function formatMinutesAgo(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} h ${m} min` : `${h} h`;
}

//Otro formato de fecha para mostrar en la tabla de ordenes cerradas
export const formatLocal = (d) => {
      const local = new Date(d);
      // Ajusta manualmente el desfase horario
      const offsetMs = local.getTimezoneOffset() * 60 * 1000;
      const localISOTime = new Date(local.getTime() - offsetMs)
        .toISOString()
        .slice(0, 19); // "YYYY-MM-DDTHH:mm:ss"
      return `${localISOTime}-03:00`; // agrega el offset argentino
    };