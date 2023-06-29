//checking import functionality
import fs from "fs";
import path from "path";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";
import resolve from "enhanced-resolve";
const traverse = _traverse.default;

async function resolveFilePath(filePath, extensions) {
  let temp = "cancel";
  for (const ext of extensions) {
    const fileWithExt = filePath + ext;

    fs.access(fileWithExt, fs.R_OK, (err) => {
      if (!err) {
        // console.log(fileWithExt);
        temp = fileWithExt;
      }
    });
  }
  console.log(temp);
  return temp;
}

const styleImportRegex = /@import\s.*?['"](.+?)['"];/g;
export async function importMap(dir, imports, imported) {
  function traverseDirectory(dir, map) {
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
          traverseDirectory(filePath, imports, imported);
          // }
        } else if (stats.isFile() && !filePath.includes(".d.ts")) {
          const extension = path.extname(filePath);
          if ([".ts"].includes(extension)) {
            //ts type code
            scriptImports(filePath, imports, imported, ["typescript"]);
          } else if ([".tsx"].includes(extension)) {
            scriptImports(filePath, imports, imported, ["typescript", "jsx"]);
          } else if ([".js", ".jsx"].includes(extension)) {
            //js code
            scriptImports(filePath, imports, imported, ["jsx"]);
          } else if ([".css", ".scss", ".less"]) {
            // stylesheets
          }
          // } else if ([".css", ".scss", ".less"].includes(extension)) {
          //   importStylesFromStyles(filePath, imports, imported);
          // }
        }
      });
  }
  traverseDirectory(dir, imports, imported);
}

function scriptImports(filePath, imports, imported, pluginArr) {
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
      const resolver = resolve.create({
        preferAbsolute:true,
        alias: {
          "@mattermost/client": "packages/client/src",
          "@mattermost/components": "packages/components/src",
          "@mattermost/types/*": "packages/types/src/*",
          "mattermost-redux/*": "packages/mattermost-redux/src/*",
          "reselect": "packages/reselect/src",
          "@mui/styled-engine": "./node_modules/@mui/styled-engine-sc",
          "!!file-loader*": "utils/empty-string",
          "@e2e-support/*": "e2e/playwright/support/*",
          "@e2e-test.config": "e2e/playwright/test.config.ts",
      }
    });
      resolver(fileDir, str, (err, result) => {
        if (!err && !result.includes("node_modules")) {
          if (!(filePath in imported)) {
            imported[filePath] = [];
          }
          imported[filePath].push(result);
          if (!(result in imports)) {
            imports[result] = [];
          }
          imports[result].push(filePath);
        }
      });
    },
  });
}

// function importStylesFromStyles(filePath, imports, imported) {
//   const content = fs.readFileSync(filePath, "utf-8");
//   const styleImports = [];
//   let match;
//   while ((match = styleImportRegex.exec(content))) {
//     const temp = path.join(path.dirname(filePath), match[1]);
//     // console.log(temp);
//     const resolvedPath = resolveFilePath(temp, ["", ".css", ".scss", ".less"]);
//     if (resolvedPath) {
//       if (!(temp in map)) {
//         imports[temp] = [];
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
//   // return styleImports;
// }

function importStylesFromScripts(filePath, imports, imported) {
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
        if (!(cssPath in imports)) {
          imports[cssPath] = [];
          imports[cssPath].push(filePath);
        } else {
          imports[cssPath].push(filePath);
        }
        // if (!(filePath in imports)) {
        //   imported[filePath] = [];
        //   imported[filePath].push(importPath);
        // } else {
        //   imported[filePath].push(importPath);
        // }
      }
    },
  });
}

function importScriptsFromScripts(filePath, imports, imported) {
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
                // console.log(importPath + "  imported in   " + filePath);
                if (!(filePath in imported)) {
                  imported[filePath] = [];
                  imported[filePath].push(importPath);
                } else {
                  imported[filePath].push(importPath);
                }
                // console.log(imported[filePath]);
              }
            }
          } else {
            let resolvedPath = null;
            for (const ext of ["", ".js", ".jsx", ".ts", ".tsx"]) {
              const resolvedPath = importPath + ext;
              if (fs.existsSync(resolvedPath)) {
                if (!(filePath in imported)) {
                  imported[filePath] = [];
                  imported[filePath].push(resolvedPath);
                } else {
                  imported[filePath].push(resolvedPath);
                }
              }
            }
          }
        });
      }
    },
  });
}

// let imports = {};
// let imported = {};
// const dir = "../../../testinng-repos/space-tourism/src";
// importMap(dir, imports, imported);
// //Yeh kis kis ko import karta hai
// console.log("IMPORTS");
// console.log(imports);
// setTimeout(() => {
//   console.log("IMPORTED");
//   console.log(imported);
// }, 2000);
//yeh kis kis ke paas imported hai

// fs.writeFileSync("./createdLogs/styleImports.json", JSON.stringify(obj));
