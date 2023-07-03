//checking import functionality
import fs from "fs";
import path from "path";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";
import resolve from "enhanced-resolve";
const traverse = _traverse.default;

const alias = {
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
          traverseDirectory(filePath, importsTo, importsFrom, styleImportsMap);
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

function scriptImports(filePath, importsTo, importsFrom, pluginArr) {
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
    ImportDeclaration(pathAST) {
      const { node } = pathAST;
      const str = node.source.value;
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
            }
          });
        }
      });

      const absPath =
        "/Users/naman.jain1/Documents/testinng-repos/mattermost-webapp/";
      //Direct path
      resolver(absPath, "./" + str, (err, result) => {
        if (!err && !result.includes("node_modules")) {
          addToObject(filePath, result, importsFrom, importsTo);
        }
      });

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
    },
  });
}
