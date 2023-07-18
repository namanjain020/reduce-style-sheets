import fs from "fs";
import path from "path";

import postcss from "postcss";
import scss from "postcss-scss";

import parser from "@babel/parser";
import _traverse from "@babel/traverse";
import _generator from "@babel/generator";
const generator = _generator.default;
const traverse = _traverse.default;

async function checkNodes(nodes) {
  for (let idx = 0; idx < nodes.length; idx++) {
    if (nodes[idx].type !== "decl") {
      return false;
    }
  }
  return true;
}

async function readMixins(globalMixins, filePath) {
  return new Promise((res, rej) => {
    const css = fs.readFileSync(filePath, "utf8");
    const test = (mixin) => ({
      postcssPlugin: "test",
      AtRule(atrule) {
        try {
          if (atrule.name === "mixin") {
            checkNodes(atrule.nodes).then((res) => {
              if (res) {
                let func = "";
                let params1 = [],
                  params2 = [];
                let props = [];
                let defaultObj = {};
                if (atrule.params.includes("(")) {
                  func = atrule.params.match(/([^()\s]+)\s*\(/)[1];
                  if( atrule.params.match(/\(([^)]+)\)/))
                  {
                    params1 = atrule.params.match(/\(([^)]+)\)/)[1].split(",");
                  }
                  else{
                    return;
                  }
                  
                  // params2 = atrule.params.match(/\(([^)]+)\)/)[1].split(",");
                  for (let idx = 0; idx < params1.length; idx++) {
                    // console.log(params1);
                    // const variable =
                    let defValue;
                    if (params1[idx].includes(":")) {
                      defValue = params1[idx]
                        .split(":")[1]
                        .replace("\n", "")
                        .trim();
                    } else {
                      defValue = null;
                    }
                    defaultObj[
                      params1[idx].split(":")[0].replace("\n", "").trim()
                    ] = defValue;
                  }
                  atrule.nodes.forEach((node) => {
                    props.push({ [node.prop]: node.value });
                  });
                } else {
                  func = atrule.params;
                  atrule.nodes.forEach((node) => {
                    props.push({ [node.prop]: node.value });
                  });
                }
                // console.log(defaultArr);
                mixin[func] = {};
                mixin[func]["params"] = params1;
                mixin[func]["default"] = defaultObj;
                mixin[func]["attributes"] = props;
                // console.log(func, defaultObj, props);
              }
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
    });
    test.postcss = true;
    postcss([test(globalMixins)])
      .process(css, { from: filePath, parser: scss })
      .then((result) => {
        res();
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

export async function mixinParse(unresolvedDir, globalMixins) {
  // console.log("in");
  async function mixinParseHelper(unresolvedDir, globalMixins) {
    const dir = path.resolve(unresolvedDir);
    const files = fs.readdirSync(dir);
    //Recursive function
    files
      .filter((file) => !file.includes("node_modules"))
      .filter((file) => !file.includes("__tests__"))
      .filter((file) => !file.includes("test"))
      .forEach(async (file) => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          mixinParseHelper(filePath, globalMixins);
        } else if (stats.isFile()) {
          const extension = path.extname(filePath);
          if (
            [".css", ".scss", ".less"].includes(extension) &&
            (filePath.includes("mixin") || filePath.includes("Mixin"))
          ) {
            await readMixins(globalMixins, filePath);
          }
        }
      });
  }
  await mixinParseHelper(unresolvedDir, globalMixins);
  // console.log("out");
  return;
}
