/**
 * Formatea un número en formato monetario local (coma decimal, punto de miles)
 * @param {number} value - El número a formatear
 * @param {string} locale - Idioma (por defecto "es-AR")
 * @param {number} decimals - Cantidad de decimales (por defecto 2)
 * @returns {string} Número formateado, ej: "1.234,56"
 */
export function formatCurrency(value, decimals = 2, locale = "es-AR") {
  if (isNaN(value) || value === null) return "0,00";

  return Number(value).toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
