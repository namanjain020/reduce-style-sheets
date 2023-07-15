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

async function readVariables(filePath) {
  return new Promise((res, rej) => {
    let css = fs.readFileSync(filePath, "utf8");

    const test = (variables) => ({
      postcssPlugin: "test",
      Declaration(decl) {
        // console.log(content);
        if (decl.prop.startsWith("$")) {
          variables[decl.prop] = decl.value;
          decl.remove();
        }
      },
    });
    test.postcss = true;
    let variables = {};
    postcss([test(variables)])
      .process(css, { from: filePath, parser: scss })
      .then((result) => {
        css = result.css;
        // console.log(variables);
        const vars = Object.keys(variables);
        vars.forEach((v) => {
          // console.log(v);
          css = css.replaceAll(v, variables[v]);
        });
        fs.writeFileSync(filePath, prettier.format(css, { parser: "scss" }));
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

export async function variableReplace(unresolvedDir) {
  // console.log("in");
  async function variableReplaceHelper(unresolvedDir) {
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
          variableReplaceHelper(filePath);
        } else if (stats.isFile()) {
          const extension = path.extname(filePath);
          if ([".css", ".scss", ".less"].includes(extension)) {
            await readVariables(filePath);
          }
        }
      });
  }
  await variableReplaceHelper(unresolvedDir);
  // console.log("out");
  return;
}
