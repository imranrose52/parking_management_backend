export const getClientTimeZone = () =>
  new Date().toString().match(/([-\+][0-9]+)\s/)[1];

export const getDateTimeFormat = () => "%d-%m-%Y %H:%M";
