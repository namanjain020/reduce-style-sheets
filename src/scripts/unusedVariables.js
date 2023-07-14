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
    const css = fs.readFileSync(filePath, "utf8");
    const contentPlugin = () => ({
      postcssPlugin: "contentPlugin",
      prepare(result) {
        return {
          Declaration(decl) {
            // console.log(decl.prop);
            content = content + " " + decl.value;
          },
        };
      },
    });

    const test = (content) => ({
        postcssPlugin: "test",
        prepare(result) {
          return {
            Declaration(decl) {
                // console.log(content);
                if(decl.prop.startsWith("$") && !content.includes(decl.prop))
                {
                    decl.remove();
                    // console.log(decl.prop);
                }
            },
          };
        },
      });
    contentPlugin.postcss = true;
    test.postcss = true;
    let content = "";
    postcss([contentPlugin(content)])
      .process(css, { from: filePath, parser: scss })
      .then((result) => {
        postcss([test(content)])
          .process(css, { from: filePath, parser: scss })
          .then((result) => {
            fs.writeFileSync(filePath,prettier.format(result.css, { parser: "scss" }))
            //answer
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    // postcss([contentPlugin,test])
    //   .process(css, { from: filePath, parser: scss })
    //   .then((result) => {
    //     res();
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  });
}

export async function unusedVariables(unresolvedDir) {
  // console.log("in");
  async function unusedVariablesHelper(unresolvedDir) {
    const dir = path.resolve(unresolvedDir);
    const files = fs.readdirSync(dir);
    //Recursive function
    files
      .filter((file) => !file.includes("node_modules"))
      .filter((file) => !file.includes("__tests__"))
      .filter((file) => !file.includes("tests"))
      .filter((file) => !file.startsWith("_"))
      .forEach(async (file) => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          unusedVariablesHelper(filePath);
        } else if (stats.isFile()) {
          const extension = path.extname(filePath);
          if ([".css", ".scss", ".less"].includes(extension)) {
            await readVariables(filePath);
          }
        }
      });
  }
  await unusedVariablesHelper(unresolvedDir);
  // console.log("out");
  return;
}
