export const idGenerator = (tabla) => {
  const now = new Date();
  const fecha = `${now.getMonth() + 1}${now.getDate()}${now.getFullYear()}`;
  return `${tabla.slice(0, 2)}-${fecha}-${Math.floor(Math.random() * 1000)}`;
};