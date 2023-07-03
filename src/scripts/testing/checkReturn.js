//checking return functionality
import fs from "fs";
import path from "path";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";
const __dirname = path.resolve();
const traverse = _traverse.default;
let counter = 0;
//Class array
let classNames = [];

//will get the src as the input
// export function parsingJSFiles(dir) {
//   const files = fs.readdirSync(dir);

//   //Recursive function
//   files.forEach((file) => {
//     const filePath = path.join(dir, file);
//     const stats = fs.statSync(filePath);

//     if (stats.isDirectory()) {
//       parsingJSFiles(filePath);
//     } else if (stats.isFile()) {
//       const extension = path.extname(filePath);
//       if ([".js", ".jsx", ".ts", ".tsx"].includes(extension)) {
//         classNames.push(extractClassNamesFromFile(filePath));
//       }
//     }
//   });
//   //return array
//   return classNames.flat();
// }

function extractImportDeclaration(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const classNames = new Set();
  const ast = parser.parse(content, {
    sourceType: "module",
    plugins: ["jsx"],
  });

  let stack = [];
  function recursion(node) {
    stack.push(node.openingElement.name.name);
    console.log(stack);
    if (node.children) {
      node.children.forEach((child) => {
        if (child.type === "JSXElement") {
          recursion(child);
        }
      });
    }
    stack.pop();
  }

  traverse(ast, {
    ArrowFunctionExpression(path) {
      const { node } = path;
      if (node.body.type === "JSXElement") {
        recursion(node.body);
      }
    },
  });
  //   console.log(classNames);
  return Array.from(classNames);
}

const dir =
  "../../../testinng-repos/project_modern_ui_ux_gpt3/src/containers/header/Header.jsx";
// console.log("THE BEGIN");
// parsingJSFiles(dir);
// console.log();
extractImportDeclaration(dir);
