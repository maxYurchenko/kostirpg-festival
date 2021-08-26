import { Request, Response } from "enonic-types/controller";

import { signForGame } from "../../lib/festival/player/signForGame";

exports.post = function (req: Request): Response {
  if (!req.params?.data) {
    return {
      body: { error: true },
      contentType: "application/json"
    };
  }
  let data: SignForGameRequest = JSON.parse(req.params.data);
  return {
    body: signForGame(data),
    contentType: "application/json"
  };
};

interface SignForGameRequest {
  gameId: string;
}
