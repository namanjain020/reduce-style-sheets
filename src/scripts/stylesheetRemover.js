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

async function init(filePath, result) {
  return new Promise((res, rej) => {
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;

    //Initialize result block;
    result[filePath] = {};

    result[filePath]["original-size"] = fileSize / 1000;
    result[filePath]["original-code"] = prettier.format(
      fs.readFileSync(filePath, "utf8"),
      { parser: "scss" }
    );
    result[filePath]["unused"] = false;
    result[filePath]["empty"] = false;
    result[filePath]["unused-classes"] = {};
    result[filePath]["replaced-tailwind"] = {};
    result[filePath]["reduced-size"] = fileSize / 1000;
    result[filePath]["final-size"] = 0;
    result[filePath]["final-code"] = "";
    res();
  });
}

export async function stylesheetRemover(
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
      .filter((file) => !file.includes("assets"))
      .filter((file) => !file.includes("node_modules"))
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
            await init(filePath, result);
            const stats = fs.statSync(filePath);
            const fileSize = stats.size;
            //If file is empty delete the file and remove imports
            if (fileSize === 0) {
              result[filePath]["empty"] = true;
              console.log("Empty " + filePath);
              // TO DO
              if (filePath in styleImports) {
                await helper1();
              }
              if (filePath in importsTo) {
                await helper2(filePath, importsTo);
              }
              // Uncomment when needed \\
              fs.rmSync(filePath);
            }
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
