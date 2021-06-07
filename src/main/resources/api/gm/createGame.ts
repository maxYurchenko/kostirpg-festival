import { Request, Response } from "enonic-types/controller";
import { addGame } from "../../lib/festival/gm/addGame";
import { Game } from "../../site/content-types/game/game";

exports.post = function (req: Request): Response {
  if (!req.params?.data) {
    return {
      body: { error: true },
      contentType: "application/json"
    };
  }
  let data: GameData = JSON.parse(req.params.data);
  let displayName = data.displayName;
  delete data.displayName;
  return {
    body: addGame(displayName ? displayName : "", data),
    contentType: "application/json"
  };
};

interface GameData extends Game {
  displayName?: string;
}
