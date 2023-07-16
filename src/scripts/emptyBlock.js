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

    const test = () => ({
      postcssPlugin: "test",
      prepare(result) {
        return {
          Rule(rule) {
            if (rule.nodes && rule.nodes.length < 1) {
              rule.remove();
            }
          },
        };
      },
    });
    test.postcss = true;
    postcss([test])
      .process(css, { from: filePath, parser: scss })
      .then((result) => {
        //answer
        fs.writeFileSync(
          filePath,
          prettier.format(result.css, { parser: "scss" })
        );
        res();
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

export async function emptyBlock(unresolvedDir) {
  // console.log("in");
  async function emptyBlockHelper(unresolvedDir) {
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
          await emptyBlockHelper(filePath);
        } else if (stats.isFile()) {
          const extension = path.extname(filePath);
          if ([".css", ".scss", ".less"].includes(extension)) {
            await readVariables(filePath);
          }
        }
      });
  }
  await emptyBlockHelper(unresolvedDir);
  // console.log("out");
  return;
}
