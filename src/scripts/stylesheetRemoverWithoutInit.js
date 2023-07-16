import fs from "fs";
import path from "path";

import * as prettier from "prettier";
import postcss from "postcss";
import scss from "postcss-scss";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";
import _generator from "@babel/generator";
const generator = _generator.default;
const traverse = _traverse.default;

const __dirname = path.resolve();
let absDir;
let counterT = 0,
  counterF = 0;

async function checkEmpty(filePath, isEmpty) {
  return new Promise((res, rej) => {});
}

export async function stylesheetRemoverWithoutInit(
  unresolvedDir,
  importsTo,
  styleImports,
  result
) {
  // console.log("in");
  async function stylesheetRemoverHelper(
    unresolvedDir,
    importsTo,
    styleImports,
    result
  ) {
    const dir = path.resolve(unresolvedDir);
    absDir = dir;
    const files = fs.readdirSync(dir);
    //Recursive function
    files
      .filter((file) => !file.includes("node_modules"))
      .filter((file) => !file.includes("assets"))
      .filter((file) => !file.includes("__tests__"))
      .filter((file) => !file.includes("tests"))
      .filter((file) => !file.startsWith("_"))
      .forEach(async (file) => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          stylesheetRemoverHelper(filePath, importsTo, styleImports, result);
        } else if (stats.isFile()) {
          const extension = path.extname(filePath);
          if ([".css", ".scss", ".less"].includes(extension)) {
            const stats = fs.statSync(filePath);
            const fileSize = stats.size;
            //If file is empty delete the file and remove imports
            let isEmpty =false;
            const css = fs.readFileSync(filePath, "utf8");
            let count = 0;
            const test = (count) => ({
              postcssPlugin: "remove",
              async Rule(rule) {
                count++;
              },
            });
            test.postcss = true;
            postcss([test(count)])
              .process(css, { from: filePath, parser: scss })
              .then(async (result) => {
                // console.log(count);
                if (count > 0) {
                  isEmpty = false;
                } else {
                  isEmpty = true;
                }
                if (fileSize === 0 ) {
                  if(filePath in result)
                  {
                    result[filePath]["empty"] = true;
                  }
                  // console.log("Empty " + filePath);
                  // TO DO
                  if (filePath in styleImports) {
                    await helper1();
                  }
                  if (filePath in importsTo) {
                    await helper2(filePath, importsTo);
                  }
                  // Uncomment when needed \\
                  console.log(filePath + " is empty");
                  fs.rmSync(filePath);
                }
              })
              .catch((error) => {
                console.error(error);
              });
            
            // If file is never imported remove
            // if (!(filePath in styleImports) && !(filePath in importsTo)) {
            //   console.log("Non imported file " + filePath);
            //   result[filePath]["unused"] = true;
            //   // Uncomment when needed \\
            //   fs.rmSync(filePath);
            // }
          }
        }
      });
  }
  await stylesheetRemoverHelper(unresolvedDir, importsTo, styleImports, result);
  // console.log("out");
  return;
}

async function helper1() {}

async function helper2(filePath, importsTo) {
  // console.log("empty file "+filePath);
  const temp = filePath.replace(/^.*[\\\/]/, "");
  importsTo[filePath].forEach((file) => {
    let pluginArr;
    if (file.endsWith(".ts")) {
      pluginArr = ["typescript"];
    } else if (file.endsWith(".js") || file.endsWith(".jsx")) {
      pluginArr = ["jsx"];
    } else if (file.endsWith(".tsx")) {
      pluginArr = ["jsx", "typescript"];
    }
    const content = fs.readFileSync(file, "utf8");
    const ast = parser.parse(content, {
      sourceType: "module",
      plugins: pluginArr,
    });
    traverse(ast, {
      ImportDeclaration(pathAST) {
        const { node } = pathAST;
        const str = node.source.value;
        if (str.endsWith(temp)) {
          pathAST.remove();
        }
      },
    });
    const modCode = generator(ast).code;
    // Uncomment when needed \\
    let parserObj;
    if (filePath.endsWith("js") || filePath.endsWith("jsx")) {
      parserObj = "babel";
    } else {
      parserObj = "typescript";
    }
    fs.writeFileSync(file, prettier.format(modCode, { parser: parserObj }));
  });
  return;
}
