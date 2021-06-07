import { Request, Response } from "enonic-types/controller";

import { bookSpace } from "../../lib/festival/player/bookSpace";

exports.post = function (req: KostiRequest): Response {
  if (!req.params?.data) {
    return {
      body: { error: true },
      contentType: "application/json"
    };
  }
  let data: userUpdateRequest = JSON.parse(req.params.data);
  return {
    body: bookSpace(
      req.cookies.cartId,
      data.ticket,
      data.firstName,
      data.gameId
    ),
    contentType: "application/json"
  };
};

interface userUpdateRequest {
  ticket: number;
  firstName: string;
  gameId: string;
}

interface KostiRequest extends Request {
  cookies: {
    cartId: string;
  };
}
