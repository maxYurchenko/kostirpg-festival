export { getTodayTimeFilter };

function getTodayTimeFilter(): string {
  const todayStart = new Date();

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  return (
    "data.datetime < dateTime('" +
    todayEnd.toISOString() +
    "') and data.datetime > dateTime('" +
    todayStart.toISOString() +
    "')"
  );
}
