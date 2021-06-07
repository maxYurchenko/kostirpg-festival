const contentLib = __non_webpack_require__("/lib/xp/content");
const common = __non_webpack_require__("/lib/xp/common");

import { checkIfGameExists } from "./checkGameExists";
import { checkIfMasterBookedThisBlock } from "./checkMasterAvailable";
import { checkIfGameRegisterOpen } from "../shared/checkRegister";
import { full } from "./../misc/permissions";
import { getLocationSpace } from "../shared/locationSpace";
import * as contextLib from "../helpers/contextLib";
import { Game } from "../../../site/content-types/game/game";
import { Block } from "../../../site/content-types/block/block";

export { addGame };

function addGame(displayName: string, data: Game): Valid {
  if (
    getLocationSpace(data.location, data.block).available < 1 ||
    checkIfGameExists(displayName, data)
  ) {
    return {
      error: true,
      message: i18nLib.localize({
        key: "myGames.form.message.noSpace"
      })
    };
  }
  if (checkIfMasterBookedThisBlock(data.block, data.location)) {
    return {
      error: true,
      message: i18nLib.localize({
        key: "myGames.form.message.alreadyBooked"
      })
    };
  }
  if (!checkIfGameRegisterOpen()) {
    return {
      error: true,
      message: i18nLib.localize({
        key: "myGames.form.message.registrationClosed"
      })
    };
  }
  return contextLib.runAsAdminAsUser(
    userLib.getCurrentUser().user,
    function () {
      var block = contentLib.get<Block>({ key: data.block });
      if (!block) return null;
      let epiBlock = !!(block.data.description && block.data.title);
      var user = userLib.getCurrentUser();
      if (!user.data.firstName) {
        userLib.editUser({ firstName: data.masterName, id: user._id });
      }
      data.master = user._id;
      data.datetime = block.data.datetime;
      let game = contentLib.create({
        name: common.sanitize(
          displayName + (epiBlock ? "-" + data.masterName : "")
        ),
        parentPath: block._path,
        displayName: displayName,
        contentType: app.name + ":game",
        data: data
      });
      if (!game) {
        return {
          error: true,
          message: i18nLib.localize({
            key: "myGames.form.message.unableToCreate"
          })
        };
      }
      contentLib.setPermissions({
        key: game._id,
        inheritPermissions: false,
        overwriteChildPermissions: true,
        permissions: full(user.key)
      });
      var result = contentLib.publish({
        keys: [game._id],
        sourceBranch: "master",
        targetBranch: "draft"
      });
      if (!result) {
        return {
          error: true,
          message: i18nLib.localize({
            key: "myGames.form.message.unableToPublish"
          })
        };
      }
      return {
        error: false,
        data: game
      };
    }
  );
}
