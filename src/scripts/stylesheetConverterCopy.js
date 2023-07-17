import fs from "fs";
import path from "path";
import postcss from "postcss";
import simpleVars from "postcss-simple-vars";
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

const variables = {
  $tight: "-0.05em",
  $tighter: "-0.025em",
};

// let global;

async function atruleHelper(converted, curVal) {
  return new Promise((res, rej) => {
    let value;
    const twPlugin = postcss.plugin("tw-plugin", () => {
      return (root) => {
        root.walkRules((rule) => {
          value = rule.nodes[0].params;
          console.log(value);
        });
      };
    });
    postcss([twPlugin])
      .process(converted, { from: undefined })
      .then((result) => {
        res();
      })
      .catch((error) => {
        console.error(error);
      });
  });
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
    await addToScript(className, fileName, newStr);
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

async function addToScript(className, filePath, newStr) {
  // console.log(className);
  // console.log(filePath);
  try {
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

    await traverse(ast, {
      StringLiteral(path) {
        if (path.node && path.node.value) {
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
          }
        }
      },
    });
    //Uncomment below two lines to update js files
    const modCode = await generator(ast).code;
    // let parserObj;
    // if (filePath.endsWith("js") || filePath.endsWith("jsx")) {
    //   parserObj = "babel";
    // } else {
    //   parserObj = "typescript";
    // }
    // console.log(className+ " |||| " +  newStr  +"   changes in "+ filePath);
    fs.writeFileSync(filePath, modCode);
    return;
  } catch (error) {
    console.log("error");
    return;
  }
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
                    camelCase(rule.nodes[idx].prop) === prop &&
                    rule.nodes[idx].value === temp[util][prop]
                  ) {
                    arrayOfIndex.push(idx);
                  }
                  if (
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
                str.push(util);
                for (let idx = 0; idx < arrayOfIndex.length; idx++) {
                  const obj = {
                    [rule.nodes[arrayOfIndex[idx] - idx].toString()]: util,
                  };
                  params.removedBlocks[params.filePath]["replaced-tailwind"][
                    className
                  ].push(obj);
                  params.removedBlocks[params.filePath]["converted-number"]++;
                  rule.nodes[arrayOfIndex[idx] - idx].remove();
                }
              }
            });
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
                    // console.log(converted);
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
                      !curVal.includes("\\") &&
                      !curVal.includes('"')
                    ) {
                      rule.nodes[idx].remove();
                      params.removedBlocks[params.filePath]["converted-number"]++;
                      str.push(curVal);
                      if (str && str.length > 0) {
                        await anotherHelper(
                          className.substring(1),
                          params,
                          str
                        );
                      }
                      // console.log("OTHER");
                      console.log(className);
                      console.log(str);
                      if (rule.nodes.length === 0) {
                        console.log(rule.selector + " is removed");
                        rule.remove();
                      }
                    }
                  });
              }
            }
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
  const css = fs.readFileSync(params.filePath, "utf8");
  // const processedCss = postcss()
  //   .use(simpleVars({ silent: true }))
  //   .process(css)
  //   .css;
  // const css = fs.readFileSync(filePath, "utf8");
  const test = postcss.plugin("test", () => {
    return (root) => {
      root.nodes.forEach((node) => {
        if (node.type == "decl") {
          const decl = node;
          local[decl.prop] = decl.value;
        }
      });
    };
  });
  postcss([test])
    .process(css, { from: params.filePath, parser: scss })
    .then((result) => {})
    .catch((error) => {
      console.log(error);
    });

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
  // console.log("second-in");
  let local = JSON.parse(JSON.stringify((globalVariables)));

  // console.log("StyleSheet converter execution started");
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
        stylesheetConverter(
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
          // console.log(css);
          // console.log(filePath);
          await convertClasses(params, local);
          const stats = fs.statSync(filePath);
          params.removedBlocks[params.filePath]["reduced-size"] = stats.size;
        }
      }
    });
  // console.log("second-out");
  // console.log("StyleSheet converter execution completed");
  return;
}
