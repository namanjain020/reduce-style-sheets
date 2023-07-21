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
              // console.log(func);
              if (
                func in mixin &&
                atrule.params.match(/\(([^)]+)\)/) === null
              ) {
                const attr = mixin[func]["attributes"];
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
              } else if (func in mixin) {
                const params = atrule.params.match(/\(([^)]+)\)/)[1].split(",");
                // console.log(params);
                const obj = JSON.parse(JSON.stringify(mixin[func]["default"]));
                // console.log(obj);
                const keys = Object.keys(obj);
                for (let idx = 0; idx < params.length; idx++) {
                  if (params[idx].includes(":")) {
                    const variable = params[idx].split(":")[0].trim();
                    const value = params[idx].split(":")[1].trim();
                    obj[variable] = value;
                  } else {
                    const value = params[idx].trim();
                    obj[keys[idx]] = value;
                  }
                }
                keys.forEach((key1) => {
                  keys.forEach((key2) => {
                    if (key1 === obj[key2]) {
                      obj[key2] = obj[key1];
                    }
                  });
                });
                const attr = mixin[func]["attributes"];
                attr.forEach(async (eachProp) => {
                  const curProp = Object.keys(eachProp)[0];
                  let curValue = eachProp[curProp];
                  if (curValue.startsWith("$")) {
                    curValue = obj[curValue];
                  }
                  await atrule.parent.append({
                    prop: curProp,
                    value: curValue,
                  });
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
        // console.log("mixin out");
        res();
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

export async function mixinReplace(unresolvedDir, globalMixins) {
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
          await mixinReplaceHelper(filePath, globalMixins);
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
