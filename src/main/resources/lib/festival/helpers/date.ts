const i18n = __non_webpack_require__("/lib/xp/i18n");
const moment = require("./moment");

export { getMonthName, getDayName, getTime };

function getMonthName(date: Date) {
  let month = date.getMonth();
  let monthName = "";

  switch (month) {
    case 0:
      monthName = i18n.localize({
        key: "months.jan.date",
        locale: "ru"
      });
      break;
    case 1:
      monthName = i18n.localize({
        key: "months.feb.date",
        locale: "ru"
      });
      break;
    case 2:
      monthName = i18n.localize({
        key: "months.mar.date",
        locale: "ru"
      });
      break;
    case 3:
      monthName = i18n.localize({
        key: "months.apr.date",
        locale: "ru"
      });
      break;
    case 4:
      monthName = i18n.localize({
        key: "months.may.date",
        locale: "ru"
      });
      break;
    case 5:
      monthName = i18n.localize({
        key: "months.jun.date",
        locale: "ru"
      });
      break;
    case 6:
      monthName = i18n.localize({
        key: "months.jul.date",
        locale: "ru"
      });
      break;
    case 7:
      monthName = i18n.localize({
        key: "months.aug.date",
        locale: "ru"
      });
      break;
    case 8:
      monthName = i18n.localize({
        key: "months.sep.date",
        locale: "ru"
      });
      break;
    case 9:
      monthName = i18n.localize({
        key: "months.oct.date",
        locale: "ru"
      });
      break;
    case 10:
      monthName = i18n.localize({
        key: "months.nov.date",
        locale: "ru"
      });
      break;
    case 11:
      monthName = i18n.localize({
        key: "months.dec.date",
        locale: "ru"
      });
      break;
  }

  return monthName;
}

function getDayName(date: Date) {
  return i18n.localize({
    key: "days.name." + date.getDay(),
    locale: "ru"
  });
}

function getTime(date: Date): string {
  return moment(date).utcOffset("+0300").format("HH:mm");
}
