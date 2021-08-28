const contentLib = __non_webpack_require__("/lib/xp/content");
const utils = __non_webpack_require__("/lib/util");
const userLib = __non_webpack_require__("/lib/userLib");
import * as contextLib from "./../helpers/contextLib";

import { gameSpaceAvailable } from "../shared/game/gameSpace";
import { updateEntity } from "../shared/updateEntity";
import { validateUser } from "../player/validateUser";
import { Game } from "../../../site/content-types/game/game";
import { UserAllData } from "../../../types/kostiUser";
import { Content } from "enonic-types/content";
import { User } from "../../../types/user";
import { validationFailed, Valid } from "../../../types/validation";

export { signForGame };

function signForGame(params: SignForGameParams, adminUser?: boolean): Valid {
  let paramsValid = validateParams(params);
  if (paramsValid.error) return paramsValid;

  let user = getSignUpUserData(params, adminUser);
  if (validationFailed(user)) {
    return user;
  }

  let game = contentLib.get<Game>({ key: params.gameId });
  if (!game) return { error: true };
  let userValid = validateUser(game, user);
  if (validationFailed(userValid)) {
    return userValid;
  }
  let players: string[] = game.data.players
    ? utils.data.forceArray(game.data.players)
    : [];
  if (players.indexOf(user._id) === -1) {
    players.push(user._id);
    game.data.players = players;
    updateEntity(game);
  }
  return { error: false };
}

function getSignUpUserData(
  params: SignForGameParams,
  adminUser?: boolean
): Content<User> | Valid {
  if (!adminUser) {
    let currentUser = checkUserLoggedIn(params);
    if (currentUser) {
      return currentUser;
    }
  }

  let newUser: Valid | Content<User> | null = null;
  let game = contentLib.get<Game>({ key: params.gameId });

  if (!game) return { error: true };

  if (params.email && params.phone && params.username) {
    newUser = createNewUserForGame(params, adminUser);
    if (validationFailed(newUser)) return newUser;
  }

  if (!newUser)
    return { error: true, message: "Вам нужно войти, или зарегистрироватся." };
  return newUser;
}

function checkUserLoggedIn(params: SignForGameParams): null | Content<User> {
  let user: UserAllData = userLib.getCurrentUser();
  if (!user) return null;
  if (!user.content.data.phone && params.phone) {
    user.content.data.phone = params.phone;
    updateEntity(user.content);
  }
  return user.content;
}

function createNewUserForGame(
  params: SignForGameParams,
  adminUser?: boolean
): Valid | Content<User> {
  let newUser: Content<User> | null = userLib.findUserContentType(params.email);
  if (adminUser && newUser) return newUser;
  else if (newUser)
    return {
      error: true,
      message:
        "Пользователь с такой почтой уже существует. Пожалуйста, войдите."
    };
  contextLib.runAsAdmin(function () {
    newUser = userLib.createUserContentType(
      params.username,
      params.email,
      null,
      null,
      params.phone
    );
  });
  if (!newUser) {
    return { error: true, message: "Не удалось создать пользователя." };
  }
  return newUser;
}

function validateParams(params: SignForGameParams) {
  if (!params || !params.gameId) {
    return { error: true, message: "Игра не выбрана." };
  }
  if (!gameSpaceAvailable(params.gameId)) {
    return { error: true, message: "Мест больше нет." };
  }
  return { error: false };
}

interface SignForGameParams {
  gameId: string;
  email?: string;
  phone?: string;
  username?: string;
}
