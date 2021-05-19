exports.forceArray = forceArray;
exports.log = info;

function forceArray(data: any): [] {
  if (!Array.isArray(data)) {
    data = [data];
  }
  return data;
}

function info(data: any, location: any): void {
  if (location) {
    log.info(
      "Utilities log at %s: %s",
      location,
      JSON.stringify(data, null, 4)
    );
  } else {
    log.info("Utilities log %s", JSON.stringify(data, null, 4));
  }
}
