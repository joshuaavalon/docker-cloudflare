/* eslint-disable prefer-named-capture-group */
function normalize(strArray: string[]): string {
  const resultArray = [];
  if (strArray.length === 0) {
    return "";
  }

  if (typeof strArray[0] !== "string") {
    throw new TypeError("Url must be a string. Received " + strArray[0]);
  }

  // If the first part is a plain protocol, we combine it with the next part.
  if (strArray[0].match(/^[^/:]+:\/*$/u) && strArray.length > 1) {
    strArray[0] = strArray.shift() + strArray[0];
  }

  // There must be two or three slashes in the file protocol, two slashes in anything else.
  if (strArray[0].match(/^file:\/\/\//u)) {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/u, "$1:///");
  } else {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/u, "$1://");
  }

  for (let i = 0; i < strArray.length; i++) {
    let component = strArray[i];

    if (typeof component !== "string") {
      throw new TypeError("Url must be a string. Received " + component);
    }

    if (component === "") {
      continue;
    }

    if (i > 0) {
      // Removing the starting slashes for each component but the first.
      component = component.replace(/^[/]+/u, "");
    }
    if (i < strArray.length - 1) {
      // Removing the ending slashes for each component but the last.
      component = component.replace(/[/]+$/u, "");
    } else {
      // For the last component we will combine multiple slashes to a single one.
      component = component.replace(/[/]+$/u, "/");
    }

    resultArray.push(component);
  }

  let str = resultArray.join("/");
  // Each input component is now separated by a single slash except the possible first plain protocol part.

  // remove trailing slash before parameters or hash
  str = str.replace(/\/(\?|&|#[^!])/gu, "$1");

  // replace ? in parameters with &
  const parts = str.split("?");
  str = parts.shift() + (parts.length > 0 ? "?" : "") + parts.join("&");

  return str;
}

export function joinUrl(...args: string[]): string {
  const parts = Array.from(Array.isArray(args[0]) ? args[0] : args);
  return normalize(parts);
}
