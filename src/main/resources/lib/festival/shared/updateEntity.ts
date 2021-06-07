import { Content } from "enonic-types/content";
import * as contextLib from "../helpers/contextLib";
const contentLib = __non_webpack_require__("/lib/xp/content");

export { updateEntity };

function updateEntity(entity: Content) {
  return contextLib.runAsAdminAsUser(userLib.getCurrentUser(), function () {
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
