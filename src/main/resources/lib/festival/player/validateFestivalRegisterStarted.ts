import { Content } from "enonic-types/content";
import { Game } from "../../../site/content-types/game/game";
import { Valid } from "../../../types/validation";
import { getFestivalByChild } from "../shared/festival/getFestivalByChild";
import { getItemsList } from "../shared/getItemsList";

const cartLib = require("/lib/cartLib");

const defaultTurboGames = 5;

export default validateFestivalRegisterStarted;

function validateFestivalRegisterStarted(
  ticketId: number | null,
  game: Content<Game>,
  userId: string
): Valid {
  const festival = getFestivalByChild(game._id);
  if (!festival) {
    return {
      error: true,
      message: "Фестиваль не найден."
    };
  }

  const regStart = new Date(festival.data.gameRegisterStart);
  if (regStart < new Date()) {
    return { error: false };
  }

  const turboRegStart = new Date(festival.data.gameRegisterTurboStart);

  let cart = null;
  if (ticketId) {
    cart = cartLib.getCartByQr(ticketId);
  }

  const gamesAmount = getGamesAmountForUser(userId, festival._id);
  if (gamesAmount >= defaultTurboGames) {
    return {
      error: true,
      message:
        "Вы уже записались на масимальное количество предварительной регистрации."
    };
  }
  if (turboRegStart < new Date() && cart && cart.legendary) {
    return { error: false };
  }

  return {
    error: true,
    message: "Регистрация еще не началась."
  };
}

function getGamesAmountForUser(userId: string, festival: string) {
  const games = getItemsList({
    parentId: festival,
    parentPathLike: true,
    type: "game",
    sort: "_parentPath ASC",
    additionalQuery: " and data.players = '" + userId + "'"
  });
  return games.length;
}
