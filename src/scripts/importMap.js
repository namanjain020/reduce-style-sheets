//checking import functionality
import fs from "fs";
import path from "path";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";
import resolve from "enhanced-resolve";
import { addToObject } from "./bins/addToObject.js";
import { rejects } from "assert";
const traverse = _traverse.default;
const resolver = resolve.create.sync({
  extensions: [".js", ".json", ".node", ".jsx", ".ts", ".tsx"],
});
const alias = {
  "@/": "./",
  "@space/": "../../apps/spr-main-web/src/",
  "rules/": "../../apps/spr-main-web/src/rules/",
  "types/*": "../../apps/spr-main-web/src/types/",

  "core/*": "../../apps/spr-main-web/src/core/*",

  "typings/*": "../../apps/spr-main-web/src/typings/*",
  "modules/": "../../apps/spr-main-web/src/modules/*",
  "src/": "../../apps/spr-main-web/src/",
  "spr-space/": "../spr-space/",
  "spr-base/": "../spr-base/",
  "spr-main-web/": "../../apps/spr-main-web/",
  "@sprinklr/modules/": "../../packages/modules/src/",

  "@mattermost/client": "packages/client/src",
  "@mattermost/components": "packages/components/src",
  "@mattermost/types/": "packages/types/src/",
  "mattermost-redux/": "packages/mattermost-redux/src/",
  reselect: "packages/reselect/src",
  "@mui/styled-engine": "./node_modules/@mui/styled-engine-sc",
  "!!file-loader": "utils/empty-string",
  "@e2e-support/": "e2e/playwright/support/",
  "@e2e-test.config": "e2e/playwright/test.config.ts",
};

function startsWithFunc(str, arr) {
  for (let idx = 0; idx < arr.length; idx++) {
    if (str.startsWith(arr[idx])) {
      return arr[idx];
    }
  }
  return null;
}
function endsWithFunc(str, arr) {
  for (let idx = 0; idx < arr.length; idx++) {
    if (str.endsWith(arr[idx])) {
      return true;
    }
  }
  return false;
}

export async function importMap(dir, importsTo, importsFrom, styleImportsMap) {
  const absDir = dir;
  async function traverseDirectory(
    absDir,
    dir,
    importsTo,
    importsFrom,
    styleImportsMap
  ) {
    return new Promise((resolve, rejects) => {
      const files = fs.readdirSync(dir);
      files
        .filter((file) => !file.includes("node_modules"))
        .filter((file) => !file.includes("__tests__"))
        .filter((file) => !file.includes("tests"))
        .forEach(async (file) => {
          // console.log(file);
          const filePath = path.resolve(path.join(dir, file));
          // console.log(filePath)
          const stats = fs.statSync(filePath);
          if (stats.isDirectory()) {
            await traverseDirectory(
              absDir,
              filePath,
              importsTo,
              importsFrom,
              styleImportsMap
            );
          } else if (stats.isFile() && !filePath.includes(".d.ts")) {
            const extension = path.extname(filePath);
            if ([".ts"].includes(extension)) {
              //ts type code
              await scriptImports(absDir, filePath, importsTo, importsFrom, [
                "typescript",
              ]);
            } else if ([".tsx"].includes(extension)) {
              await scriptImports(absDir, filePath, importsTo, importsFrom, [
                "typescript",
                "jsx",
              ]);
            } else if ([".js", ".jsx"].includes(extension)) {
              //js code
              await scriptImports(absDir, filePath, importsTo, importsFrom, [
                "jsx",
              ]);
            } else if ([".css", ".scss", ".less"].includes(extension)) {
              // stylesheets
              await styleImports(filePath, styleImportsMap);
            }
          }
        });
      resolve();
    });
  }
  await traverseDirectory(absDir, dir, importsTo, importsFrom, styleImportsMap);
  return;
}

function syncResolveStyles(fileDir, match) {
  const myResolve = resolve.create.sync({
    preferRelative: true,
    // or resolve.create.sync
    // allowlist: [/\.css$/,/\.scss$/],
    extensions: [".css", ".scss", ".less"],
    // see more options below
  });
  try {
    const result = myResolve(fileDir, match);
    // console.log(result);
    return result;
  } catch (error) {
    // console.log("Error");
    return null;
  }
}

async function styleImports(filePath, styleImportsMap) {
  return new Promise((res, rej) => {
    const content = fs.readFileSync(filePath, "utf-8");
    // const styleImports = [];
    let match;
    const fileDir = path.dirname(filePath);

    const styleImportRegex1 = /@import\s.*?['"](.+?)['"];/g;
    const styleImportRegex2 = /@import\surl\(.*?['"](.+?)['"]\);/g;
    //module imports
    while ((match = styleImportRegex1.exec(content))) {
      const result = syncResolveStyles(fileDir, match[1]);
      if (result) {
        if (!(result in styleImportsMap)) {
          styleImportsMap[result] = [];
        }
        styleImportsMap[result].push(filePath);
      }
    }
    //Partial imports
    while ((match = styleImportRegex2.exec(content))) {
      const result = syncResolveStyles(fileDir, match[1]);
      if (result) {
        if (!(result in styleImportsMap)) {
          styleImportsMap[result] = [];
        }
        styleImportsMap[result].push(filePath);
      }
    }
    const absPath =
      "/Users/naman.jain1/Documents/testinng-repos/mattermost-webapp/sass";
    //Need to write imports due to webpack config
    res();
  });
}

async function scriptImports(
  absDir,
  filePath,
  importsTo,
  importsFrom,
  pluginArr
) {
  return new Promise((res, rej) => {
    if (!(filePath in importsFrom)) {
      importsFrom[filePath] = {};
      importsFrom[filePath]["scripts"] = [];
      importsFrom[filePath]["styles"] = [];
    }
    const content = fs.readFileSync(filePath, "utf8");
    let fileDir = path.dirname(filePath);
    const ast = parser.parse(content, {
      sourceType: "module",
      plugins: pluginArr,
    });
    traverse(ast, {
      CallExpression(pathAST) {
        const { node } = pathAST;
        if (node.callee.type === "Import" && node.arguments[0].value) {
          const str = node.arguments[0].value;
          resolveFunction(
            str,
            fileDir,
            filePath,
            importsFrom,
            importsTo,
            absDir
          );
        }
      },
    });
    if (
      endsWithFunc(filePath, ["index.ts", "index.tsx", "index.js", "index.jsx"])
    ) {
      traverse(ast, {
        ExportNamedDeclaration(pathAST) {
          const { node } = pathAST;
          if (node.source) {
            const str = node.source.value;
            resolveFunction(
              str,
              fileDir,
              filePath,
              importsFrom,
              importsTo,
              absDir
            );
          }
        },
      });
    }
    traverse(ast, {
      ImportDeclaration(pathAST) {
        const { node } = pathAST;
        const str = node.source.value;
        resolveFunction(str, fileDir, filePath, importsFrom, importsTo, absDir);
      },
    });
    res();
  });
}

// function syncResolveScripts()

async function resolveFunction(
  str,
  fileDir,
  filePath,
  importsFrom,
  importsTo,
  absDir
) {
  // console.log(str);
  //relative path
  const absPath = absDir;
  let result;
  try {
    //relative path
    result = resolver(fileDir, str);
    // console.log(result);
    await addToObject(filePath, result, importsFrom, importsTo);
    return;
  } catch (error) {
    try {
      //relative path with changes
      result = resolver(fileDir, "./" + str);
      await addToObject(filePath, result, importsFrom, importsTo);
      return;
    } catch (error) {
      try {
        //absolute path
        result = resolver(absPath, "./" + str);
        await addToObject(filePath, result, importsFrom, importsTo);
        return;
      } catch (error) {
        try {
          //Alias path
          const keys = Object.keys(alias);
          const answer = startsWithFunc(str, keys);
          result = resolver(absPath, "./" + newStr);
          await addToObject(filePath, result, importsFrom, importsTo);
          return;
        } catch (error) {
          return;
        }
      }
    }
  }

  // resolver(fileDir, str, async (err, result) => {
  //   if (!err && !result.includes("node_modules")) {
  //     await addToObject(filePath, result, importsFrom, importsTo);
  //   } else if (err) {
  //     resolver(fileDir, "./" + str, async (err, result) => {
  //       if (!err && !result.includes("node_modules")) {
  //         await addToObject(filePath, result, importsFrom, importsTo);
  //       } else if (err) {
  //         const absPath = absDir;
  //         //Direct path
  //         resolver(absPath, "./" + str, async (err, result) => {
  //           if (!err && !result.includes("node_modules")) {
  //             await addToObject(filePath, result, importsFrom, importsTo);
  //           } else if (err) {
  //             //Alias resolver
  //             const keys = Object.keys(alias);
  //             const answer = startsWithFunc(str, keys);
  //             if (answer) {
  //               const newStr = str.replace(answer, alias[answer]);
  //               resolver(absPath, "./" + newStr, async (err, result) => {
  //                 if (!err && !result.includes("node_modules")) {
  //                   await addToObject(filePath, result, importsFrom, importsTo);
  //                 }
  //               });
  //             }
  //           }
  //         });
  //       }
  //     });
  //   }
  // });
  // console.log(filePath);
}
