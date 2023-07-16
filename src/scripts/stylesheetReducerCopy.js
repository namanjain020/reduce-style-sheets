import fs from "fs";
import path from "path";
import postcss from "postcss";
import scss from "postcss-scss";
import * as prettier from "prettier";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;
import _generator from "@babel/generator";
const generator = _generator.default;
import parser from "@babel/parser";
const __dirname = path.resolve();

let counter = 0;
function endsWithFunc(str, arr) {
  for (let idx = 0; idx < arr.length; idx++) {
    if (str.endsWith(arr[idx])) {
      return true;
    }
  }
  return false;
}

async function checkScript(className, filePath) {
  let value = false;
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
          value = true;
        }
      }
    },
  });
  return value;
}

async function regexHelper(className, fileName, importsFrom, visited) {
  if (visited.includes(fileName)) {
    return false;
  }
  visited.push(fileName);
  const content = fs.readFileSync(fileName, "utf-8");
  if (content.includes(className)) {
    return true;
  } else {
    if (fileName in importsFrom) {
      for (let idx = 0; idx < importsFrom[fileName]["scripts"].length; idx++) {
        const result = await regexHelper(
          className,
          importsFrom[fileName]["scripts"][idx],
          importsFrom,
          visited
        );
        if (result) {
          return true;
        }
      }
    }
  }
  return false;
}

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
        !endsWithFunc(filePath, ["css", "scss", "less"]) &&
        !visited.includes(filePath)
      ) {
        toVisit.push(filePath);
      }
      return;
    });
  return;
}

async function helper(
  className,
  filePath,
  importsFrom,
  importsTo,
  styleImports
) {
  return new Promise(async (resolve, reject) => {
    let arr = [filePath];
    let visited = [];

    if (filePath in styleImports) {
      styleImports[filePath].forEach((file) => arr.push(file));
    }
    for (let idx = 0; idx < arr.length; idx++) {
      if (arr[idx] in importsTo) {
        for (let idx2 = 0; idx2 < importsTo[arr[idx]].length; idx2++) {
          const res = await regexHelper(
            className,
            importsTo[arr[idx]][idx2],
            importsFrom,
            visited
          );
          if (res) {
            resolve(true);
          }
        }
      }
    }
    const dirPath = path.dirname(filePath);
    let toVisit = [];
    dirSearch(className, visited, toVisit, dirPath).then((result) => {
      // console.log(toVisit);
      for (let idx = 0; idx < toVisit.length; idx++) {
        const content = fs.readFileSync(toVisit[idx], "utf8");
        if (content.includes(className)) {
          // console.log(toVisit[idx], className);
          resolve(true);
        }
      }
      resolve(false);
    });
  });
  // return boolVal;
}
async function removeClasses(
  filePath,
  importsFrom,
  importsTo,
  styleImports,
  removedBlocks
) {
  return new Promise((res, rej) => {
    // console.log(filePath);
    const css = fs.readFileSync(filePath, "utf8");
    postcss([
      removeUnusedClasses(
        filePath,
        importsFrom,
        importsTo,
        styleImports,
        removedBlocks
      ),
    ])
      .process(css, { from: filePath, parser: scss })
      .then((result) => {
        res();
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

const removeUnusedClasses = (
  filePath,
  importsFrom,
  importsTo,
  styleImports,
  removedBlocks
) => ({
  postcssPlugin: "remove",
  async Root(root) {
    root.walkRules(async (rule) => {
      // console.log("in",counter);
      // counter++;
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
        const regex = /[:+~>@\[$&\\]/;
        if (
          ids.length === 0 &&
          tags.length === 0 &&
          classes.length === 1 &&
          !regex.test(rule.selector)
        ) {
          const className = classes[0];
          await helper(
            className.substring(1),
            filePath,
            importsFrom,
            importsTo,
            styleImports
          ).then((result) => {
            if (!result) {
              console.log(className, "class is unused");
              removedBlocks[filePath]["unused-classes"][
                classes[0].substring(1)
              ] = codeBlock.replace(classes[0], "");
              // Uncommet to start removal \\
              rule.remove();
            }
          });
        }
      }
    });
  },
  RootExit(root) {
    fs.writeFileSync(
      filePath,
      prettier.format(root.toString(), { parser: "scss" })
    );
  },
});
removeUnusedClasses.postcss = true;

export async function stylesheetReducer(
  dirt,
  importsFrom,
  importsTo,
  styleImports,
  removedBlocks
) {
  return new Promise(async (res1, rej1) => {
    console.log("in");
    async function stylesheetReducerHelper(
      dirt,
      importsFrom,
      importsTo,
      styleImports,
      removedBlocks
    ) {
      return new Promise(async (res2, rej2) => {
        const dir = path.resolve(dirt);
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
              await stylesheetReducerHelper(
                filePath,
                importsFrom,
                importsTo,
                styleImports,
                removedBlocks
              ).then((value) => {
                res2();
              });
            } else if (stats.isFile()) {
              const extension = path.extname(filePath);
              if ([".css", ".scss", ".less"].includes(extension)) {
                counter++;
                await removeClasses(
                  filePath,
                  importsFrom,
                  importsTo,
                  styleImports,
                  removedBlocks
                ).then((value) => {
                  res2();
                });
              }
            }
          });
      });
    }
    await stylesheetReducerHelper(
      dirt,
      importsFrom,
      importsTo,
      styleImports,
      removedBlocks
    ).then((value) => {
      console.log("out");
      res1();
    });
  });
}
