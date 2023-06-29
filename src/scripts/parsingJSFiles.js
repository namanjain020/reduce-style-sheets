import fs from "fs";
import path from "path";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";
const __dirname = path.resolve();
const traverse = _traverse.default;
let counter=0;
export function parsingJSFiles(dir,JSClasses) {
  const files = fs.readdirSync(dir);
  //Recursive function 
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      parsingJSFiles(filePath,JSClasses);
    } else if (stats.isFile()) {
      const extension = path.extname(filePath);
      if ([".js", ".jsx", ".ts", ".tsx"].includes(extension)) {
        const arr =extractClassNamesFromFile(filePath);
          if (!(filePath in JSClasses)) {
            JSClasses[filePath] = [];
            arr.forEach(el => JSClasses[filePath].push(el));
          } else {
            arr.forEach(el => JSClasses[filePath].push(el));
          }
      }
    }
  });
}

function extractClassNamesFromFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const classNames = new Set();
  const ast = parser.parse(content, {
    sourceType: "module",
    plugins: ["jsx","typescript"],
  });

  traverse(ast, {
    JSXAttribute(path) {
      // Using AST notation we can grab the className attribut for all the react tags
      if (
        path.node.name.name === "className" &&
        path.node.value.type === "StringLiteral"
      ) {
        const classNamesString = path.node.value.value;
        const classNamesArray = classNamesString.split(" ");
        classNamesArray.forEach((className) => classNames.add(className));
      }
    },
    CallExpression(path) {
      const { node } = path;
      if (
        node.callee.property && node.callee.property.name === 'add' &&
        node.arguments.length === 1 && node.arguments[0].type === 'StringLiteral'
      ) {
        // Extract the dynamically added CSS class
        const dynamicClassName = node.arguments[0].value.trim();
        
        // Add the dynamic class name to the list
        if (dynamicClassName) {
          classNames.add(dynamicClassName);
        }
      }
    }
  });
  return Array.from(classNames);
}
