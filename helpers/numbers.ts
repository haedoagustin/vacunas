export const toCurrency = (precio: number) =>
  precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
