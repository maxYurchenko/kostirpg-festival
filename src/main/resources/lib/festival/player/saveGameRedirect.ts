import { Valid } from "../../../types/validation";
import * as contextLib from "../helpers/contextLib";

const utils = __non_webpack_require__("/lib/util");
const nodeLib = __non_webpack_require__("/lib/xp/node");

export { saveGameRedirect };

function saveGameRedirect(gameId: string, cartId: string): Valid {
  contextLib.runAsAdmin(function () {
    const cartRepo = nodeLib.connect({
      repoId: "cart",
      branch: "master"
    });
    cartRepo.modify({
      key: cartId,
      editor: editor
    });
    function editor(node: any) {
      node.gameId = gameId;
      return node;
    }
  });
  return { error: false };
}
