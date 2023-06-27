import fs from "fs";
import path from "path";
const __dirname = path.resolve();
import parser from "@babel/parser";
import _traverse from "@babel/traverse";
import _generator from "@babel/generator";
const generator = _generator.default;
const traverse = _traverse.default;


//will get the src as the input
export function addToClassName(dir, obj) {
  // console.log(obj);
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
}

function helper(filePath, obj) {
  const content = fs.readFileSync(filePath, "utf8");
  // const classNames = new Set();
  const ast = parser.parse(content, {
    sourceType: "module",
    plugins: ["jsx"],
  });
//   let stack = [];
  traverse(ast, {
    JSXAttribute(path) {
        if (
            path.node.name.name === "className" &&
            path.node.value.type === "StringLiteral"
          ) {
            let baseString = path.node.value.value;
            const arr = baseString.split(" ");
            // let tempString = "";
            arr.forEach((el) => {
              // console.log(Object.keys(obj));
              // if(el.toString() in obj)
              // {
              //   console.log(el);
              // }
              // console.log(obj[el]);
              if (obj[el] && obj[el]["raw"] === null) {
                // console.log(obj[el]["tailwind"])
                baseString = baseString + obj[el]["tailwind"];
                // console.log(baseString)
              }
            });
            path.node.value.value = baseString;
            // console.log(baseString);
            // console.log(arr)
            // const classNamesString = path.node.value.value;
            // const classNamesArray = classNamesString.split(" ");
            // classNamesArray.forEach((className) => classNames.add(className));
          }
        const {node} = path;
      // Using AST notation we can grab the className attribut for all the react tags
      if(stack.length === 0 )
      {
        stack.push(node.openingElement.name.name);
      }
      else if(node.closingElement === stack[stack.length-1]){
        stack = stack.slice(0,-1);
      }
      else{
        stack.push(node.openingElement.name.name);
      }
      console.log(stack);
    //   if (
    //     path.node.name.name === "className" &&
    //     path.node.value.type === "StringLiteral"
    //   ) {
    //     let baseString = path.node.value.value;
    //     const arr = baseString.split(" ");
    //     // let tempString = "";
    //     arr.forEach((el) => {
    //       // console.log(Object.keys(obj));
    //       // if(el.toString() in obj)
    //       // {
    //       //   console.log(el);
    //       // }
    //       // console.log(obj[el]);
    //       if (obj[el] && obj[el]["raw"] === null) {
    //         // console.log(obj[el]["tailwind"])
    //         baseString = baseString.replace(el, obj[el]["tailwind"]);
    //         // console.log(baseString)
    //       }
    //     });
    //     path.node.value.value = baseString;
    //     // console.log(baseString);
    //     // console.log(arr)
    //     // const classNamesString = path.node.value.value;
    //     // const classNamesArray = classNamesString.split(" ");
    //     // classNamesArray.forEach((className) => classNames.add(className));
    //   }
    },
  });

  //Uncomment below two lines to update js files
  // const modCode = generator(ast).code;
  // fs.writeFileSync(filePath, modCode);
  // return Array.from(classNames);
}

const dir = "../../../testinng-repos/breaking-bad-cast/src";

const obj = JSON.parse(fs.readFileSync("./logs/tailwindClasses.json", "utf8"));
addToClassName(dir, obj);

// import fs from "fs";
// import path from "path";
// const __dirname = path.resolve();
// import parser from "@babel/parser";
// import _traverse from "@babel/traverse";
// import _generator from "@babel/generator";
// const traverse = _traverse.default;
// const generator = _generator.default;

// export function test(dir) {
//   console.log("parsing JS Files");
//   // Usage example
//   let directoryPath = path.join(__dirname, dir + "/src/pages");
//   // const filePath = directoryPath;
//   let fileNames = fs.readdirSync(directoryPath);
//   // console.log(fileNames);

//   console.log("Files scanned");
//   let classNames = [];
//   fileNames.forEach((file) => {
//     console.log(file);
//     classNames.push(extractClassNamesFromFile(directoryPath + `/${file}`));
//   });
//   // let classNames = [];
//   // for (file of fileNames) {
//   //   classNames.push(extractClassNamesFromFile(directoryPath + `/${file}`));
//   // }
//   directoryPath = path.join(__dirname, dir + "/src/components");
//   fileNames = fs.readdirSync(directoryPath);
//   fileNames.forEach((file) => {
//     console.log(file);
//     classNames.push(extractClassNamesFromFile(directoryPath + `/${file}`),"str");
//   });
//   classNames = classNames.flat();
//   const classSet = new Set(classNames);
//   // classSet.add(classNames);
//   // console.log(classSet);
//   // console.log(typeof classSet);
//   return classSet;
// }

// function extractClassNamesFromFile(filePath,newClass) {
//   const content = fs.readFileSync(filePath, "utf8");

//   //   const classNames = new Set();
//   const ast = parser.parse(content, {
//     sourceType: "module",
//     plugins: ["jsx"],
//   });

//   traverse(ast, {
//     JSXAttribute(path) {
//       if (
//         path.node.name.name === "className" &&
//         path.node.value.type === "StringLiteral"
//       ) {
//         const str = path.node.value.value;
//         const str2 = str + " " + newClass;
//         // str = str.concat(str2);
//         path.node.value.value = str2;
//       }
//     },
//   });
//   const modifiedCode = generator(ast).code;
//   fs.writeFileSync(filePath, modifiedCode);
//   //   return Array.from(classNames);
// }

// extractClassNamesFromFile(
//   "../multipage-coffee-shop-site-reactjs/src/pages/Home.js"
// ,"str");

// parsingJSFiles('../multipage-coffee-shop-site-reactjs')
