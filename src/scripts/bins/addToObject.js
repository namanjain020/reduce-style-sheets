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

export async function addToObject(filePath, result, importsFrom, importsTo) {
  return new Promise ((res,rej) => {
    if(result.includes("node_modules"))
    {
      res();
    }
    if (endsWithFunc(result, [".js", ".jsx", ".ts", ".tsx"])) {
      importsFrom[filePath]["scripts"].push(result);
    } else if (endsWithFunc(result, [".css", ".scss", ".less"])) {
      importsFrom[filePath]["styles"].push(result);
      if (!(result in importsTo)) {
        importsTo[result] = [];
      }
      importsTo[result].push(filePath);
    }
    // console.log("Add to function " +filePath);
    res();
  })
}
