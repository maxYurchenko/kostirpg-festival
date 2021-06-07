import { Request, Response } from "enonic-types/controller";
import { deleteGame } from "../../lib/festival/gm/deleteGame";

exports.post = function (req: Request): Response {
  if (!req.params?.data) {
    return {
      body: { error: true },
      contentType: "application/json"
    };
  }
  var data: Data = JSON.parse(req.params.data);

  return {
    body: deleteGame(data.id),
    contentType: "application/json"
  };
};

interface Data {
  id: string;
}
