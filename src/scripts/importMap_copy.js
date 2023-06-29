//checking import functionality
import fs from "fs";
import path from "path";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";
import resolve from "enhanced-resolve";
// import postcss from "postcss";
// import postcssImport from "postcss-import";
// import postcssScss from "postcss-scss";
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

export async function importMap(dir, imports, exported) {
  function traverseDirectory(dir, map) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.resolve(path.join(dir, file));
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        const temp = filePath.substring(filePath.lastIndexOf("/") + 1);
        if (temp !== "assets") {
          traverseDirectory(filePath, imports, exported);
        }
      } else if (stats.isFile()) {
        const extension = path.extname(filePath);
        if ([".ts"].includes(extension)) {
          console.log(filePath);
          importStylesFromScripts(filePath, imports, exported);
          // importScriptsFromScripts(filePath, imports, exported);
        } 
        // else if ([".css", ".scss", ".less"].includes(extension)) {
        //   // console.log(filePath);
        //   importStylesFromStyles(filePath, imports, exported);
        // }
      }
    });
  }
  traverseDirectory(dir, imports, exported);
}

function importStylesFromStyles(filePath, imports, exported) {
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
        console.log(result);
      }
    });
  }
  while ((match = styleImportRegex2.exec(content))) {
    // console.log(match[1]);
    myResolve(fileDir, match[1], (err, result) => {
      if (err) {
        // console.log(err);
      } else {
        console.log(result);
      }
    });
  }
}

function importStylesFromScripts(filePath, imports, exported) {
  const content = fs.readFileSync(filePath, "utf8");
  const fileDir = path.dirname(filePath);
  const ast = parser.parse(content, {
    sourceType: "module",
    plugins: ["typescript"],
  });
  traverse(ast, {
    ImportDeclaration(pathAST) {
      const { node } = pathAST;
      const str = node.source.extra.rawValue;

      // const cssPath = path.join(fileDir, str);
      // const extension = path.extname(cssPath);
      // resolve(fileDir, str, (err, result) => {
      //   if (err) {
      //     // console.log(err);
      //   } else {
      //     if (!(filePath in exported)) {
      //       exported[filePath] = [];
      //     }
      //     exported[filePath].push(result);
      //     if (!(result in imports)) {
      //       imports[result] = [];
      //     }
      //     imports[result].push(filePath);
      //   }
      // });
    },
  });
}

function importScriptsFromScripts(filePath, imports, exported) {
  const content = fs.readFileSync(filePath, "utf8");
  const fileDir = path.dirname(filePath);
  const ast = parser.parse(content, {
    sourceType: "module",
    plugins: [ "typescript"],
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
                // console.log(importPath + "  exported in   " + filePath);
                if (!(filePath in exported)) {
                  exported[filePath] = [];
                  exported[filePath].push(importPath);
                } else {
                  exported[filePath].push(importPath);
                }
                // console.log(exported[filePath]);
              }
            }
          } else {
            let resolvedPath = null;
            for (const ext of ["", ".js", ".jsx", ".ts", ".tsx"]) {
              const resolvedPath = importPath + ext;
              if (fs.existsSync(resolvedPath)) {
                if (!(filePath in exported)) {
                  exported[filePath] = [];
                  exported[filePath].push(resolvedPath);
                } else {
                  exported[filePath].push(resolvedPath);
                }
              }
            }
          }
        });
      }
    },
  });
}

let imports = {};
let exported = {};
const dir = "../../../../testinng-repos/space-tourism/src";

importMap(dir, imports, exported);
//Yeh kis kis ko import karta hai

setTimeout(() => {
  console.log("IMPORTS");
  // console.log(imports);
  console.log("exported");
  // console.log(exported);
}, 3000);
// yeh kis kis ke paas exported hai

// fs.writeFileSync("./createdLogs/styleImports.json", JSON.stringify(obj));
