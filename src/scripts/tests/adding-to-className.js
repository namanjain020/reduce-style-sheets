import fs from "fs";
import path from "path";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";
import _generator from "@babel/generator";
const __dirname = path.resolve();
const generator = _generator.default;
const traverse = _traverse.default;

let global = {};
let changedClass = [];
//will get the src as the input
export function addToClassName(dir, obj) {
  // console.log("hello");
  const files = fs.readdirSync(dir);
  //Recursive function
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      addToClassName(filePath, obj);
    } else if (stats.isFile()) {
      const extension = path.extname(filePath);
      if ([".js", ".jsx", ".ts", ".tsx"].includes(extension)) {
        helper(filePath, obj);
      }
    }
  });
  return changedClass;
}

function helper(filePath, obj) {
  const content = fs.readFileSync(filePath, "utf8");
  const ast = parser.parse(content, {
    sourceType: "module",
    plugins: ["jsx"],
  });

  traverse(ast, {
    JSXAttribute(path) {
      // console.log("Hello");
      // Using AST notation we can grab the className attribut for all the react tags
      if (
        path.node.name.name === "className" &&
        path.node.value.type === "StringLiteral"
      ) {
        let baseString = path.node.value.value;
        const arr = baseString.split(" ");
        arr.forEach((el) => {
          if (!(el in global)) {
            if (obj[el] && obj[el]["tailwind"] && obj[el]["raw"] === null) {
              
              baseString = baseString + " " + obj[el]["tailwind"];
              changedClass.push(el);
              const comment = {
                type:'CommentLine',
                value:`SCRIPT: ${el} class has been converted to util classes`
              }
              console.log(baseString);
              path.node.trailingComments = [comment];
            }
            global[el] = "hello";
          }
          path.node.value.value = baseString;
        });
      }
    },
  });
  //Uncomment below two lines to update js files
  const modCode = generator(ast).code;
  fs.writeFileSync(filePath, modCode);
}

