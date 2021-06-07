const contentLib = __non_webpack_require__("/lib/xp/content");

function checkIfGameRegisterOpen() {
  var festival = contentLib.query({
    query: "data.gmRegisterOpen = 'true'",
    start: 0,
    count: 1
  });
  if (festival.total > 0) {
    return true;
  }
  return false;
}

export { checkIfGameRegisterOpen };
