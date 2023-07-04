//checking import functionality
import fs from "fs";
import path from "path";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";
import resolve from "enhanced-resolve";
const traverse = _traverse.default;

const alias = {
  "@/": "./",
  "@space/": "../../apps/spr-main-web/src/",
  "@space/i18n/": "../../apps/spr-main-web/i18n/*",
  "rules/": "../../apps/spr-main-web/src/rules/*",
  "@space/core/": "../../apps/spr-main-web/src/core/*",
  "types/*": "../../apps/spr-main-web/src/types/*",

  "@space/typings/": "../../apps/spr-main-web/src/typings/*",
  "@space/client/*": ["../../apps/spr-main-web/src/client/*"],
  "@space/modules/*": ["../../apps/spr-main-web/src/modules/*"],

  "@space/virality-app/*": ["../../apps/spr-main-web/src/virality-app/*"],
  "core/*": ["../../apps/spr-main-web/src/core/*"],

  "typings/*": ["../../apps/spr-main-web/src/typings/*"],
  "modules/*": ["../../apps/spr-main-web/src/modules/*"],
  "i18n/*": ["../../apps/spr-main-web/i18n/*"],
  "src/*": ["../../apps/spr-main-web/src/*"],
  "spr-space/*": ["../spr-space/*"],
  "spr-base/*": ["../spr-base/*"],
  "spr-main-web/*": ["../../apps/spr-main-web/*"],
  "@sprinklr/modules/*": ["../../packages/modules/src/*"],
  "@sprinklr/modules/src/*": "../../packages/modules/src/",

  "@space/": "../sprinklr-app-client/apps/spr-main-web/src/",
  "@sprinklr/modules": "../sprinklr-app-client/packages/modules/src/",
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

function addToObject(filePath, result, importsFrom, importsTo) {
  if (endsWithFunc(result, [".js", ".jsx", ".ts", ".tsx"])) {
    importsFrom[filePath]["scripts"].push(result);
  } else if (endsWithFunc(result, [".css", ".scss", ".less"])) {
    importsFrom[filePath]["styles"].push(result);
    if (!(result in importsTo)) {
      importsTo[result] = [];
    }
    importsTo[result].push(filePath);
  }
}

export async function importMap(dir, importsTo, importsFrom, styleImportsMap) {
  const absDir = dir;
  function traverseDirectory(
    absDir,
    dir,
    importsTo,
    importsFrom,
    styleImportsMap
  ) {
    const files = fs.readdirSync(dir);
    files
      .filter((file) => !file.includes("__tests__"))
      .filter((file) => !file.includes("tests"))
      .forEach((file) => {
        // console.log(file);
        const filePath = path.resolve(path.join(dir, file));
        // console.log(filePath)
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          traverseDirectory(
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
            scriptImports(absDir, filePath, importsTo, importsFrom, [
              "typescript",
            ]);
          } else if ([".tsx"].includes(extension)) {
            scriptImports(absDir, filePath, importsTo, importsFrom, [
              "typescript",
              "jsx",
            ]);
          } else if ([".js", ".jsx"].includes(extension)) {
            //js code
            scriptImports(absDir, filePath, importsTo, importsFrom, ["jsx"]);
          } else if ([".css", ".scss", ".less"].includes(extension)) {
            // stylesheets
            styleImports(filePath, styleImportsMap);
          }
        }
      });
  }
  traverseDirectory(absDir, dir, importsTo, importsFrom, styleImportsMap);
}

function styleImports(filePath, styleImportsMap) {
  const content = fs.readFileSync(filePath, "utf-8");
  // const styleImports = [];
  let match;
  const fileDir = path.dirname(filePath);
  const myResolve = resolve.create({
    preferRelative: true,
    // or resolve.create.sync
    // allowlist: [/\.css$/,/\.scss$/],
    extensions: [".css", ".scss", ".less"],
    // see more options below
  });
  const styleImportRegex1 = /@import\s.*?['"](.+?)['"];/g;
  const styleImportRegex2 = /@import\surl\(.*?['"](.+?)['"]\);/g;
  //module imports
  while ((match = styleImportRegex1.exec(content))) {
    myResolve(fileDir, match[1], (err, result) => {
      if (!err) {
        if (!(result in styleImportsMap)) {
          styleImportsMap[result] = [];
        }
        styleImportsMap[result].push(filePath);
      }
    });
  }
  //Partial imports
  while ((match = styleImportRegex1.exec(content))) {
    myResolve(fileDir, "_" + match[1], (err, result) => {
      if (!err) {
        if (!(result in styleImportsMap)) {
          styleImportsMap[result] = [];
        }
        styleImportsMap[result].push(filePath);
      }
    });
  }
  const absPath =
    "/Users/naman.jain1/Documents/testinng-repos/mattermost-webapp/sass";
  //Need to write imports due to webpack config
}

function scriptImports(absDir, filePath, importsTo, importsFrom, pluginArr) {
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
  traverse(ast,{
    CallExpression(pathAST) {
      const {node} =pathAST;
      if(node.callee.type === "Import" && node.arguments[0].value)
      {
        const str = node.arguments[0].value;
          // console.log(node.arguments[0].value);
          const resolver = resolve.create({
            extensions: [".js", ".json", ".node", ".jsx", ".ts", ".tsx"],
          });
          //relative path
          resolver(fileDir, str, (err, result) => {
            if (!err && !result.includes("node_modules")) {
              addToObject(filePath, result, importsFrom, importsTo);
            } else if (err) {
              resolver(fileDir, "./" + str, (err, result) => {
                if (!err && !result.includes("node_modules")) {
                  addToObject(filePath, result, importsFrom, importsTo);
                } else if (err) {
                  const absPath = absDir;
                  //Direct path
                  resolver(absPath, "./" + str, (err, result) => {
                    if (!err && !result.includes("node_modules")) {
                      addToObject(filePath, result, importsFrom, importsTo);
                    }else if(err){
                        //Alias resolver
                  const keys = Object.keys(alias);
                  const answer = startsWithFunc(str, keys);
                  if (answer) {
                    const newStr = str.replace(answer, alias[answer]);
                    resolver(absPath, "./" + newStr, (err, result) => {
                      if (!err && !result.includes("node_modules")) {
                        addToObject(filePath, result, importsFrom, importsTo);
                      }
                    });
                  }
                    }
                  });

                  
                }
              });
            }
          });
      }
    }
  })

  // if (
  //   endsWithFunc(filePath, ["index.ts", "index.tsx", "index.js", "index.jsx"])
  // ) {
  //   // console.log(filePath);
  //   traverse(ast, {
  //     ExportNamedDeclaration(pathAST) {
  //       const { node } = pathAST;
  //       if (node.source) {
  //         const str = node.source.value;
  //         const resolver = resolve.create({
  //           extensions: [".js", ".json", ".node", ".jsx", ".ts", ".tsx"],
  //         });
  //         //relative path
  //         resolver(fileDir, str, (err, result) => {
  //           if (!err && !result.includes("node_modules")) {
  //             addToObject(filePath, result, importsFrom, importsTo);
  //           } else if (err) {
  //             resolver(fileDir, "./" + str, (err, result) => {
  //               if (!err && !result.includes("node_modules")) {
  //                 addToObject(filePath, result, importsFrom, importsTo);
  //               } else if (err) {
  //                 const absPath = absDir;
  //                 //Direct path
  //                 resolver(absPath, "./" + str, (err, result) => {
  //                   if (!err && !result.includes("node_modules")) {
  //                     addToObject(filePath, result, importsFrom, importsTo);
  //                   }else if(err){
  //                       //Alias resolver
  //                 const keys = Object.keys(alias);
  //                 const answer = startsWithFunc(str, keys);
  //                 if (answer) {
  //                   const newStr = str.replace(answer, alias[answer]);
  //                   resolver(absPath, "./" + newStr, (err, result) => {
  //                     if (!err && !result.includes("node_modules")) {
  //                       addToObject(filePath, result, importsFrom, importsTo);
  //                     }
  //                   });
  //                 }
  //                   }
  //                 });

                  
  //               }
  //             });
  //           }
  //         });
  //       }
  //     },
  //   });
  // }

  // traverse(ast, {
  //   ImportDeclaration(pathAST) {
  //     const { node } = pathAST;
  //     const str = node.source.value;
  //     const resolver = resolve.create({
  //       extensions: [".js", ".json", ".node", ".jsx", ".ts", ".tsx"],
  //     });
  //     //relative path
  //     resolver(fileDir, str, (err, result) => {
  //       if (!err && !result.includes("node_modules")) {
  //         addToObject(filePath, result, importsFrom, importsTo);
  //       } else if (err) {
  //         resolver(fileDir, "./" + str, (err, result) => {
  //           if (!err && !result.includes("node_modules")) {
  //             addToObject(filePath, result, importsFrom, importsTo);
  //           }
  //         });
  //       }
  //     });

  //     const absPath =
  //       absDir;
  //     //Direct path
  //     resolver(absPath, "./" + str, (err, result) => {
  //       if (!err && !result.includes("node_modules")) {
  //         addToObject(filePath, result, importsFrom, importsTo);
  //       }
  //     });

  //     //Alias resolver
  //     const keys = Object.keys(alias);
  //     const answer = startsWithFunc(str, keys);
  //     if (answer) {
  //       const newStr = str.replace(answer, alias[answer]);
  //       resolver(absPath, "./" + newStr, (err, result) => {
  //         if (!err && !result.includes("node_modules")) {
  //           addToObject(filePath, result, importsFrom, importsTo);
  //         }
  //       });
  //     }
  //   },
  // });


}
