export class Table {
  constructor({ id, number, shape, capacity, createdAt, updatedAt }) {
    this.id = id;
    this.number = Number(number);
    this.shape = shape === "square" ? "square" : "round";
    this.capacity = Number(capacity);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export const TABLE_SHAPES = ["round", "square"];

export function validateTable(values) {
  const errors = {};
  if (!Number.isInteger(Number(values.number)) || Number(values.number) < 1)
    errors.number = "El número debe ser un entero positivo.";
  if (!TABLE_SHAPES.includes(values.shape))
    errors.shape = "Selecciona una forma válida.";
  if (!Number.isInteger(Number(values.capacity)) || Number(values.capacity) < 1)
    errors.capacity = "La capacidad debe ser un entero positivo.";
  return errors;
}
