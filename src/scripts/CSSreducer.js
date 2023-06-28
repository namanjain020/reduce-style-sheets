import fs from "fs";
import path from "path";
import postcss from "postcss";
// import { className } from "postcss-selector-parser";
const __dirname = path.resolve();

function helper(className, arr, mapScripts) {
  // console.log(file);
  // console.log(arr);
  // return true;
  for (const idx = 0; idx < arr.length; idx++) {
    // arr.forEach((file) => {
    const temp = className.substring(1);
    console.log(temp);
    console.log(arr[idx]);
    const content = fs.readFileSync(arr[idx], "utf-8");
    const regex = new RegExp(`\\b${temp}\\b`);
    console.log(regex);
    // const regex = /${temp}/g;
    if (regex.test(content));
    {
      console.log(temp + " present");
      return true;
    }
    // if ((helper(className, mapScripts[file]), mapScripts)) {
    //   return true;
    // }
  }
  return false;
}

function remCSSClasses(filePath, mapScripts, array) {
  const css = fs.readFileSync(filePath, "utf8");
  postcss([removeUnusedClasses(filePath, mapScripts, array)])
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
  (filePath, mapScripts, array) => {
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
              console.log(codeBlock);
            }
          }
          let required = true;
          //Only class combinators are considered
          // if (
          //   ids.length === 0 &&
          //   tags.length === 0 &&
          //   !regex.test(rule.selector)
          // ) {
          //   if (rule.selector.includes(",")) {
          //     required = classes.some((c) => reqClasses.has(c.substring(1)));
          //   } else {
          //     required = classes.every((c) => reqClasses.has(c.substring(1)));
          //   }
          // }
          // if (!required) {
          //   //Uncomment to start removal
          //   // rule.remove();
          //   param[rule.selector] = codeBlock;
          //   console.log(codeBlock);
          // }
        }
      });
    };
  }
);

export function CSSreducer(mapStyles, mapScripts) {
  const cssFiles = Object.keys(mapStyles);
  cssFiles.forEach((cssFile) => {
    remCSSClasses(cssFile, mapScripts, mapStyles[cssFile]);
    // console.log(cssFile);
    // console.log(mapStyles[cssFile])
  });
}
