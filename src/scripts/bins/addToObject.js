function startsWithFunc(str, arr) {
  for (let idx = 0; idx < arr.length; idx++) {
    if (str.startsWith(arr[idx])) {
      return arr[idx];
    }
  }
  return null;
}
function endsWithFunc(str, arr) {
  for (let idx = 0; idx < arr.length; idx++) {
    if (str.endsWith(arr[idx])) {
      return true;
    }
  }
  return false;
}

export function addToObject(filePath, result, importsFrom, importsTo) {
  if (endsWithFunc(result, [".js", ".jsx", ".ts", ".tsx"])) {
    importsFrom[filePath]["scripts"].push(result);
  } else if (endsWithFunc(result, [".css", ".scss", ".less"])) {
    importsFrom[filePath]["styles"].push(result);
    if (!(result in importsTo)) {
      importsTo[result] = [];
    }
    importsTo[result].push(filePath);
  }
}
