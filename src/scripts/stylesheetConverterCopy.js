import fs from "fs";
import path from "path";
import postcss from "postcss";
import { TailwindConverter } from "css-to-tailwindcss";
import * as prettier from "prettier";
import camelCase from "./bins/camelCase.js";
import temp from "./bins/configured.js";

import parser from "@babel/parser";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;
import postcssImport from "postcss-import";
import postcssNested from "postcss-nested";

import _generator from "@babel/generator";

const generator = _generator.default;
import scss from "postcss-scss";
import postcssExtend from "postcss-extend";

const __dirname = path.resolve();
let counter = 0;
// Tailwind converter used (Abstraction)
const converter = new TailwindConverter({
  remInPx: null,
  // set null if you don't want to convert rem to pixels
  postCSSPlugins: [postcssNested, postcssImport], // add any postcss plugins to this array
  tailwindConfig: {
    // your tailwind config here
    content: [],
    theme: {
      extend: {},
      supports: {
        grid: "display: grid",
        flex: "display: flex",
      },
    },
  },
});

async function regexHelper(className, fileName, importsFrom, visited, newStr) {
  if (visited.includes(fileName)) {
    return;
  }
  visited.push(fileName);
  // console.log(fileName);
  const content = fs.readFileSync(fileName, "utf-8");
  const str = `${className}`;
  // const regex = new RegExp(`\\b${className}\\b`);
  if (content.includes(className)) {
    addToScript(className, fileName, newStr);
  }
  if (fileName in importsFrom) {
    for (let idx = 0; idx < importsFrom[fileName]["scripts"].length; idx++) {
      await regexHelper(
        className,
        importsFrom[fileName]["scripts"][idx],
        importsFrom,
        visited,
        newStr
      );
    }
  }
  return;
}

async function anotherHelper(className, params, newStr) {
  let arr = [params.filePath];
  let visited = [];
  if (params.filePath in params.styleImports) {
    params.styleImports[params.filePath].forEach((file) => arr.push(file));
  }
  for (let idx = 0; idx < arr.length; idx++) {
    if (arr[idx] in params.importsTo) {
      for (let idx2 = 0; idx2 < params.importsTo[arr[idx]].length; idx2++) {
        await regexHelper(
          className,
          params.importsTo[arr[idx]][idx2],
          params.importsFrom,
          visited,
          newStr
        );
      }
    }
  }
  return;
}

function addToScript(className, filePath, newStr) {
  if (!newStr) {
    return;
  }
  if(newStr.length)
  {
    return;
  }
  let pluginArr;
  if (filePath.endsWith(".ts")) {
    pluginArr = ["typescript"];
  } else if (filePath.endsWith(".js") || filePath.endsWith(".jsx")) {
    pluginArr = ["jsx"];
  } else if (filePath.endsWith(".tsx")) {
    pluginArr = ["jsx", "typescript"];
  }
  const content = fs.readFileSync(filePath, "utf8");
  const ast = parser.parse(content, {
    sourceType: "module",
    plugins: pluginArr,
  });

  traverse(ast, {
    StringLiteral(path) {
      const regex = new RegExp(
        `(^|(?<=[\\s"“”.]))${className}(?=$|(?=[\\s"“”}]))`
      );
      // Using AST notation we can grab the className attribut for all the react tags
      if (regex.test(path.node.value)) {

        let baseString = path.node.value;
        // const comment = {
        //   type: "CommentLine",
        //   value: `SCRIPT TODO: ${className} class has been converted to util classes`,
        // };
        // path.node.trailingComments = [comment];
        newStr.forEach((util) => {
          if (!path.node.value.includes(util)) {
            path.node.value = path.node.value + " " + util;
          }
        });
        // path.node.value.value = baseString + " " + newStr;
        // console.log(path.node.value.value);
      }
    },
  });
  //Uncomment below two lines to update js files
  const modCode = generator(ast).code;
  let parserObj;
  if (filePath.endsWith("js") || filePath.endsWith("jsx")) {
    parserObj = "babel";
  } else {
    parserObj = "typescript";
  }
  fs.writeFileSync(filePath, prettier.format(modCode, { parser: parserObj }));
  return;
}

function atruleHelper(converted, curVal) {
  const twPlugin = postcss.plugin("tw-plugin", () => {
    return (root) => {
      root.walkRules((rule) => {
        if (
          rule.nodes.length === 1 &&
          rule.nodes[0].name &&
          rule.nodes[0].name === "apply"
        ) {
          curVal = rule.nodes[0].params;
          // console.log(curVal);
        } else {
          curVal = null;
        }
      });
    };
  });
  postcss([postcssNested, twPlugin])
    .process(converted, { from: undefined })
    .then((result) => {})
    .catch((error) => {
      console.error(error);
    });
  return curVal;
}
const convertUsedClasses = postcss.plugin("convert-used-classes", (params) => {
  return (root) => {
    // console.log(root.nodes.length);
    root.walkRules((rule) => {
      // console.log("Hello");
      const codeBlock = rule.toString();
      // Check if the rule has a class selector
      if (
        rule.selector &&
        rule.selector.includes(".") &&
        rule.parent.type !== "atrule"
      ) {
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
        const regex = /[:+~>@$&\\]/;
        const parent = rule.parent;
        if (
          (!parent || !parent.selector) &&
          ids.length === 0 &&
          tags.length === 0 &&
          classes.length === 1 &&
          !regex.test(rule.selector)
        ) {
          const className = classes[0];
          params.removedBlocks[params.filePath]["replaced-tailwind"][
            className
          ] = [];
          let count = 0;
          let str = [];
          const utils = Object.keys(temp);
          utils.forEach((util) => {
            const size = Object.keys(temp[util]).length;
            let counter = 0;
            let arrayOfIndex = [];
            const props = Object.keys(temp[util]); //array
            props.forEach((prop) => {
              for (let idx = 0; idx < rule.nodes.length; idx++) {
                if (
                  rule.nodes[idx].type === "decl" &&
                  camelCase(rule.nodes[idx].prop) == prop &&
                  rule.nodes[idx].value == temp[util][prop]
                ) {
                  arrayOfIndex.push(idx);
                }
                counter++;
              }
            });
            if (size == arrayOfIndex.length) {
              str.push(util);
              for (let idx = 0; idx < arrayOfIndex.length; idx++) {
                const obj = {
                  [rule.nodes[arrayOfIndex[idx] - idx].toString()]: util
                };
                params.removedBlocks[params.filePath]["replaced-tailwind"][
                  className
                ].push(obj);
                rule.nodes[arrayOfIndex[idx] - idx].remove();
              }
            }
          });
          console.log(className);
          anotherHelper(className.substring(1), params, str);
          console.log(str);

          if (rule.nodes.length == 0) {
            console.log(rule.selector + " is removed");
            rule.remove();
          }
          // let converted = "ABC";
          const processed = root.toString();
          fs.writeFileSync(
            params.filePath,
            prettier.format(processed, { parser: "scss" })
          );
          // fs.writeFileSync(params.filePath, root.toString());
          // converter
          //   .convertCSS(rule.toString())
          //   .then(({ convertedRoot, nodes }) => {
          //     converted = convertedRoot.toString();

          //     let curVal = null;
          //     curVal = atruleHelper(converted, curVal);
          //     if (curVal !== null) {
          //       //add to js function
          //       anotherHelper(className.substring(1), params, curVal);
          //       rule.remove();
          //       // onSuccess();
          //       params.removedBlocks[params.filePath]["replaced-tailwind"][
          //         className
          //       ] = {};
          //       params.removedBlocks[params.filePath]["replaced-tailwind"][
          //         className
          //       ]["original"] = rule.toString();
          //       params.removedBlocks[params.filePath]["replaced-tailwind"][
          //         className
          //       ]["converted"] = curVal;
          //     }
          //   });
        }
      }
    });
  };
});
function convertClasses(params) {
  const css = fs.readFileSync(params.filePath, "utf8");
  postcss([convertUsedClasses(params)])
    .process(css, { from: undefined, parser: scss })
    .then((result) => {})
    .catch((error) => {
      console.error(error);
    });
  // console.log(params.filePath);
}

export async function stylesheetConverter(
  unresDir,
  importsFrom,
  importsTo,
  styleImports,
  removedBlocks
) {
  // console.log("StyleSheet converter execution started");
  const dir = path.resolve(unresDir);
  const files = fs.readdirSync(dir);
  //Recursive function
  files
    .filter((file) => !file.includes("node_modules"))
    .filter((file) => !file.includes("__tests__"))
    .filter((file) => !file.includes("tests"))
    .filter((file) => !file.startsWith("_"))
    .forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        stylesheetConverter(
          filePath,
          importsFrom,
          importsTo,
          styleImports,
          removedBlocks
        );
      } else if (stats.isFile()) {
        const params = {
          filePath,
          importsFrom,
          importsTo,
          styleImports,
          removedBlocks,
        };
        const extension = path.extname(filePath);

        if ([".css", ".scss", ".less"].includes(extension)) {
          const css = fs.readFileSync(params.filePath, "utf8");
          // console.log(css);
          // console.log(filePath);
          convertClasses(params);
          const stats = fs.statSync(filePath);
          params.removedBlocks[params.filePath]["reduced-size"] = stats.size;
        }
      }
    });
  // console.log("StyleSheet converter execution completed");
  return;
}
