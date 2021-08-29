import { Content } from "enonic-types/content";
import { Game } from "../../../site/content-types/game/game";
import * as contextLib from "../helpers/contextLib";

import { updateEntity } from "../shared/updateEntity";
const cartLib = require("/lib/cartLib");
const nodeLib = __non_webpack_require__("/lib/xp/node");

export { saveDataToCart };

function saveDataToCart(params: SaveDataToCartRequest) {
  if (params.players.indexOf(params.cartId) === -1) {
    params.players.push(params.cartId);
    params.game.data.players = params.players;
    params.game.data.spaceAvailable =
      params.players.length < parseInt(params.game.data.maxPlayers);
    params.game = updateEntity(params.game);
  }
  cartLib.getCart(params.cartId);
  contextLib.runAsAdmin(function () {
    let cartRepo = nodeLib.connect({
      repoId: "cart",
      branch: "master"
    });
    cartRepo.modify({
      key: params.cartId,
      editor: editor
    });
    function editor(node: any) {
      node.firstName = params.firstName;
      node.kosticonnect2021 = params.kosticonnect2021;
      node.gameId = params.game._id;
      return node;
    }
  });
  return params.game;
}

interface SaveDataToCartRequest {
  cartId: string;
  game: Content<Game>;
  players: string[];
  firstName: string;
  kosticonnect2021: number;
}
