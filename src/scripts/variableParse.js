import fs from "fs";
import path from "path";

import postcss from "postcss";
import scss from "postcss-scss";

import parser from "@babel/parser";
import _traverse from "@babel/traverse";
import _generator from "@babel/generator";
const generator = _generator.default;
const traverse = _traverse.default;

async function readVariables(globalVariables, filePath) {
    return new Promise((res,rej) => {
        const css = fs.readFileSync(filePath, "utf8");
        const test = postcss.plugin("test", () => {
          return (root) => {
            root.nodes.forEach((node) => {
              if (node.type == "decl") {
                const decl = node;
              //   console.log(decl.prop);
              //   console.log(decl.value);
                globalVariables[decl.prop] = decl.value;
              }
            });
          };
        });
        postcss([test])
          .process(css, { from: filePath, parser: scss })
          .then((result) => {
            res();
          })
          .catch((error) => {
            console.log(error);
          });
    })
}

export async function variableParse(unresolvedDir, globalVariables) {
  // console.log("in");
  async function variableParseHelper(unresolvedDir, globalVariables) {
    const dir = path.resolve(unresolvedDir);
    const files = fs.readdirSync(dir);
    //Recursive function
    files
      .filter((file) => !file.includes("node_modules"))
      .filter((file) => !file.includes("__tests__"))
      .filter((file) => !file.includes("tests"))
      .forEach(async (file) => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          variableParseHelper(filePath, globalVariables);
        } else if (stats.isFile()) {
          const extension = path.extname(filePath);
          if (
            [".css", ".scss", ".less"].includes(extension) &&
            (filePath.includes("variable") || filePath.includes("Variable"))
          ) {
            await readVariables(globalVariables, filePath);
          }
        }
      });
  }
  await variableParseHelper(unresolvedDir, globalVariables);
  // console.log("out");
  return;
}
