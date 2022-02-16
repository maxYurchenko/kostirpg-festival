export { getComingTimeFilter };

function getComingTimeFilter(): string {
  const prepareDate = new Date();
  prepareDate.setTime(prepareDate.getTime() + 20 * 60 * 1000);

  const endDate = new Date();
  endDate.setTime(endDate.getTime() + 2.5 * 60 * 60 * 1000);

  const now = new Date();
  now.setTime(now.getTime() + 20 * 60 * 1000);

  const gameFilter = new Date();
  gameFilter.setTime(gameFilter.getTime() - 20 * 60 * 1000);

  // game time < preparation time time && game end time > curr time
  // OR
  // game time > gaming time && game end time < end time

  return (
    "(data.datetime < dateTime('" +
    prepareDate.toISOString() +
    "') and data.datetimeEnd > dateTime('" +
    now.toISOString() +
    "'))" +
    " OR (data.datetime > dateTime('" +
    gameFilter.toISOString() +
    "') and data.datetime < dateTime('" +
    endDate.toISOString() +
    "') and type='" +
    app.name +
    ":game')"
  );
}
