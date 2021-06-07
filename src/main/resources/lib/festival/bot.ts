const contentLib = __non_webpack_require__("/lib/xp/content");
const utils = __non_webpack_require__("/lib/util");

import { Content } from "enonic-types/content";

const formPlayerLib = require("formPlayerLib");
const festivalSharedLib = require("festivalSharedLib");
const contextLib = require("../contextLib");
const cartLib = require("../cartLib");

exports.checkUser = checkUser;
exports.getGames = getGames;
exports.getEvents = getEvents;

function checkUser(params) {
  if (!params || !params.ticketId || !params.discordId)
    return { success: false };
  let cart = cartLib.getCartByQr(params.ticketId);
  if (!cart) return { success: false, message: "Билет не найден." };
  let user = getUserByTicket(params.ticketId);
  if (user) {
    if (!user.data.discord) {
      user.data.discord = params.discordId;
      contextLib.runAsAdmin(function () {
        formPlayerLib.updateEntity(user);
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

function getUserByTicket(ticketId: string) {
  if (!ticketId) return null;
  let users = contentLib.query({
    query: "data.kosticonnect2021 = " + ticketId,
    start: 0,
    count: 1,
    contentTypes: [app.name + ":user"]
  });
  if (users.hits[0]) return users.hits[0];
  return null;
}

function getGames(filter?: string, userId?: string) {
  let query = null;
  switch (filter) {
    case "today":
      query = getTodayTimeFilter();
      break;
    case "user":
      query = getUserFilter(userId);
      break;
    default:
      query = getComingTimeFilter();
      break;
  }
  if (!query) return { success: false };
  let result = [];
  let comingGames = contentLib.query({
    query: query,
    start: 0,
    count: -1,
    contentTypes: [app.name + ":game"],
    sort: "_parentPath ASC"
  }).hits;
  let tables = 0;
  let j = 0;
  for (let i = 0; i < comingGames.length; i++) {
    let game = comingGames[i];
    let currTables = festivalSharedLib.getTablesStartNum(game._id);
    if (tables !== currTables) {
      tables = currTables;
      j = 0;
    }
    let players: Player[] = [];
    game.data.players ? game.data.players : [];
    game.data.players = utils.data.forceArray(game.data.players);
    game.data.players.forEach((player) => {
      if (!player) return;
      player = contentLib.get({ key: player });
      if (player && player.data.discord)
        players.push({
          discord: player.data.discord,
          displayName: player.displayName
        });
      else if (player) players.push({ displayName: player.displayName });
    });
    let master = contentLib.get({ key: game.data.master });
    result.push({
      displayName: game.displayName,
      table: currTables + j,
      dateTimeStart: game.data.datetime,
      dateTimeEnd: game.data.datetimeEnd,
      master: master
        ? {
            discord: master.data.discord,
            displayName: master.displayName
          }
        : null,
      players: players
    });
    j++;
  }
  return { success: true, games: result };
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
    let event = events[i];
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

function getComingTimeFilter() {
  let prepareDate = new Date();
  prepareDate.setTime(prepareDate.getTime() + 20 * 60 * 1000);
  let endDate = new Date();
  endDate.setTime(endDate.getTime() + 2.5 * 60 * 60 * 1000);
  let now = new Date();
  now.setTime(now.getTime() + 20 * 60 * 1000);
  let gameFilter = new Date();
  gameFilter.setTime(gameFilter.getTime() - 20 * 60 * 1000);
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

function getTodayTimeFilter() {
  let todayStart = new Date();
  let todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  return (
    "data.datetime < dateTime('" +
    todayEnd.toISOString() +
    "') and data.datetime > dateTime('" +
    todayStart.toISOString() +
    "')"
  );
}

function getUserFilter(userId?: string) {
  let users = contentLib.query({
    query: "data.discord = '" + userId + "'",
    start: 0,
    count: -1,
    contentTypes: [app.name + ":user"]
  }).hits;
  let ids: string[] = [];
  users.forEach((u: Content) => {
    ids.push(u._id);
  });
  if (ids.length > 0) {
    return (
      "data.players IN ('" +
      ids.join("','") +
      "') OR data.master IN ('" +
      ids.join("','") +
      "')"
    );
  }
  return false;
}

interface Player {
  discord?: string;
  displayName: string;
}
