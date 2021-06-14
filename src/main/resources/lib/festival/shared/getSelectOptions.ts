const contentLib = __non_webpack_require__("/lib/xp/content");

export { getSelectOptions };

function getSelectOptions(inputName: string) {
  let type = contentLib.getType(app.name + ":game");
  if (!type) return null;
  let result: Array<SelectOption> = [];
  type.form.forEach((f: any) => {
    if (f.name === inputName) {
      if (f.formItemType === "Input") {
        f.config.option.forEach((o: any) => {
          result.push({ name: o["@value"], class: o["@class"] });
        });
      } else {
        f.options.forEach((o: any) => {
          if (o.name === "select") {
            o.items[0].config.option.forEach((i: any) => {
              result.push({ name: i["@value"], class: i["@class"] });
            });
          }
        });
      }
    }
  });
  return result;
}

interface SelectOption {
  name: string;
  class: string;
}
