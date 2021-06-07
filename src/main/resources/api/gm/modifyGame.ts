import { Content } from "enonic-types/content";
import { Request, Response } from "enonic-types/controller";
import { modifyGame } from "../../lib/festival/gm/modifyGame";
import { Game } from "../../site/content-types/game/game";

exports.post = function (req: Request): Response {
  if (!req.params?.data) {
    return {
      body: { error: true },
      contentType: "application/json"
    };
  }
  let data: Content<Game> = JSON.parse(req.params.data);
  return {
    body: modifyGame(data),
    contentType: "application/json"
  };
};
