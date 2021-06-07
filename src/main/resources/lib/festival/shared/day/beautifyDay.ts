import { getLocations } from "../location/getLocations";

export { beautifyDay };

function beautifyDay(day, expanded) {
  if (expanded === day._id) {
    day.expanded = true;
  }
  let user = userLib.getCurrentUser();
  day.games = getDaysByUser(
    day._id,
    user && user.roles && user.roles.moderator
  );
  var dayDate = new Date(day.data.datetime);
  day.date = dayDate.getDate().toFixed();
  day.dayName = norseUtils.getDayName(dayDate);
  day.monthName = norseUtils.getMonthName(dayDate);
  day.locations = getLocations(day._id);
  day.space = getDaySpace(day._id);
  let festival = getFestivalByDay(day._id);
  day.available = thymeleaf.render(resolve(views["availableComp"]), {
    games: day.games,
    festival: festival
  });
  return day;
}
