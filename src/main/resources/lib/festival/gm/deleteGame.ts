const contentLib = __non_webpack_require__("/lib/xp/content");
const i18nLib = __non_webpack_require__("/lib/xp/i18n");

import { checkIfGameRegisterOpen } from "../shared/checkRegister";
import { Valid } from "../../../types/validation";

function deleteGame(id: string): Valid {
  if (!checkIfGameRegisterOpen()) {
    return {
      error: true,
      message: i18nLib.localize({
        key: "myGames.form.message.registrationClosed",
        locale: "ru"
      })
    };
  }
  contentLib.unpublish({
    keys: [id]
  });
  return {
    error: false,
    message: i18nLib.localize({
      key: "myGames.form.message.deleted",
      locale: "ru"
    })
  };
}

export { deleteGame };
