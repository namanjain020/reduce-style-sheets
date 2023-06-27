//checking import functionality
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
  traverse(ast, {
    ImportDeclaration(path) {
      // const { node } = path;
      const string =path.node.source.extra.rawValue;
      console.log(string.split('\\').pop().split('/').pop())
      // Using AST notation we can grab the className attribut for all the react tags
      //   console.log(path.node.value.value);
      // if(path.node.openingElement)
      // {
      //     console.log(path.node.openingElement);
      // }
    //   console.log(node.openingElement.name.name);
    // if(stack.length()===0 )
    // {
    //     stack.push(node.openingElement.name.name);
    //     // console.log()
    // }
    // else if(node.clo)
    // {
    // }
      // if (node.openingElement.name.name === "div") {
      //   const attr = node.openingElement.attributes;
      //   attr.forEach(att => console.log(att.name.name))
      // }
      
      // console.log(node.openingElement.name.name);
      // console.log(node.closingElement.name.name)
      // if (node) {
      //     // Check if the parent JSX element is also a <div>
      //     const parentJSXElement = path.findParent(p => p.isJSXElement());
      //     if (!parentJSXElement || parentJSXElement.node.openingElement.name.name !== 'div') {
      //     //   topLevelDivs.push(node);
      //     console.log(node.name.name)
      //     }
      //   }

      // console.log(path.node.openingElement);
    //   console.log("kuch bhi ");
      //   if (
      //     path.node.attribute
      //     // path.node.name.name === "div"
      //   ) {
      //     console.log(path.node.attribute)
      //     // const classNamesString = path.node.value.value;
      //     // const classNamesArray = classNamesString.split(" ");
      //     // classNamesArray.forEach((className) => classNames.add(className));
      //     // counter++;
      //   }
    },
    // CallExpression(path) {
    //   const { node } = path;
    //   if (
    //     node.callee.property &&
    //     node.callee.property.name === "add" &&
    //     node.arguments.length === 1 &&
    //     node.arguments[0].type === "StringLiteral"
    //   ) {
    //     // Extract the dynamically added CSS class
    //     const dynamicClassName = node.arguments[0].value.trim();

    //     // Add the dynamic class name to the list
    //     if (dynamicClassName) {
    //       classNames.add(dynamicClassName);
    //     }
    //   }
    // },
  });
  //   console.log(classNames);
  return Array.from(classNames);
}

const dir = "../../../testinng-repos/project_modern_ui_ux_gpt3/src/App.js";
// console.log("THE BEGIN");
// parsingJSFiles(dir);
// console.log();
extractImportDeclaration(dir);
