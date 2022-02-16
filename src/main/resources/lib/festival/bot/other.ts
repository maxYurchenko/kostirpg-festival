import { Content } from "enonic-types/content";
import { Game } from "../../../site/content-types/game/game";

const cartLib = require("/lib/cartLib");
const utils = __non_webpack_require__("/lib/util");
const contentLib = __non_webpack_require__("/lib/xp/content");
import * as contextLib from "./../helpers/contextLib";

import { getTablesStartNum } from "./../shared/game/getGameTable";
import { updateEntity } from "./../shared/updateEntity";
import { getComingTimeFilter } from "./filters/coming";
import { getTodayTimeFilter } from "./filters/today";

export { checkUser, getEvents };

function checkUser(params: any) {
  if (!params || !params.ticketId || !params.discordId)
    return { success: false };
  let cart = cartLib.getCartByQr(params.ticketId);
  if (!cart) return { success: false, message: "Билет не найден." };
  let user = getUserByTicket(params.ticketId);
  if (user) {
    if (!user.data.discord) {
      user.data.discord = params.discordId;
      contextLib.runAsAdmin(function () {
        updateEntity(user);
      });
    }
    return { success: true, turbo: cart.legendary };
  }
  if (!cart.qrActivated) {
    contextLib.runAsAdmin(function () {
      cartLib.markTicketUsed(params.ticketId);
    });
    return { success: true, turbo: cart.legendary };
  }
  return { success: false, message: "Билет не найден." };
}

function getUserByTicket(ticketId: string): any {
  if (!ticketId) return null;
  let users = contentLib.query({
    query: "data.kosticonnect2022 = " + ticketId,
    start: 0,
    count: 1,
    contentTypes: [app.name + ":user"]
  });
  if (users.hits[0]) return users.hits[0];
  return null;
}

function getEvents(filter?: string) {
  let query = null;
  switch (filter) {
    case "today":
      query = getTodayTimeFilter();
      break;
    default:
      query = getComingTimeFilter();
      break;
  }
  let result = [];
  let events = contentLib.query({
    query: query,
    start: 0,
    count: -1,
    contentTypes: [app.name + ":festivalEvent"]
  }).hits;
  for (let i = 0; i < events.length; i++) {
    let event: any = events[i];
    result.push({
      displayName: event.displayName,
      dateTimeStart: event.data.datetime,
      dateTimeEnd: event.data.datetimeEnd,
      location: event.data.location,
      url: event.data.url
    });
  }
  return { success: true, games: result };
}
