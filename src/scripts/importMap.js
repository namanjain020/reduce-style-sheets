//checking import functionality
import fs from "fs";
import path from "path";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";
import resolve from "enhanced-resolve";
const traverse = _traverse.default;

// async function resolveFilePath(filePath, extensions) {
//   let temp = "cancel";
//   for (const ext of extensions) {
//     const fileWithExt = filePath + ext;

//     fs.access(fileWithExt, fs.R_OK, (err) => {
//       if (!err) {
//         // console.log(fileWithExt);
//         temp = fileWithExt;
//       }
//     });
//   }
//   console.log(temp);
//   return temp;
// }

// const styleImportRegex = /@import\s.*?['"](.+?)['"];/g;
export async function importMap(dir, importsTo, importsFrom, styleImportsMap) {
  function traverseDirectory(dir, importsTo, importsFrom, styleImportsMap) {
    const files = fs.readdirSync(dir);
    files
      .filter((file) => !file.includes("__tests__"))
      .forEach((file) => {
        // console.log(file);
        const filePath = path.resolve(path.join(dir, file));
        // console.log(filePath)
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          // const temp =filePath.substring(filePath.lastIndexOf('/')+1);
          // if(temp!== "assets")
          // {
          traverseDirectory(filePath, importsTo, importsFrom, styleImportsMap);
          // }
        } else if (stats.isFile() && !filePath.includes(".d.ts")) {
          const extension = path.extname(filePath);
          if ([".ts"].includes(extension)) {
            //ts type code
            scriptImports(filePath, importsTo, importsFrom, ["typescript"]);
          } else if ([".tsx"].includes(extension)) {
            scriptImports(filePath, importsTo, importsFrom, [
              "typescript",
              "jsx",
            ]);
          } else if ([".js", ".jsx"].includes(extension)) {
            //js code
            scriptImports(filePath, importsTo, importsFrom, ["jsx"]);
          } else if ([".css", ".scss", ".less"].includes(extension)) {
            // stylesheets
            styleImports(filePath, styleImportsMap);
          }
          // } else if ([".css", ".scss", ".less"].includes(extension)) {
          //   importsTotylesFromStyles(filePath, importsTo, importsFrom);
          // }
        }
      });
  }
  traverseDirectory(dir, importsTo, importsFrom, styleImportsMap);
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
  while ((match = styleImportRegex1.exec(content))) {
    // console.log(match[1]);
    myResolve(fileDir, match[1], (err, result) => {
      if (err) {
        // console.log(err);
      } else {
        if (!(result in styleImportsMap)) {
          styleImportsMap[result] = [];
        }
        styleImportsMap[result].push(filePath);
        // console.log(result);
        // console.log(result);
      }
    });
  }
  while ((match = styleImportRegex2.exec(content))) {
    // console.log(match[1]);
    myResolve(fileDir, match[1], (err, result) => {
      if (err) {
        // console.log(err);
      } else {
        if (!result in styleImportsMap) {
          styleImportsMap[result].push(filePath);
        }
      }
    });
  }
}

function scriptImports(filePath, importsTo, importsFrom, pluginArr) {
  const content = fs.readFileSync(filePath, "utf8");
  const fileDir = path.dirname(filePath);
  const ast = parser.parse(content, {
    sourceType: "module",
    plugins: pluginArr,
  });
  traverse(ast, {
    ImportDeclaration(pathAST) {
      const { node } = pathAST;
      const str = node.source.extra.rawValue;
      const resolver = resolve.create({});
      //alias resolver
      //   const resolver = resolve.create({
      //     preferRelative:true,
      //     alias: {
      //       "@mattermost/client": "packages/client/src",
      //       "@mattermost/components": "packages/components/src",
      //       "@mattermost/types/*": "packages/types/src/*",
      //       "mattermost-redux/*": "packages/mattermost-redux/src/*",
      //       "reselect": "packages/reselect/src",
      //       "@mui/styled-engine": "./node_modules/@mui/styled-engine-sc",
      //       "!!file-loader*": "utils/empty-string",
      //       "@e2e-support/*": "e2e/playwright/support/*",
      //       "@e2e-test.config": "e2e/playwright/test.config.ts",
      //   }
      // });
      resolver(fileDir, str, (err, result) => {
        if (!err && !result.includes("node_modules")) {
          //importsFrom
          if (!(filePath in importsFrom)) {
            importsFrom[filePath] = {};
            importsFrom[filePath]["scripts"] = [];
            importsFrom[filePath]["styles"] = [];
          }
          if (
            result.endsWith(".js") ||
            result.endsWith(".jsx") ||
            result.endsWith(".ts") ||
            result.endsWith(".tsx")
          ) {
            importsFrom[filePath]["scripts"].push(result);
          } else if (
            result.endsWith(".css") ||
            result.endsWith(".scss") ||
            result.endsWith(".less")
          ) {
            importsFrom[filePath]["styles"].push(result);
          }

          //importsTo
          if (
            result.endsWith(".js") ||
            result.endsWith(".jsx") ||
            result.endsWith(".ts") ||
            result.endsWith(".tsx") ||
            result.endsWith(".css") ||
            result.endsWith(".scss") ||
            result.endsWith(".less")
          ) {
            if (!(result in importsTo)) {
              importsTo[result] = [];
            }
            importsTo[result].push(filePath);
          }
        }
      });
      // const tsconfigDir = "../../../../testinng-repos/mattermost-webapp";
      // resolver(tsconfigDir, str, (err, result) => {
      //   if (!err && !result.includes("node_modules")) {
      //     if (!(filePath in importsFrom)) {
      //       importsFrom[filePath] = [];
      //     }
      //     importsFrom[filePath].push(result);
      //     if (!(result in importsTo)) {
      //       importsTo[result] = [];
      //     }
      //     importsTo[result].push(filePath);
      //   }
      //   else if(str.includes("@")){
      //     console.log(err);
      //   }
      // });
    },
  });
}

// function importsTotylesFromStyles(filePath, importsTo, importsFrom) {
//   const content = fs.readFileSync(filePath, "utf-8");
//   const styleimportsTo = [];
//   let match;
//   while ((match = styleImportRegex.exec(content))) {
//     const temp = path.join(path.dirname(filePath), match[1]);
//     // console.log(temp);
//     const resolvedPath = resolveFilePath(temp, ["", ".css", ".scss", ".less"]);
//     if (resolvedPath) {
//       if (!(temp in map)) {
//         importsTo[temp] = [];
//         imp[temp].push(filePath);
//       } else {
//         map[temp].push(filePath);
//       }
//       if (!(filePath in map)) {
//         map[filePath] = [];
//         map[filePath].push(temp);
//       } else {
//         map[filePath].push(temp);
//       }
//     }
//   }
//   // return styleimportsTo;
// }

function importsTotylesFromScripts(filePath, importsTo, importsFrom) {
  const content = fs.readFileSync(filePath, "utf8");
  const fileDir = path.dirname(filePath);
  const ast = parser.parse(content, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
  traverse(ast, {
    ImportDeclaration(pathAST) {
      const { node } = pathAST;
      const str = node.source.extra.rawValue;
      const cssPath = path.join(fileDir, str);
      const extension = path.extname(cssPath);
      if ([".css", ".scss", ".less"].includes(extension)) {
        if (!(cssPath in importsTo)) {
          importsTo[cssPath] = [];
          importsTo[cssPath].push(filePath);
        } else {
          importsTo[cssPath].push(filePath);
        }
        // if (!(filePath in importsTo)) {
        //   importsFrom[filePath] = [];
        //   importsFrom[filePath].push(importPath);
        // } else {
        //   importsFrom[filePath].push(importPath);
        // }
      }
    },
  });
}

function importsTocriptsFromScripts(filePath, importsTo, importsFrom) {
  const content = fs.readFileSync(filePath, "utf8");
  const fileDir = path.dirname(filePath);
  const ast = parser.parse(content, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
  traverse(ast, {
    ImportDeclaration(pathAST) {
      const { node } = pathAST;
      const str = node.source.extra.rawValue;
      const importPath = path.join(fileDir, str);
      const extension = path.extname(importPath);
      // console.log(temp);
      if (str.startsWith("./") || str.startsWith("../")) {
        // console.log(temp);
        fs.access(importPath, fs.R_OK, (err) => {
          if (!err) {
            const stats = fs.statSync(importPath);
            if (stats.isDirectory()) {
              //need to write index.js code
            } else if (stats.isFile()) {
              if ([".js", ".jsx", ".ts", "tsx"].includes(extension)) {
                // console.log(importPath + "  importsFrom in   " + filePath);
                if (!(filePath in importsFrom)) {
                  importsFrom[filePath] = [];
                  importsFrom[filePath].push(importPath);
                } else {
                  importsFrom[filePath].push(importPath);
                }
                // console.log(importsFrom[filePath]);
              }
            }
          } else {
            let resolvedPath = null;
            for (const ext of ["", ".js", ".jsx", ".ts", ".tsx"]) {
              const resolvedPath = importPath + ext;
              if (fs.existsSync(resolvedPath)) {
                if (!(filePath in importsFrom)) {
                  importsFrom[filePath] = [];
                  importsFrom[filePath].push(resolvedPath);
                } else {
                  importsFrom[filePath].push(resolvedPath);
                }
              }
            }
          }
        });
      }
    },
  });
}

// let importsTo = {};
// let importsFrom = {};
// const dir = "../../../testinng-repos/space-tourism/src";
// importMap(dir, importsTo, importsFrom);
// //Yeh kis kis ko import karta hai
// console.log("importsTo");
// console.log(importsTo);
// setTimeout(() => {
//   console.log("importsFrom");
//   console.log(importsFrom);
// }, 2000);
//yeh kis kis ke paas importsFrom hai

// fs.writeFileSync("./createdLogs/styleimportsTo.json", JSON.stringify(obj));
