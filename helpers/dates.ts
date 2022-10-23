const today = new Date();
const ultimo_dia_del_mes = new Date(
  today.getFullYear(),
  today.getMonth() + 1,
  0
);

const getNewDate = ([year, month, day]: Array<string>) =>
  new Date(+year, +month - 1, +day);
/**
 *
 * @param {*} date En formato "YYYY/MM/DD"
 * @returns Un objecto de tipo Date
 */
export const formatDate = (date) =>
  date ? getNewDate(date.split("/")) : ultimo_dia_del_mes;

const getNewDateTime = ([
  day,
  month,
  year,
  hours,
  minutes,
  seconds,
]: Array<string>) =>
  new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);

const splitInDateAndTime = ([date, time]: Array<string>): Array<string> => [
  ...date.split("/"),
  ...time.split(":"),
];
const splitDateTime = (dateTime: string) =>
  splitInDateAndTime(dateTime.split(" "));

/**
 *
 * @param {*} dateTime En formato "DD/MM/YYYY HH:mm:ss"
 * @returns
 */
export const formatDateTime = (dateTime: string) =>
  dateTime ? getNewDateTime(splitDateTime(dateTime)) : ultimo_dia_del_mes;

export const getEdad = (fecha_nacimiento: string) => {
  var hoy = new Date();
  // Formatear "26/05/1954 06:18:32" => "1954-05-26T06:18:32Z"
  var cumpleanos = formatDateTime(fecha_nacimiento);
  var edad = hoy.getFullYear() - cumpleanos.getFullYear();
  var m = hoy.getMonth() - cumpleanos.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
    edad--;
  }

  return edad;
};
