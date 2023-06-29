import fs from "fs";
import path from "path";
import postcss from "postcss";
// import { className } from "postcss-selector-parser";
const __dirname = path.resolve();
// let removedBlocks ={}
function regexHelper(className, fileName, importsFrom) {
  // console.log(fileName);
  const content = fs.readFileSync(fileName, "utf-8");
  const regex = new RegExp(`\\b${className}\\b`);
  if (regex.test(content)) {
    return true;
  } else {
    if (fileName in importsFrom) {
      for (let idx = 0; idx < importsFrom[fileName]["scripts"].length; idx++) {
        if (
          regexHelper(
            className,
            importsFrom[fileName]["scripts"][idx],
            importsFrom
          )
        ){
          return true;
        }
      }
    }
  }
  return false;
}

function helper(className, filePath, importsFrom, importsTo, styleImports) {
  // let boolVal = false;
  // console.log(className);
  let arr = [filePath];
  if (filePath in styleImports) {
    styleImports[filePath].forEach((file) => arr.push(file));
  }
  // console.log("BLAH BLAH BLAH");
  // console.log(filePath);
  
  // console.log(arr);
  for (let idx = 0; idx < arr.length; idx++) {
    if (arr[idx] in importsTo) {
      for (let idx2 = 0; idx2 < importsTo[arr[idx]].length; idx2++) {
        if (regexHelper(className, importsTo[arr[idx]][idx2], importsFrom)) {
          // console.log(true);
          return true;
        }
      }
    }
    // const temp = className.substring(1);
    // const content = fs.readFileSync(arr[idx], "utf-8");
    // const regex = new RegExp(`\\b${temp}\\b`);
    // if (regex.test(content)) {
    //   boolVal = true;
    // }
    // if (arr[idx] in mapScripts) {
    //   boolVal = boolVal | helper(className, mapScripts[arr[idx]], mapScripts);
    // }
  }
  // console.log(false);
  // console.log("\n");
  return false;
  // return boolVal;
}

function removeClasses(filePath, importsFrom, importsTo, styleImports,removedBlocks) {
  const css = fs.readFileSync(filePath, "utf8");
  // let removedBlocks = JSON.parse(fs.readFileSync("./logs/removedBlocks.json"));
  // console.log(removedBlocks);
  postcss([
    removeUnusedClasses(
      filePath,
      importsFrom,
      importsTo,
      styleImports,
      removedBlocks
    ),
  ])
    .process(css, { from: undefined })
    .then((result) => {
      fs.writeFile(filePath, result.css, (err) => err && console.error(err));
    })
    .catch((error) => {
      console.error(error);
    });
  // fs.writeFileSync("./logs/removedBlocks.json", JSON.stringify(removedBlocks));
}
const removeUnusedClasses = postcss.plugin(
  "remove-unused-classes",
  (filePath, importsFrom, importsTo, styleImports, removedBlocks) => {
    return (root) => {
      root.walkRules((rule) => {
        const codeBlock = rule.toString();
        // Check if the rule has a class selector
        if (rule.selector && rule.selector.includes(".")) {
          const arr = rule.selector
            .toString()
            .match(/(\.[^\s.#,]+|#[^\s.#,]+|[^.\s#,][^\s.#,]+)?/g)
            .filter((el) => el != "");
          let classes = [];
          let ids = [];
          let tags = [];
          arr.forEach((el) => {
            if (el[0] === ".") classes.push(el);
            else if (el[0] === "#") ids.push(el);
            else tags.push(el);
          });

          //No pseudo selectors are taken in tc for now
          const regex = /[:+~>]/;
          if (
            ids.length === 0 &&
            tags.length === 0 &&
            classes.length === 1 &&
            !regex.test(rule.selector)
          ) {
            const className = classes[0];
            if (
              !helper(
                className.substring(1),
                filePath,
                importsFrom,
                importsTo,
                styleImports
              )
            ) {
              // const obj = {classes[0] : codeBlock};
              if (!(filePath in removedBlocks)) {
                removedBlocks[filePath] = {};
              }
              if (!("unused-classes" in removedBlocks[filePath])) {
                removedBlocks[filePath]["unused-classes"] = {};
              }
              removedBlocks[filePath]["replaced-tailwind"] = {};
              removedBlocks[filePath]["unused-classes"][
                classes[0].substring(1)
              ] = codeBlock.replace(classes[0], "");
              // Uncommet to start removal
              // rule.remove();
            }
          }
          // let required = true;
        }
      });
    };
  }
);

// export function CSSreducer(mapStyles, mapScripts, codeBlocks) {
//   const cssFiles = Object.keys(mapStyles);
//   cssFiles.forEach((cssFile) => {
//     if(cssFile.endsWith(".scss") || cssFile.endsWith(".css")  || cssFile.endsWith(".less"))
//     {
//       // console.log(cssFile);
//       if(fs.existsSync(cssFile))
//       {
//           console.log(cssFile);
//           remCSSClasses(cssFile, mapScripts, mapStyles[cssFile], codeBlocks);
//       }
//     }
//   });
// }

export function stylesheetReducer(dirt, importsFrom, importsTo, styleImports,removedBlocks) {
  // console.log(styleImports);
  const dir = path.resolve(dirt);
  const files = fs.readdirSync(dir);
  // files = fs.readdirSync(dir);
  //Recursive function
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      stylesheetReducer(filePath, importsFrom, importsTo, styleImports,removedBlocks);
    } else if (stats.isFile()) {
      const extension = path.extname(filePath);
      if ([".css", ".scss", ".less"].includes(extension)) {
        removeClasses(filePath, importsFrom, importsTo, styleImports,removedBlocks);
        // const arr = extractClassNamesFromFile(filePath);
        // if (!(filePath in JSClasses)) {
        //   JSClasses[filePath] = [];
        //   arr.forEach((el) => JSClasses[filePath].push(el));
        // } else {
        //   arr.forEach((el) => JSClasses[filePath].push(el));
        // }
      }
    }
  });
  // console.log(removedBlocks);
}
