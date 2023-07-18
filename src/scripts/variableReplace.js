import fs from "fs";
import path from "path";
import * as prettier from "prettier";
import postcss from "postcss";
import scss from "postcss-scss";
import _traverse from "@babel/traverse";
import _generator from "@babel/generator";
const generator = _generator.default;
const traverse = _traverse.default;

async function readVariables(filePath, variables) {
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

    postcss([test(variables)])
      .process(css, { from: filePath, parser: scss })
      .then((result) => {
        css = result.css;
        const vars = Object.keys(variables);
        vars.forEach((v) => {
          css = css.replaceAll(v, variables[v]);
        });
        fs.writeFileSync(filePath, prettier.format(css, { parser: "scss" }));
        // console.log("variable out");
        res();
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

export async function variableReplace(unresolvedDir, globalVariables) {
  console.log("in variable");
  async function variableReplaceHelper(unresolvedDir, variables) {
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
          await variableReplaceHelper(filePath, variables);
          return;
        } else if (stats.isFile()) {
          const extension = path.extname(filePath);
          if ([".css", ".scss", ".less"].includes(extension)) {
            await readVariables(filePath, variables);
            return;
          }
        }
      });
  }
  let variables = JSON.parse(JSON.stringify(globalVariables));
  await variableReplaceHelper(unresolvedDir, variables);
  // console.log("out");
  return;
}
