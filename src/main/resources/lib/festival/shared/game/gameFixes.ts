const contentLib = __non_webpack_require__("/lib/xp/content");
const utils = __non_webpack_require__("/lib/util");
import { Content } from "enonic-types/content";
import { Game } from "../../../../site/content-types/game/game";
import * as contextLib from "../../helpers/contextLib";
import { getListOfGames } from "../../player/getListOfGames";
import { updateEntity } from "../../shared/updateEntity";

export { checkPlayersCartsBooking, checkGamePlayers, updateGameDate };

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

function checkGamePlayers(game: Content<Game>) {
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
  game.data.spaceAvailable = players.length < parseInt(game.data.maxPlayers);
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

function fixGameDate(game: Content<Game>) {
  let gameBlock = utils.content.getParent({ key: game._id });
  game.data.datetime = gameBlock.data.datetime;
  game.data.datetimeEnd = gameBlock.data.datetimeEnd;
  updateEntity(game);
}
