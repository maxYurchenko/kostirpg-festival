import { Content } from "enonic-types/content";

const contentLib = __non_webpack_require__("/lib/xp/content");

export { getUserFilter };

function getUserFilter(userId?: string): string {
  const users = contentLib.query({
    query: "data.discord = '" + userId + "'",
    start: 0,
    count: -1,
    contentTypes: [app.name + ":user"]
  }).hits;

  const ids: string[] = [];
  users.forEach((u: Content) => {
    ids.push(u._id);
  });

  if (ids.length > 0) {
    return (
      "data.players IN ('" +
      ids.join("','") +
      "') OR data.master IN ('" +
      ids.join("','") +
      "')"
    );
  }
  return "";
}
