import fs, { statSync } from "fs";
import path from "path";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;


function calculateImportTree(filePath, map) {
  const content = fs.readFileSync(filePath, "utf8");
  const fileDir = path.dirname(filePath);
  const ast = parser.parse(content, {
    sourceType: "module",
    plugins: ["jsx","typescript"],
  });
  traverse(ast, {
    ImportDeclaration(pathAST) {
      const { node } = pathAST;
      const str = node.source.extra.rawValue;
      const extension = path.extname(filePath);
      const temp = path.join(fileDir, str);
      
      // console.log(temp);
      if (str.startsWith("./") || str.startsWith("../")) {
        // console.log(temp);
        fs.access(temp,fs.R_OK ,(err) => {
          if(!err)
          {
            const stats = fs.statSync(temp);
            if(stats.isDirectory())
            {
                //need to write index.js code
            }
            else if(stats.isFile())
            {
              if(temp.endsWith(".js") || temp.endsWith(".jsx") || temp.endsWith(".ts")  || temp.endsWith(".tsx"))
              {
                if (!(temp in map)) {
                  map[temp] = [];
                  map[temp].push(filePath);
                } else {
                  map[temp].push(filePath);
                }
              }
            }
          }
          else{
            const extensionArray = [".js",".jsx", ".ts",".tsx"];
            extensionArray.forEach(ext => {
              fs.access(temp,fs.R_OK ,(err) => {
                  if(!err)
                  {
                    console.log(filePath + "    ->    " + temp); 
                  }
              });

            })
          }
        })
      }

    },
  });
}

//will get the src as the input

// const dir = "../../../testinng-repos/project_modern_ui_ux_gpt3/src/App.js";

const dir = "../../../testinng-repos/project_modern_ui_ux_gpt3/src/containers/features/Features.jsx";
let arr = [];
calculateImportTree(path.resolve(dir), arr);
console.log(arr);
