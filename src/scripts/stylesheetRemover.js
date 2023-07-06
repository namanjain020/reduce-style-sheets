import fs from "fs";
import path from "path";
import postcss from "postcss";
import scss from "postcss-scss";

import parser from "@babel/parser";
import _traverse from "@babel/traverse";

import _generator from "@babel/generator";

const generator = _generator.default;
const traverse = _traverse.default;

const __dirname = path.resolve();
let absDir; 
let counterT = 0 ,counterF = 0;

export function stylesheetRemover(
  unresolvedDir,
  importsTo,
  styleImports,
  stylesheets
) {
  const dir = path.resolve(unresolvedDir);
  absDir = dir;
  const files = fs.readdirSync(dir);
  //Recursive function
  files
    .filter((file) => !file.includes("node_modules"))
    .filter((file) => !file.includes("__tests__"))
    .filter((file) => !file.includes("tests"))
    .filter((file) => !file.startsWith("_"))
    .forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        stylesheetRemover(filePath, importsTo, styleImports, stylesheets);
      } else if (stats.isFile()) {
        const extension = path.extname(filePath);
        if ([".css", ".scss", ".less"].includes(extension)) {
          const stats = fs.statSync(filePath);
          const fileSize = stats.size;
          //If file is empty delete the file and remove imports
          if (fileSize === 0) {
            console.log("Empty "+ filePath);
            // TO DO
            if (filePath in styleImports) {
              helper1();
            }
            if (filePath in importsTo) {
              helper2(filePath,importsTo);
            }
            // Uncomment when needed \\
            // fs.rmSync(filePath);
          }

          // If file is never imported remove
          if (!(filePath in styleImports) && !(filePath in importsTo)) {
            console.log("Non imported file "+ filePath);
            // Uncomment when needed \\
            // fs.rmSync(filePath);
          }
        }
      }
    });
}

function helper1() {}

function helper2(filePath ,importsTo) {
  // console.log("empty file "+filePath);
  const temp = filePath.replace(/^.*[\\\/]/, '');
  importsTo[filePath].forEach((file) => {
    let pluginArr;
    if (file.endsWith(".ts")) {
      pluginArr = ["typescript"];
    } else if (file.endsWith(".js") || file.endsWith(".jsx")) {
      pluginArr = ["jsx"];
    } else if (file.endsWith(".tsx")) {
      pluginArr = ["jsx", "typescript"];
    }
    const content = fs.readFileSync(file, "utf8");
    const ast = parser.parse(content, {
      sourceType: "module",
      plugins: pluginArr,
    });
    traverse(ast, {
      ImportDeclaration(pathAST) {
        const { node } = pathAST;
        const str = node.source.value;
        console.log(str);
        if(str.endsWith(temp))
        {
          pathAST.remove();
        }
      }  
    })
    const modCode = generator(ast).code;
    // Uncomment when needed \\
    // fs.writeFileSync(file, modCode);
  });
}
