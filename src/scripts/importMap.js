//checking import functionality
import fs from "fs";
import path from "path";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";
import resolve from "enhanced-resolve";
const traverse = _traverse.default;


export async function importMap(dir, importsTo, importsFrom, styleImportsMap) {
  function traverseDirectory(dir, importsTo, importsFrom, styleImportsMap) {
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
  const absDir = path.resolve(
    "../../../../testinng-repos/mattermost-webapp-copy"
  );
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
        extensions: [".js", ".json", ".node", ".jsx", ".ts", ".tsx"],
      });
      //alias resolver
      const resolver1 = resolve.create({
        extensions: [".js", ".json", ".node", ".jsx", ".ts", ".tsx"],
        alias: {
          "@mattermost/client": "packages/client/src",
          "@mattermost/components": "packages/components/src",
          "@mattermost/types/*": "packages/types/src/*",
          "mattermost-redux/*": "packages/mattermost-redux/src/*",
          "reselect": "packages/reselect/src",
          "@mui/styled-engine": "node_modules/@mui/styled-engine-sc",
          "!!file-loader*": "utils/empty-string",
          "@e2e-support/*": "e2e/playwright/support/*",
          "@e2e-test.config": "e2e/playwright/test.config.ts",
        },
      });
      // /Users/naman.jain1/Documents/testinng-repos/mattermost-webapp-copy/packages/mattermost-redux/src/actions/errors.ts
      // if(str.startsWith("mattermost"))
      // {
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
        resolver(fileDir, "./"+str, (err, result) => {
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
      
    },
  });
}
