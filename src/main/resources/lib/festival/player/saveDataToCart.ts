import * as contextLib from "../helpers/contextLib";

import { updateEntity } from "../shared/updateEntity";

export { saveDataToCart };

function saveDataToCart(params) {
  if (params.players.indexOf(params.cartId) === -1) {
    params.players.push(params.cartId);
    params.game.data.players = params.players;
    params.game = updateEntity(params.game);
  }
  let cart = cartLib.getCart(params.cartId);
  contextLib.runAsAdmin(function () {
    let cartRepo = sharedLib.connectRepo("cart");
    cartRepo.modify({
      key: params.cartId,
      editor: editor
    });
    function editor(node) {
      node.firstName = params.firstName;
      node.kosticonnect2021 = params.kosticonnect2021;
      node.gameId = params.game._id;
      return node;
    }
  });
  return params.game;
}
