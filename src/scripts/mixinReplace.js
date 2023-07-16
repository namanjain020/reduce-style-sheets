import fs from "fs";
import path from "path";
import * as prettier from "prettier";
import postcss from "postcss";
import scss from "postcss-scss";
import _traverse from "@babel/traverse";
import _generator from "@babel/generator";
const generator = _generator.default;
const traverse = _traverse.default;

async function readMixins(filePath, globalMixins) {
  return new Promise((res, rej) => {
    let css = fs.readFileSync(filePath, "utf8");
    const another = (mixin) => ({
      postcssPlugin: "another",
      AtRule(atrule) {
        try {
          if (atrule.name === "include") {
            if (atrule.params.includes("(")) {
              const func = atrule.params.match(/([^()\s]+)\s*\(/)[1];
              const params = atrule.params
                .match(/\(([^)]+)\)/)[1]
                .replaceAll(" ", "")
                .split(",");
              if (
                func in mixin &&
                params.length === mixin[func]["params"].length
              ) {
                // console.log(mixin[func]["params"]);
                // console.log(params);
                const attr = mixin[func]["attributes"];
                attr.forEach(async (obj) => {
                  const curProp = Object.keys(obj)[0];
                  let curValue = obj[curProp];
                  for (let idx = 0; idx < mixin[func]["params"].length; idx++) {
                    curValue = curValue.replace(
                      mixin[func]["params"][idx],
                      params[idx]
                    );
                  }
                  await atrule.parent.append({
                    prop: curProp,
                    value: curValue,
                  });
                  // console.log(curProp,curValue);
                });
                atrule.remove();
              }
            } else {
              if (atrule.params in mixin) {
                const attr = mixin[atrule.params]["attributes"];
                attr.forEach(async (obj) => {
                  const curProp = Object.keys(obj)[0];
                  const curValue = obj[curProp];
                  // console.log(curProp,curValue);
                  await atrule.parent.append({
                    prop: curProp,
                    value: curValue,
                  });
                });
                atrule.remove();
              }
            }
          }
        } catch {}
      },
    });
    another.postcss = true;

    postcss([another(globalMixins)])
      .process(css, { from: filePath, parser: scss })
      .then((result) => {
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

export async function mixinReplace(unresolvedDir, globalMixins) {
  // console.log("in");
  async function mixinReplaceHelper(unresolvedDir, globalMixins) {
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
          mixinReplaceHelper(filePath, globalMixins);
        } else if (stats.isFile()) {
          const extension = path.extname(filePath);
          if ([".css", ".scss", ".less"].includes(extension)) {
            await readMixins(filePath, globalMixins);
          }
        }
      });
  }
  //   let mixins = JSON.parse(JSON.stringify(globalMixins));
  await mixinReplaceHelper(unresolvedDir, globalMixins);
  // console.log("out");
  return;
}
