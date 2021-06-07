import { PermissionsParams } from "enonic-types/content";

export { full };

function full(user: string): Array<PermissionsParams> {
  return [
    {
      principal: user,
      allow: [
        "READ",
        "CREATE",
        "MODIFY",
        "PUBLISH",
        "READ_PERMISSIONS",
        "WRITE_PERMISSIONS",
        "DELETE"
      ],
      deny: []
    },
    {
      principal: "role:system.everyone",
      allow: ["READ"],
      deny: []
    }
  ];
}
