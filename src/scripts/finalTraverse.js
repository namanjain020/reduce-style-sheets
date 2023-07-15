import fs from "fs";
import path from "path";

import postcss from "postcss";
import scss from "postcss-scss";
import * as prettier from "prettier";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";
import _generator from "@babel/generator";
const generator = _generator.default;
const traverse = _traverse.default;


export async function finalTraverse(
  unresolvedDir,
  importsTo,
  styleImports,
  result
) {
  // console.log("in");
  async function finalTraverseHelper(
    unresolvedDir,
    importsTo,
    styleImports,
    result
  ) {
    const dir = path.resolve(unresolvedDir);
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
          finalTraverseHelper(filePath, importsTo, styleImports, result);
        } else if (stats.isFile()) {
          const extension = path.extname(filePath);
          if ([".css", ".scss", ".less"].includes(extension)) {
            const stats = fs.statSync(filePath);
            const fileSize = stats.size;
            result[filePath]["final-size"] = fileSize / 1000;
            result[filePath]["final-code"] = prettier.format(fs.readFileSync(filePath,"utf8"), { parser: "scss" })
          }
        }
      });
  }
  await finalTraverseHelper(unresolvedDir, importsTo, styleImports, result);
  // console.log("out");
  return;
}
