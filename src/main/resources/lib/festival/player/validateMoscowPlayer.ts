const userLib = __non_webpack_require__("/lib/userLib");

import { UserAllData } from "../../../types/kostiUser";
import { Valid } from "../../../types/validation";

export { validateMoscowPlayer };

function validateMoscowPlayer(): Valid {
  let user: UserAllData = userLib.getCurrentUser();
  if (!user) return { error: true, message: "Вам нужно войти." };
  if (!(user.content.data.kmgPlayer || user.data?.roles.moscowGM))
    return { error: true, message: "У вас нет билета на этот фестиваль." };
  return {
    error: false
  };
}
