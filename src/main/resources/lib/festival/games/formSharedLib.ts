const contentLib = __non_webpack_require__("/lib/xp/content");
const portal = __non_webpack_require__("/lib/xp/portal");
const userLib = __non_webpack_require__("/lib/userLib");
const i18nLib = __non_webpack_require__("/lib/xp/i18n");
const utils = __non_webpack_require__("/lib/util");

const cache = cacheLib.api.createGlobalCache({
  name: "users",
  size: 1000,
  expire: 60 * 60 * 24
});

var baseUrl = "/site/pages/user/games/";

var views = {
  gmComp: baseUrl + "gm/gmComp.html",
  scheduleComp: baseUrl + "shared/scheduleComp.html",
  locationAndGameBlockComp: baseUrl + "gm/locationBlocksWrapper.html",
  availableComp: baseUrl + "shared/availableComp.html",
  addGameForm: baseUrl + "gm/addGameForm.html",
  locationComp: baseUrl + "shared/locationComp.html",
  gameBlocksComp: baseUrl + "gm/gameBlocksComp.html"
};

exports.getView = getView;
exports.getItemsList = getItemsList;
exports.getDays = getDays;
exports.getLocations = getLocations;
exports.getFestivalByDay = getFestivalByDay;
exports.getFestivalByDays = getFestivalByDays;
exports.getActiveFestival = getActiveFestival;
exports.beautifyGameBlock = beautifyGameBlock;
exports.getGameMisc = getGameMisc;
exports.getFestivals = getFestivals;
exports.beautifyDay = beautifyDay;
exports.getFirstDay = getFirstDay;

function getView(viewType, id, params) {
  var model = {};
  switch (viewType) {
    case "locationAndGameBlockComp":
      model = getLocationsGameBlocksModel(id);
      break;
    case "gameBlocksComp": {
      let day = utils.content.getParent({ key: id });
      model.blocks = getGameBlocks(id);
      model.festival = getFestivalByDay(day._id);
      break;
    }
    case "scheduleComp":
      model.days = getDays(params);
      model.festival = getFestivalByDays(model.days);
      break;
    case "addGameForm":
      model = getFormComponent(id);
      break;
    case "gmComp":
      model.days = getView("scheduleComp", null, params);
      break;
    default:
      break;
  }
  return thymeleaf.render(resolve(views[viewType]), model);
}

function getFormComponent(id) {
  var content = contentLib.get({ key: id });
  let user = userLib.getCurrentUser();
  let discord = {};
  if (user && user.data && user.data.discord) {
    discord = cache.api.getOnly(user._id + "-discord");
    if (!discord) {
      discord = userLib.getDiscordData(user._id);
      if (discord) cache.api.put(user._id + "-discord", discord);
    }
  }
  if (content.type === app.name + ":game") {
    var game = beautifyGame(content);
    var location = contentLib.get({ key: game.data.location });
    var block = beautifyGameBlock(
      location._id,
      utils.content.getParent({ key: game._id })
    );
    var action = "editGame";
  } else {
    var action = "addGame";
    var game = null;
    var location = utils.content.getParent({ key: id });
    var block = beautifyGameBlock(location._id, contentLib.get({ key: id }));
  }
  let day = beautifyDay(utils.content.getParent({ key: location._id }));
  return {
    action: action,
    game: game,
    block: block,
    discord: discord,
    location: location,
    user: user,
    virtualTables: getSelectOptions("virtualTable"),
    gameSystems: getSelectOptions("gameSystem"),
    themes: getSelectOptions("theme"),
    festival: getFestivalByDay(day._id),
    day: day
  };
}

function getLocationsGameBlocksModel(id) {
  let locations = getLocations(id);
  let festival = getFestivalByDay(id);
  locations[0].active = true;
  return {
    locations: thymeleaf.render(resolve(views["locationComp"]), {
      locations: locations,
      festival: festival
    }),
    gameBlocks: thymeleaf.render(resolve(views["gameBlocksComp"]), {
      blocks: getGameBlocks(locations[0]._id),
      festival: festival
    }),
    festival: festival
  };
}

function getFirstDay() {
  var festivals = getFestivals();
  if (festivals && festivals[0]) {
    var id = festivals[0]._id;
  }
  var festivalPage = contentLib.get({ key: id });
  var days = contentLib.query({
    query:
      "_parentPath LIKE '/content" +
      festivalPage._path +
      "*' AND data.blockType = 'day'",
    contentTypes: [app.name + ":gameBlock"],
    sort: "data.datetime ASC",
    count: 1
  }).hits;
  for (var i = 0; i < days.length; i++) {
    days[i] = beautifyDay(days[i]);
  }
  return days;
}

function getDays(params) {
  if (!params) {
    var params = {};
  }
  var festivals = getFestivals();
  if (festivals && festivals[0]) {
    var id = festivals[0]._id;
  }
  var festivalPage = contentLib.get({ key: id });
  var days = contentLib.query({
    query:
      "_parentPath LIKE '/content" +
      festivalPage._path +
      "*' AND data.blockType = 'day'",
    contentTypes: [app.name + ":gameBlock"],
    sort: "data.datetime ASC"
  }).hits;
  if (!params.skipBeautify) {
    for (var i = 0; i < days.length; i++) {
      days[i] = beautifyDay(days[i], params.expanded);
    }
  }
  return days;
}

function getDaysByUser(parent, admin) {
  var user = userLib.getCurrentUser();
  let games = null;
  if (admin) {
    games = getItemsList({
      parentId: parent,
      parentPathLike: true,
      type: "game",
      sort: "_parentPath ASC"
    });
  } else {
    games = getItemsList({
      master: user._id,
      parentId: parent,
      parentPathLike: true,
      type: "game"
    });
  }
  for (var i = 0; i < games.length; i++) {
    games[i] = beautifyGame(games[i]);
  }
  return games;
}

function beautifyGame(game) {
  var gameBlock = utils.content.getParent({ key: game._id });
  var location = utils.content.getParent({ key: gameBlock._id });
  game.block = beautifyGameBlock(location._id, gameBlock);
  game.location = location.displayName;
  game.seatsReserved = game.data.players
    ? utils.data.forceArray(game.data.players).length
    : 0;
  if (game.data.gameSystem[game.data.gameSystem._selected]) {
    game.system = {
      text: game.data.gameSystem[game.data.gameSystem._selected].system,
      localizable: game.data.gameSystem._selected === "select"
    };
  } else {
    game.system = {
      text: "",
      localizable: false
    };
  }
  game.additionalInfo = getGameMisc(game);
  game.players = [];
  if (!game.data.players) game.data.players = [];
  game.data.players = utils.data.forceArray(game.data.players);
  game.data.players.forEach((player) => {
    let playerObj = contentLib.get({ key: player });
    if (playerObj) {
      let discord = null;
      if (playerObj && playerObj.data && playerObj.data.discord) {
        discord = cache.api.getOnly(playerObj._id + "-discord");
        if (!discord) {
          discord = userLib.getDiscordData(playerObj._id);
          if (discord) cache.api.put(playerObj._id + "-discord", discord);
        }
      }
      game.players.push(
        playerObj.displayName +
          " " +
          (discord ? discord.username + ":" + discord.discriminator : "")
      );
    }
  });
  game.table = getGameTable(game);
  game.players = game.players.join(", ");
  if (game.data.image) game.image = norseUtils.getImage(game.data.image);
  return game;
}

function getDaySpace(dayId) {
  var dayLocations = getLocations(dayId);
  var space = {
    total: 0,
    reserved: 0
  };
  for (var i = 0; i < dayLocations.length; i++) {
    var blocks = getGameBlocks(dayLocations[i]._id);
    for (var j = 0; j < blocks.length; j++) {
      space = {
        total: space.total + parseInt(blocks[j].space.total),
        reserved: space.reserved + parseInt(blocks[j].space.reserved)
      };
    }
  }
  space = {
    total: parseInt(space.total).toFixed(),
    reserved: parseInt(space.reserved).toFixed()
  };
  return space;
}

function getFestivalByDay(id) {
  let gamesFolder = utils.content.getParent({ key: id });
  if (gamesFolder) {
    let festival = utils.content.getParent({ key: gamesFolder._id });
    if (festival && festival.data) {
      festival.online = festival.data && festival.data.onlineFestival;
      return festival;
    }
  }
  return null;
}

function getFestivalByDays(arr) {
  arr = utils.data.forceArray(arr);
  if (arr[0] && arr[0]._id) {
    return getFestivalByDay(arr[0]._id);
  } else if (arr[0] && typeof arr[0] === "string") {
    return getFestivalByDay(arr[0]);
  }
}

function getSelectOptions(inputName) {
  let type = contentLib.getType(app.name + ":game");
  let result = [];
  type.form.forEach((f) => {
    if (f.name === inputName) {
      if (f.formItemType === "Input") {
        f.config.option.forEach((o) => {
          result.push({ name: o["@value"], class: o["@class"] });
        });
      } else {
        f.options.forEach((o) => {
          if (o.name === "select") {
            o.items[0].config.option.forEach((i) => {
              result.push({ name: i["@value"], class: i["@class"] });
            });
          }
        });
      }
    }
  });
  return result;
}

function getGameTable(game) {
  if (!game) return false;
  let table = cache.api.getOnly(game._id + "-table");
  if (!table || table === 0) {
    table = countGameTable(game);
    if (table) cache.api.put(game._id + "-table", table);
  }
  return table;
}

function countGameTable(game) {
  let result = 0;
  let block = utils.content.getParent({ key: game._id });
  let tables = festivalSharedLib.getTablesStartNum(game._id);
  let allGamesBlock = cache.api.getOnly(block._id + "-games");
  if (!allGamesBlock || allGamesBlock.length === 0) {
    allGamesBlock = getItemsList({
      parentId: block._id,
      parentPathLike: true,
      type: "game"
    });
    if (allGamesBlock) cache.api.put(block._id + "-games", allGamesBlock);
  }
  for (let i = 0; i < allGamesBlock.length; i++) {
    if (game._id === allGamesBlock[i]._id) {
      result = tables + i;
    }
  }
  return result.toFixed();
}
