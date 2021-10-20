const contentLib = __non_webpack_require__("/lib/xp/content");
const common = __non_webpack_require__("/lib/xp/common");
const userLib = __non_webpack_require__("/lib/userLib");
const i18nLib = __non_webpack_require__("/lib/xp/i18n");

import { checkIfGameExists } from "./checkGameExists";
import { checkIfMasterBookedThisBlock } from "./checkMasterAvailable";
import { checkIfGameRegisterOpen } from "../shared/checkRegister";
import { full } from "./../misc/permissions";
import { getLocationSpace } from "../shared/location/locationSpace";
import * as contextLib from "../helpers/contextLib";
import { Game } from "../../../site/content-types/game/game";
import { Block } from "../../../site/content-types/block/block";
import { UserAllData } from "../../../types/kostiUser";
import { Valid } from "../../../types/validation";

export { addGame };

function addGame(displayName: string, data: Game): Valid {
  if (getLocationSpace(data.location, data.block).available < 1) {
    return {
      error: true,
      message: i18nLib.localize({
        key: "myGames.form.message.noSpace"
      })
    };
  }
  if (checkIfGameExists(displayName, data)) {
    return {
      error: true,
      message: i18nLib.localize({
        key: "myGames.form.message.gameExists"
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
  let user: UserAllData = userLib.getCurrentUser();
  return contextLib.runAsAdminAsUser(user.user, function () {
    var block = contentLib.get<Block>({ key: data.block });
    if (!block) return null;
    let epicBlock = !!(block.data.description && block.data.title);
    if (!user.content.data.firstName) {
      userLib.editUser({ firstName: data.masterName, id: user.content._id });
    }
    data.master = user.content._id;
    data.datetime = block.data.datetime;
    data.datetimeEnd = block.data.datetimeEnd;
    data.spaceAvailable = true;
    let game = contentLib.create({
      name: common.sanitize(
        displayName + (epicBlock ? "-" + data.masterName : "")
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
      permissions: full(user.user.key)
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
      data: game,
      message: i18nLib.localize({
        key: "myGames.form.message.created"
      })
    };
  });
}
