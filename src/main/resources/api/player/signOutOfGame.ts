import { Request, Response } from "enonic-types/controller";

import { signOutOfGame } from "../../lib/festival/player/signOutOfGame";

exports.post = function (req: Request): Response {
  if (!req.params?.data) {
    return {
      body: { error: true },
      contentType: "application/json"
    };
  }
  let data: SignOutGameRequest = JSON.parse(req.params.data);
  return {
    body: signOutOfGame(data.gameId),
    contentType: "application/json"
  };
};

interface SignOutGameRequest {
  gameId: string;
}
