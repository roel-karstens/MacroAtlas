const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatPeriod(period: string) {
  const [year, month] = period.split("-");
  const name = MONTHS[Number(month) - 1] ?? month;
  return `${name} ${year}`;
}
