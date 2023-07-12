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







function regexHelper(className, fileName, importsFrom, recur, newStr) {
  if (recur > 5) {
    return "Stop Checking";
  }
  // console.log(fileName);
  const content = fs.readFileSync(fileName, "utf-8");
  const str = `${className}`;
  // const regex = new RegExp(`\\b${className}\\b`);
  if (content.includes(className)) {
    addToScript(className, fileName, newStr);
  } else {
    if (fileName in importsFrom) {
      for (let idx = 0; idx < importsFrom[fileName]["scripts"].length; idx++) {
        regexHelper(
          className,
          importsFrom[fileName]["scripts"][idx],
          importsFrom,
          recur + 1
        );
      }
    }
  }
  return;
}

function anotherHelper(className, params, newStr) {
  let arr = [params.filePath];
  if (params.filePath in params.styleImports) {
    params.styleImports[params.filePath].forEach((file) => arr.push(file));
  }
  for (let idx = 0; idx < arr.length; idx++) {
    if (arr[idx] in params.importsTo) {
      for (let idx2 = 0; idx2 < params.importsTo[arr[idx]].length; idx2++) {
        regexHelper(
          className,
          params.importsTo[arr[idx]][idx2],
          params.importsFrom,
          1,
          newStr
        );
      }
    }
  }
  return;
}

function addToScript(className, filePath, newStr) {
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
        `(^|(?<=[\\s"“”.]))${className}(?=$|(?=[\\s"“”}]))`
      );
      // Using AST notation we can grab the className attribut for all the react tags
      if (
        (path.node.name.name === "className" ||
          path.node.name.name === "class") &&
        path.node.value.type === "StringLiteral" &&
        regex.test(path.node.value.value)
      ) {
        // console.log(className + " converted " + newStr);
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
  fs.writeFileSync(filePath, modCode);
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
  postcss([twPlugin])
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
            .then(({ convertedRoot, nodes }) => {
              converted = convertedRoot.toString();

              let curVal = null;
              curVal = atruleHelper(converted, curVal);
              if (curVal !== null) {
                //add to js function
                console.log(rule.toString());
                console.log("changed to");
                console.log(curVal);
                console.log("\n");
                anotherHelper(className.substring(1), params, curVal);
                rule.remove();
                // onSuccess();
                params.removedBlocks[params.filePath]["replaced-tailwind"][
                  className
                ] = {};
                params.removedBlocks[params.filePath]["replaced-tailwind"][
                  className
                ]["original"] = rule.toString();
                params.removedBlocks[params.filePath]["replaced-tailwind"][
                  className
                ]["converted"] = curVal;
                const processed = root.toString();
                fs.writeFileSync(params.filePath, prettier.format(processed,{parser:"scss"}));
              }
            });
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
          convertClasses(params);
        }
      }
    });
  // console.log("StyleSheet converter execution completed");
  return;
}
