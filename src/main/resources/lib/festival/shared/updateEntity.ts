import { Content } from "enonic-types/content";
import { UserAllData } from "../../../types/kostiUser";
import * as contextLib from "../helpers/contextLib";
const contentLib = __non_webpack_require__("/lib/xp/content");
const userLib = __non_webpack_require__("/lib/userLib");

export { updateEntity };

function updateEntity(
  entity: Content,
  useUserForModify: boolean = true
): Content<any> {
  if (useUserForModify) {
    log.info("test");
    let user: UserAllData = userLib.getCurrentUser();
    if (user)
      return contextLib.runAsAdminAsUser(user.user, function () {
        entity = contentLib.modify({
          key: entity._id,
          editor: function (c) {
            c.data = entity.data;
            return c;
          }
        });
        contentLib.publish({
          keys: [entity._id],
          sourceBranch: "master",
          targetBranch: "draft"
        });
        return entity;
      });
  }

  return contextLib.runAsAdmin(function () {
    entity = contentLib.modify({
      key: entity._id,
      editor: function (c) {
        c.data = entity.data;
        return c;
      }
    });
    contentLib.publish({
      keys: [entity._id],
      sourceBranch: "master",
      targetBranch: "draft"
    });
    return entity;
  });
}
