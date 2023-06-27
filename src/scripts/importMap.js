//checking import functionality
import fs from "fs";
import path from "path";
import parser from "@babel/parser";
import _traverse from "@babel/traverse";
const traverse = _traverse.default;

export function importMap(dir, map) {
  function traverseDirectory(dir, map) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        const temp = traverseDirectory(filePath, map);
      } else if (stats.isFile()) {
        const extension = path.extname(filePath);
        if ([".js", ".jsx", ".ts", ".tsx"].includes(extension)) {
          const temp = importFunction(filePath, map);
        }
      }
    });
  }
  traverseDirectory(dir, map);
}
function importFunction(filePath, map) {
  const content = fs.readFileSync(filePath, "utf8");
  const fileDir = path.dirname(filePath);
  const ast = parser.parse(content, {
    sourceType: "module",
    plugins: ["jsx"],
  });
  traverse(ast, {
    ImportDeclaration(pathAST) {
      const { node } = pathAST;
      const str = node.source.extra.rawValue;
      const cssPath = path.join(fileDir, str);
      const extension = path.extname(cssPath);
      if ([".css"].includes(extension)) {
        if (!(str in map)) {
          map[cssPath] = [];
          map[cssPath].push(filePath);
        } else {
          map[cssPath].push(filePath);
        }
      }
    },
  });
}
