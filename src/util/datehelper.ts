export function addHours(hours = 0) {
  const returnDate = new Date();
  returnDate.setHours(returnDate.getHours() + hours);
  return returnDate;
}

const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// monthName-Day-Year
export function dateFormatter(date: Date) {
  date = date || new Date();
  const day = date.getDay() < 10 ? `0${date.getDay()}` : date.getDay().toString();
  return `${month[date.getMonth()]}-${day}-${date.getFullYear()}`;
}
