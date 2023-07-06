import fs from "fs";
import path from "path";
import postcss from "postcss";
import { TailwindConverter } from "css-to-tailwindcss";

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

let curVal = null;

const twPlugin = postcss.plugin("tw-plugin", () => {
  return (root) => {
    root.walkRules((rule) => {
      if (
        rule.nodes.length === 1 &&
        rule.nodes[0].name &&
        rule.nodes[0].name === "apply"
      ) {
        curVal = rule.nodes[0].params;
      } else {
        curVal = null;
      }
    });
  };
});

async function helper(converted) {
  postcss([twPlugin])
    .process(converted, { from: undefined })
    .then((result) => {})
    .catch((error) => {
      console.error(error);
    });
}

function convertClasses(
  filePath,
  importsFrom,
  importsTo,
  styleImports,
  removedBlocks
) {
  const css = fs.readFileSync(filePath, "utf8");
  postcss([
    postcssNested,
    convertUsedClasses(
      filePath,
      importsFrom,
      importsTo,
      styleImports,
      removedBlocks
    ),
  ])
    .process(css, { from: undefined, parser: scss })
    .then((result) => {
      setTimeout(() => {
        // console.log(result.css);
        // console.log("2");
        fs.writeFile(filePath, result.css, (err) => err && console.error(err));
      }, 10000);
    })
    .catch((error) => {
      console.error(error);
    });
}
const convertUsedClasses = postcss.plugin(
  "convert-used-classes",
  (filePath, importsFrom, importsTo, styleImports, removedBlocks) => {
    return (root) => {
      root.walkRules((rule) => {
        curVal = null;
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
            let converted = "ABC";
            converter
              .convertCSS(rule.toString())
              .then(async ({ convertedRoot, nodes }) => {
                if (!(filePath in removedBlocks)) {
                  removedBlocks[filePath] = {};
                }
                if (!("unused-classes" in removedBlocks[filePath])) {
                  removedBlocks[filePath]["unused-classes"] = {};
                }
                if (!("replaced-tailwind" in removedBlocks[filePath])) {
                  removedBlocks[filePath]["replaced-tailwind"] = {};
                }
                converted = convertedRoot.toString();
                // removedBlocks[filePath]["unused-classes"][
                //   classes[0].substring(1)
                // ] = "codeblock";
                // console.log(className);
                // console.log(converted);

                await helper(converted);
                if (curVal !== null) {
                  //add to js function
                  await anotherHelper(
                    className.substring(1),
                    filePath,
                    importsFrom,
                    importsTo,
                    styleImports,
                    curVal
                  );
                  removedBlocks[filePath]['replaced-tailwind'][className] = {};
                  removedBlocks[filePath]['replaced-tailwind'][className]["original"] = rule.toString();
                  removedBlocks[filePath]['replaced-tailwind'][className]["converted"] = curVal;
                  
                  // console.log(rule.toString());
                    console.log("1");
                    rule.remove();
                  // console.log(root.toString());
                } else {
                  // console.log("NOTHING");
                }
                // console.log("\n");
                counter++;
              });
          }
        }
      });
    };
  }
);

export function stylesheetConverter(
  dirt,
  importsFrom,
  importsTo,
  styleImports,
  removedBlocks
) {
  // console.log(styleImports);

  const dir = path.resolve(dirt);
  const files = fs.readdirSync(dir);
  //Recursive function
  files
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
        const extension = path.extname(filePath);
        if ([".css", ".scss", ".less"].includes(extension)) {
          convertClasses(
            filePath,
            importsFrom,
            importsTo,
            styleImports,
            removedBlocks
          );
        }
      }
    });
}

async function regexHelper(className, fileName, importsFrom, recur, newStr) {
  if (recur > 5) {
    return "Stop Checking";
  }
  // console.log(fileName);
  const content = fs.readFileSync(fileName, "utf-8");
  const str = `${className}`;
  // const regex = new RegExp(`\\b${className}\\b`);
  if (content.includes(className)) {
    addToScript(className, fileName, newStr);
    return "Found";
  } else {
    if (fileName in importsFrom) {
      for (let idx = 0; idx < importsFrom[fileName]["scripts"].length; idx++) {
        if (
          regexHelper(
            className,
            importsFrom[fileName]["scripts"][idx],
            importsFrom,
            recur + 1
          ) === "Found"
        ) {
          // return "Found";
        }
      }
    }
  }
  return "Not Found";
}

async function anotherHelper(
  className,
  filePath,
  importsFrom,
  importsTo,
  styleImports,
  newStr
) {
  let arr = [filePath];
  if (filePath in styleImports) {
    styleImports[filePath].forEach((file) => arr.push(file));
  }
  for (let idx = 0; idx < arr.length; idx++) {
    if (arr[idx] in importsTo) {
      for (let idx2 = 0; idx2 < importsTo[arr[idx]].length; idx2++) {
        regexHelper(
          className,
          importsTo[arr[idx]][idx2],
          importsFrom,
          1,
          newStr
        );
      }
    }
  }
  // return false;
  // return boolVal;
}

async function addToScript(className, filePath, newStr) {
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
    JSXAttribute(path) {
      const regex = new RegExp(
        `(^|(?<=[\\s"“”]))${className}(?=$|(?=[\\s"“”]))`
      );
      // console.log(path.node.name.name,path.node.value.type,path.node.value.value,regex.test(path.node.value.value));
      // Using AST notation we can grab the className attribut for all the react tags
      if (
        (path.node.name.name === "className" ||
          path.node.name.name === "class") &&
        path.node.value.type === "StringLiteral" &&
        regex.test(path.node.value.value)
      ) {
        console.log(className+ " converted " + newStr);
        // changedClass.push(el);

        let baseString = path.node.value.value;
        const comment = {
          type: "CommentLine",
          value: `SCRIPT TODO: ${className} class has been converted to util classes`,
        };
        // console.log(baseString);
        path.node.trailingComments = [comment];
        // const arr = baseString.split(" ");
        path.node.value.value = baseString + " " + newStr;
        // console.log(path.node.value.value);
      }
    },
  });
  //Uncomment below two lines to update js files
  const modCode = generator(ast).code;
  // fs.writeFileSync(filePath, modCode);
}
