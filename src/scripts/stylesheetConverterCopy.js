import fs from "fs";
import path from "path";
import postcss from "postcss";
import simpleVars from "postcss-simple-vars";
import types from "@babel/types";
import { TailwindConverter } from "css-to-tailwindcss";
import * as prettier from "prettier";
import camelCase from "./bins/camelCase.js";
import temp from "./bins/configured.js";
import calc from "postcss-calc";
// var calc = require("postcss-calc")
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

const variables = {
  $tight: "-0.05em",
  $tighter: "-0.025em",
};

// let global;
function endsWithFunc(str, arr) {
  for (let idx = 0; idx < arr.length; idx++) {
    if (str.endsWith(arr[idx])) {
      return true;
    }
  }
  return false;
}


const converter = new TailwindConverter({
  remInPx: null,
  // set null if you don't want to convert rem to pixels
  postCSSPlugins: [], // add any postcss plugins to this array
  tailwindConfig: {
    // your tailwind config here
    content: [],
    theme: {
      extend: {},
      supports: {},
    },
  },
});

async function dirSearch(className, visited, toVisit, dir) {
  const files = fs.readdirSync(dir);
  files
    .filter((file) => !file.includes("__tests__"))
    .filter((file) => !file.includes("tests"))
    .forEach(async (file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        await dirSearch(className, visited, toVisit, filePath);
      } else if (
        stats.isFile() &&
        endsWithFunc(filePath, [".js", ".jsx", ".ts", ".tsx"]) &&
        !visited.includes(filePath)
      ) {
        toVisit.push(filePath);
      }
      return;
    });
  return;
}

async function regexHelper(
  className,
  fileName,
  importsFrom,
  visited,
  newStr,
  spaceweb
) {
  if (visited.includes(fileName)) {
    return;
  }
  visited.push(fileName);
  // console.log(fileName);
  const content = fs.readFileSync(fileName, "utf-8");
  const str = `${className}`;
  // const regex = new RegExp(`\\b${className}\\b`);
  if (content.includes(className)) {
    await addToScript(className, fileName, newStr, spaceweb);
  }
  if (fileName in importsFrom) {
    for (let idx = 0; idx < importsFrom[fileName]["scripts"].length; idx++) {
      await regexHelper(
        className,
        importsFrom[fileName]["scripts"][idx],
        importsFrom,
        visited,
        newStr,
        spaceweb
      );
    }
  }
  return;
}

async function anotherHelper(className, params, newStr, spaceweb) {
  if (newStr.length === 0) {
    return;
  }
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
          newStr,
          spaceweb
        );
      }
    }
  }

  const dirPath = path.dirname(params.filePath);
  let toVisit = [];
  await dirSearch(className, visited, toVisit, dirPath).then(async (result) => {
    // console.log(toVisit);
    for (let idx = 0; idx < toVisit.length; idx++) {
      const content = fs.readFileSync(toVisit[idx], "utf8");
      if (content.includes(className)) {
        await addToScript(className, toVisit[idx], newStr, spaceweb);
        // console.log(toVisit[idx], className);
      }
    }
  });
  return;
}

async function checkArray(arr, value) {
  for (let idx = 0; idx < arr.length; idx++) {
    if (arr[idx].property && arr[idx].property.name === value) {
      // console.log(value);
      return true;
    }
  }
  return false;
}

async function addToScript(className, filePath, newStr, spaceweb) {
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
  try {
    await traverse(ast, {
      JSXExpressionContainer(path) {
        const { expression } = path.node;
        if (
          types.isMemberExpression(expression) &&
          expression.property.name === className
        ) {
          const arrayExpression = types.arrayExpression([expression]);
          path.replaceWith(types.jsxExpressionContainer(arrayExpression));
        } else if (types.isArrayExpression(expression)) {
          checkArray(expression.elements, className).then((bool) => {
            if (bool) {
              let string = "";
              newStr.forEach((util) => {
                string = string + " " + util;
              });
              const newStringLiteral = types.stringLiteral(string);
              expression.elements.push(newStringLiteral);
            }
            function hasComment(path, commentContent) {
              const existingComments = path.parent.trailingComments || [];
              return existingComments.some(
                (comment) => comment.value === commentContent
              );
            }
            let comment = "todo: styles not as per spaceweb standards";
            if (!hasComment(path, comment) && !spaceweb) 
            {
              path.addComment("trailing", comment);
            }
          });
        }
        
      },
    });
  } catch (error) {
    console.log(error);
  }
  await traverse(ast, {
    TemplateLiteral(path) {
      if (path.node) {
        const regex = new RegExp(
          `(^|(?<=[\\s"“”.]))${className}(?=$|(?=[\\s"“”}]))`
        );
      }
    },
  });
  await traverse(ast, {
    StringLiteral(path) {
      if (path.node && path.node.value) {
        const regex = new RegExp(
          `(^|(?<=[\\s"“”.]))${className}(?=$|(?=[\\s"“”}]))`
        );
        // Using AST notation we can grab the className attribut for all the react tags
        if (regex.test(path.node.value)) {
          let baseString = path.node.value;
          function hasComment1(path, commentContent) {
            const existingComments = path.parent.trailingComments || [];
            return existingComments.some(
              (comment) => comment.value === commentContent
            );
          }
          function hasComment2(path, commentContent) {
            const existingComments = path.trailingComments || [];
            return existingComments.some(
              (comment) => comment.value === commentContent
            );
          }
          let comment = "todo: styles not as per spaceweb standards";
          if (!hasComment1(path, comment) && !spaceweb && !hasComment1(path, comment)) 
          {
            path.addComment("trailing", comment);
          }
          newStr.forEach((util) => {
            if (!path.node.value.includes(util)) {
              path.node.value = path.node.value + " " + util;
            }
          });
        }
      }
    },
  });
  //Uncomment below two lines to update js files
  const modCode = await generator(ast).code;
  let fp ="/Users/naman.jain1/Documents/something/reduce-style-sheets/src/scripts/bins/.prettierrc.json";
  fp =path.resolve(fp);
  const text = fs.readFileSync(fp, "utf8");
  fs.writeFileSync(
    filePath,
    prettier.format(modCode, { parser: "typescript" })
  );
  return;
}

const convertUsedClasses = (params, local) => ({
  postcssPlugin: "convert",
  async Root(root) {
    for (let idx = 0; idx < root.nodes.length; idx++) {
      if (root.nodes[idx].type === "rule") {
        const rule = root.nodes[idx];
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
            let str1 = [];
            const utils = Object.keys(temp);
            utils.forEach((util) => {
              const size = Object.keys(temp[util]).length;
              let counter = 0;
              let arrayOfIndex = [];
              let arr = [];
              const props = Object.keys(temp[util]); //array
              props.forEach((prop) => {
                for (let idx = 0; idx < rule.nodes.length; idx++) {
                  if (
                    rule.nodes[idx].type === "decl" &&
                    camelCase(rule.nodes[idx].prop) === prop &&
                    rule.nodes[idx].value === temp[util][prop]
                  ) {
                    arrayOfIndex.push(idx);
                    arr.push(prop);
                  } else if (
                    rule.nodes[idx].type === "decl" &&
                    camelCase(rule.nodes[idx].prop) === prop &&
                    //Object of variables
                    rule.nodes[idx].value in local &&
                    local[rule.nodes[idx].value] === temp[util][prop]
                  ) {
                    arrayOfIndex.push(idx);
                  }
                  counter++;
                }
              });
              if (size === arrayOfIndex.length) {
                str1.push(util);
                for (let idx = 0; idx < arrayOfIndex.length; idx++) {
                  const obj = {
                    [rule.nodes[arrayOfIndex[idx] - idx].toString()]: util,
                  };
                  params.removedBlocks[params.filePath]["replaced-tailwind"][
                    className
                  ].push(obj);
                  params.removedBlocks[params.filePath]["converted-number"]++;
                  rule.nodes[arrayOfIndex[idx] - idx].remove();
                  if (rule.nodes.length === 0) {
                    rule.remove();
                  }  
                }
              }
            });
            await anotherHelper(
              className.substring(1),
              params,
              str1,
              true
            ).then(async (value) => {
              let str2 = [];
              for (let idx = 0; idx < rule.nodes.length; idx++) {
                if (rule.nodes[idx] && rule.nodes[idx].type === "decl") {
                  const prop = rule.nodes[idx].prop;
                  let val;
                  if (
                    rule.nodes[idx].value.startsWith("$") &&
                    rule.nodes[idx].value in local
                  ) {
                    val = local[rule.nodes[idx].value];
                  } else {
                    val = rule.nodes[idx].value;
                  }
                  const attribute = ".class{" + prop + ":" + val + "}";
                  await converter
                    .convertCSS(attribute)
                    .then(async ({ convertedRoot, nodes }) => {
                      const converted = convertedRoot.toString();
                      let curVal = " ";


                      const twPlugin = () => ({
                        postcssPlugin: "tw-plugin",
                        async Rule(rule) {
                          curVal = curVal + rule.nodes[0].params;
                        },
                      });
                      twPlugin.postcss = true;
                      postcss([twPlugin])
                        .process(converted, { from: undefined })
                        .then((result) => {})
                        .catch((error) => {
                          console.error(error);
                        });
                      if (
                        curVal &&
                        !curVal.includes("undefined") &&
                        !curVal.includes("\\") &&
                        !curVal.includes('"')
                      ) {
                        rule.nodes[idx].remove();
                        params.removedBlocks[params.filePath][
                          "converted-number"
                        ]++;
                        str2.push(curVal);
                        if (rule.nodes.length === 0) {
                          rule.remove();
                        }  
                      }
                    });
                }
              }
              if (str2 && str2.length > 0) {
                await anotherHelper(
                  className.substring(1),
                  params,
                  str2,
                  false
                );
              }

            });
          }
        }
      }
    }
  },
  async RootExit(root) {
    fs.writeFileSync(
      params.filePath,
      prettier.format(root.toString(), { parser: "scss" })
    );
  },
});
convertUsedClasses.postcss = true;

async function convertClasses(params, local) {
  let css = fs.readFileSync(params.filePath, "utf8");

  postcss([convertUsedClasses(params, local)])
    .process(css, { from: params.filePath, parser: scss })
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
  removedBlocks,
  globalVariables
) {
  let local = JSON.parse(JSON.stringify(globalVariables));

  const dir = path.resolve(unresDir);
  const files = fs.readdirSync(dir);
  //Recursive function
  files
    .filter((file) => !file.includes("assets"))
    .filter((file) => !file.includes("node_modules"))
    .filter((file) => !file.includes("__tests__"))
    .filter((file) => !file.includes("tests"))
    .filter((file) => !file.startsWith("_"))
    .forEach(async (file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        await stylesheetConverter(
          filePath,
          importsFrom,
          importsTo,
          styleImports,
          removedBlocks,
          local
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
          await convertClasses(params, local);
          const stats = fs.statSync(filePath);
          params.removedBlocks[params.filePath]["reduced-size"] = stats.size;
        }
      }
    });
  return;
}
