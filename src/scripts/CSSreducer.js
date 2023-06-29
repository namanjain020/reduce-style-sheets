import fs from "fs";
import path from "path";
import postcss from "postcss";
// import { className } from "postcss-selector-parser";
const __dirname = path.resolve();

function helper(className, arr, mapScripts) {
  let boolVal = false;
  
  for (let idx = 0; idx < arr.length; idx++) {
    const temp = className.substring(1);
    const content = fs.readFileSync(arr[idx], "utf-8");
    const regex = new RegExp(`\\b${temp}\\b`);
    if (regex.test(content)) {
      boolVal = true;
    }
    if (arr[idx] in mapScripts) {
      boolVal = boolVal | helper(className, mapScripts[arr[idx]], mapScripts);
    }
  }
  return boolVal;
}

function remCSSClasses(filePath, mapScripts, array, codeBlocks) {
  const css = fs.readFileSync(filePath, "utf8");
  postcss([removeUnusedClasses(filePath, mapScripts, array, codeBlocks)])
    .process(css, { from: undefined })
    .then((result) => {
      fs.writeFile(filePath, result.css, (err) => err && console.error(err));
    })
    .catch((error) => {
      console.error(error);
    });
}
const removeUnusedClasses = postcss.plugin(
  "remove-unused-classes",
  (filePath, mapScripts, array, codeBlocks) => {
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
            if (!helper(classes[0], array, mapScripts)) {
              // const obj = {classes[0] : codeBlock};
              if (!(filePath in codeBlocks)) {
                codeBlocks[filePath] = {};
              }
              if(! ("unused-classes" in codeBlocks[filePath]))
              {
                codeBlocks[filePath]["unused-classes"] = {};
              }
              codeBlocks[filePath]["replaced-tailwind"] = {};
              codeBlocks[filePath]["unused-classes"][classes[0].substring(1)] =
              codeBlock.replace(classes[0], "");

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

export function CSSreducer(mapStyles, mapScripts, codeBlocks) {
  const cssFiles = Object.keys(mapStyles);
  cssFiles.forEach((cssFile) => {
    remCSSClasses(cssFile, mapScripts, mapStyles[cssFile], codeBlocks);
  });
}
