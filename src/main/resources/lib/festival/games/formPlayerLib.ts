const contentLib = __non_webpack_require__("/lib/xp/content");
const portal = __non_webpack_require__("/lib/xp/portal");
const userLib = __non_webpack_require__("/lib/userLib");
const i18nLib = __non_webpack_require__("/lib/xp/i18n");
const utils = __non_webpack_require__("/lib/util");

exports.getDays = getDays;
exports.beautifyGame = beautifyGame;
exports.checkPlayersCartsBooking = checkPlayersCartsBooking;
exports.updateGameDate = updateGameDate;

function getDays(params) {
  if (!params) params = {};
  let days = [];
  if (params.day) {
    days = getDay(params.day);
  } else {
    days = formSharedLib.getFirstDay();
  }
  let gamesQuery = "";
  if (params.system) {
    gamesQuery +=
      " and data.gameSystem.select.system = '" + params.system + "'";
  }
  if (params.theme) {
    params.theme = utils.data.forceArray(params.theme);
    gamesQuery += " AND data.theme in ('" + params.theme.join("','") + "')";
  }
  days.forEach((day) => {
    day.blocks = getGameBlocksByDay(day._id);
    day.blocks.forEach((block) => {
      block.games = formSharedLib.getItemsList({
        parentId: block._id,
        parentPathLike: true,
        type: "game",
        additionalQuery: gamesQuery
      });
      let games = block.games;
      let result = [];
      block.games = [];
      for (let i = 0; i < games.length; i++) {
        if (!games[i].data.players) games[i].data.players = [];
        games[i].data.players = utils.data.forceArray(games[i].data.players);
        if (
          (params.gameSpace === "free" &&
            games[i].data.players.length <
              parseInt(games[i].data.maxPlayers)) ||
          (params.gameSpace === "full" &&
            games[i].data.players.length >=
              parseInt(games[i].data.maxPlayers)) ||
          !params.gameSpace ||
          params.gameSpace === ""
        ) {
          result.push(beautifyGame(games[i], { getBlock: false }));
        }
      }
      block.games = result;
    });
  });
  return days;
}

function getDay(id, params) {
  if (!params) {
    params = {};
  }
  let festivals = formSharedLib.getFestivals();
  let festivalId = null;
  if (festivals && festivals[0]) {
    festivalId = festivals[0]._id;
  }
  let festivalPage = contentLib.get({ key: festivalId });
  let days = contentLib.query({
    query:
      "_parentPath LIKE '/content" +
      festivalPage._path +
      "*' AND data.blockType = 'day'" +
      " AND _id = '" +
      id +
      "'",
    contentTypes: [app.name + ":gameBlock"],
    sort: "data.datetime ASC"
  }).hits;
  for (let i = 0; i < days.length; i++) {
    days[i] = formSharedLib.beautifyDay(days[i]);
  }
  return days;
}

function getGameBlocksByDay(dayId) {
  let blocks = formSharedLib.getItemsList({
    parentId: dayId,
    type: "gameBlock",
    parentPathLike: true,
    sort: "data.datetime ASC"
  });
  for (let i = 0; i < blocks.length; i++) {
    blocks[i] = beautifyGameBlock(null, blocks[i]);
  }
  return blocks;
}

function validateTicketGameAllowed(ticketId, gameId) {
  let game = contentLib.get({ key: gameId });
  if (!game.data.exclusive) return true;
  if (!ticketId) return false;
  let cart = cartLib.getCartByQr(ticketId);
  if (cart.legendary) return true;
  return false;
}

function checkPlayersCartsBooking() {
  utils.log("fixing booking");
  contextLib.runAsAdmin(function () {
    let games = getListOfGames();
    games.forEach((game) => {
      checkGamePlayers(game);
    });
  });
  utils.log("finished");
}

function getListOfGames() {
  var date = new Date();
  date.setTime(date.getTime() - 60 * 60 * 1000);
  let games = contentLib.query({
    start: 0,
    count: -1,
    contentTypes: [app.name + ":game"]
  });
  return games.hits;
}

function checkGamePlayers(game) {
  if (!game.data.players) return true;
  let players = utils.data.forceArray(game.data.players);
  if (players.length === 0) return true;

  let updateGame = false;
  for (let i = 0; i < players.length; i++) {
    let user = contentLib.get({ key: players[i] });
    if (!(user && user.type === app.name + ":user")) {
      let index = players.indexOf(players[i]);
      if (index > -1) {
        utils.log("found wrong player for game " + game._id);
        players.splice(index, 1);
        updateGame = true;
        i--;
      }
    }
  }
  game.data.players = players;
  if (updateGame) return updateEntity(game);
  return game;
}

function updateGameDate() {
  utils.log("fixing game dates");
  contextLib.runAsAdmin(function () {
    let games = getListOfGames();
    games.forEach((game) => {
      fixGameDate(game);
    });
  });
  utils.log("finished");
}

function fixGameDate(game) {
  //if (game.data.datetime) return true;
  let gameBlock = util.content.getParent({ key: game._id });
  game.data.datetime = gameBlock.data.datetime;
  game.data.datetimeEnd = gameBlock.data.datetimeEnd;
  updateEntity(game);
}

function beautifyGameBlock(locationId, block) {
  block = getBlockCache(block);
  if (locationId) {
    block.space = getLocationSpace(locationId, block._id);
  }
  return block;
}

function getBlockCache(block) {
  block.duration = {};
  if (block.data.datetimeEnd && block.data.datetime) {
    var duration =
      new Date(block.data.datetimeEnd) - new Date(block.data.datetime);
    var hours = Math.floor(duration / 60 / 60 / 1000);
    block.duration = {
      hours: hours.toFixed(),
      minutes: (Math.floor(duration / 60 / 1000) - hours * 60).toFixed()
    };
  }
  var blockDate = new Date(block.data.datetime);
  block.date = blockDate.getDate().toFixed();
  block.dayName = norseUtils.getDayName(blockDate);
  block.monthName = norseUtils.getMonthName(blockDate);
  block.time = {
    start: norseUtils.getTime(new Date(block.data.datetime)),
    end: block.data.datetimeEnd
      ? norseUtils.getTime(new Date(block.data.datetimeEnd))
      : null
  };
  block.epic = !!(block.data.description && block.data.title);
  return block;
}
