import fs from "fs";
import path from "path";
import postcss from "postcss";
const __dirname = path.resolve();

let counter = 0;
function remCSSClasses(dir) {
  const css = fs.readFileSync(dir, "utf8");
  postcss([cssCodeblocks])
    .process(css, { from: undefined })
    .then((result) => {
        fs.writeFile(dir, result.css, (err) => err && console.error(err));
    })
    .catch((error) => {
      console.error(error);
    });
}
const cssCodeblocks = postcss.plugin("code-blocks", () => {
  return (root) => {
    root.nodes.forEach((rule) => {
      if (rule.type === "atrule") {
        rule.nodes.forEach((mediaRules) => {
          const codeBlock = mediaRules.toString();
          console.log(counter);
          counter++;
          console.log(mediaRules.selector);
        });
      } else {
        if(rule.selector === '.gpt3__header')
        {
            rule.remove();
        }
        const codeBlock = rule.toString();
        console.log(counter);
        counter++;
        console.log(rule.selector);
      }
    });
  };
});

// export function CSSreducer(dir, reqClasses, param) {
//   const files = fs.readdirSync(dir);
//   files.forEach((file) => {
//     const filePath = path.join(dir, file);
//     const stats = fs.statSync(filePath);

//     if (file !== "assets") {
//       if (stats.isDirectory()) {
//         CSSreducer(filePath, reqClasses, param);
//       } else if (stats.isFile()) {
//         const extension = path.extname(filePath);
//         if (extension === ".css") {
//           remCSSClasses(reqClasses, filePath, param);
//         }
//       }
//     }
//   });
// }

const dir =
  "../../../testinng-repos/project_modern_ui_ux_gpt3/src/containers/header/header.css";
remCSSClasses(dir);
