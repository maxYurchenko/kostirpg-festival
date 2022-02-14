const i18n = __non_webpack_require__("/lib/xp/i18n");
const moment = require("./moment");

export { getMonthName, getDayName, getTime };

function getMonthName(date: Date, langParam: string = "ru") {
  const lang = langParam === "ua" ? "uk" : langParam;
  let month = date.getMonth();
  let monthName = "";

  switch (month) {
    case 0:
      monthName = i18n.localize({
        key: "months.jan.date",
        locale: lang
      });
      break;
    case 1:
      monthName = i18n.localize({
        key: "months.feb.date",
        locale: lang
      });
      break;
    case 2:
      monthName = i18n.localize({
        key: "months.mar.date",
        locale: lang
      });
      break;
    case 3:
      monthName = i18n.localize({
        key: "months.apr.date",
        locale: lang
      });
      break;
    case 4:
      monthName = i18n.localize({
        key: "months.may.date",
        locale: lang
      });
      break;
    case 5:
      monthName = i18n.localize({
        key: "months.jun.date",
        locale: lang
      });
      break;
    case 6:
      monthName = i18n.localize({
        key: "months.jul.date",
        locale: lang
      });
      break;
    case 7:
      monthName = i18n.localize({
        key: "months.aug.date",
        locale: lang
      });
      break;
    case 8:
      monthName = i18n.localize({
        key: "months.sep.date",
        locale: lang
      });
      break;
    case 9:
      monthName = i18n.localize({
        key: "months.oct.date",
        locale: lang
      });
      break;
    case 10:
      monthName = i18n.localize({
        key: "months.nov.date",
        locale: lang
      });
      break;
    case 11:
      monthName = i18n.localize({
        key: "months.dec.date",
        locale: lang
      });
      break;
  }

  return monthName;
}

function getDayName(date: Date, langParam: string = "ru") {
  const lang = langParam === "ua" ? "uk" : langParam;
  return i18n.localize({
    key: "days.name." + date.getDay(),
    locale: lang
  });
}

function getTime(date: Date): string {
  return moment(date).utcOffset("+0300").format("HH:mm");
}
