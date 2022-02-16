const contentLib = __non_webpack_require__("/lib/xp/content");

import { Event } from "../../../site/content-types/event/event";
import { Valid } from "../../../types/validation";
import { getComingTimeFilter } from "./filters/coming";
import { getTodayTimeFilter } from "./filters/today";

export { getEvents };

function getEvents(filter?: string): Valid {
  let query = null;
  switch (filter) {
    case "today":
      query = getTodayTimeFilter();
      break;
    default:
      query = getComingTimeFilter();
      break;
  }
  let result: ResultEvent[] = [];
  let events = contentLib.query<Event>({
    query: query,
    start: 0,
    count: -1,
    contentTypes: [app.name + ":festivalEvent"]
  }).hits;
  for (let i = 0; i < events.length; i++) {
    let event = events[i];
    result.push({
      displayName: event.displayName,
      dateTimeStart: event.data.datetime,
      dateTimeEnd: event.data.datetimeEnd,
      location: event.data.location,
      url: event.data.url
    });
  }
  return { error: false, data: result };
}

interface ResultEvent {
  displayName: string;
  dateTimeStart?: string;
  dateTimeEnd?: string;
  location?: string;
  url?: string;
}
