import fs from "fs";
import path from "path";
import postcss from "postcss";
const __dirname = path.resolve();

function remCSSClasses(cssFilePath, requiredClasses) {
  const css = fs.readFileSync(filePath, "utf8");
  postcss([removeUnusedClasses(reqClasses, param)])
    .process(css, { from: undefined })
    .then((result) => {
      fs.writeFile(filePath, result.css, (err) => err && console.error(err));
    })
    .catch((error) => {
      console.error(error);
    });
}
const removeUnusedClasses = postcss.plugin(
  "remove-unused-classes",
  (reqClasses, param) => {
    return (root) => {
      root.walkRules((rule) => {
        const codeBlock = rule.toString();
        // Check if the rule has a class selector
        if (rule.selector && rule.selector.includes(".")) {
          // const arr = rule.selector
          //   .match(/\.([^\s\{\:\>\+\~\[\]\)\(\#\,\.]+)/g)
          //   .filter((el) => el != "");
          // regex matching to get all the selector for any combinator
          const arr = rule.selector
            .toString()
            .match(/(\.[^\s.#,]+|#[^\s.#,]+|[^.\s#,][^\s.#,]+)?/g)
            .filter((el) => el != "");
          let classes = [];
          let ids = [];
          let tags = [];
          arr.forEach((el) => {
            if (el[0] === ".") classes.push(el);
            else if (el[0] === "#") ids.push(el);
            else tags.push(el);
          });

          //No pseudo selectors are taken in tc for now
          const regex = /[:+~>]/;
          let required = true;
          //Only class combinators are considered 
          if (
            ids.length === 0 &&
            tags.length === 0 &&
            !regex.test(rule.selector)
          ) {
            if (rule.selector.includes(",")) {
              required = classes.some((c) => reqClasses.has(c.substring(1)));
            } else {
              required = classes.every((c) => reqClasses.has(c.substring(1)));
            }
          }
          if (!required) {
            //Uncomment to start removal
            // rule.remove();
            param[rule.selector] = codeBlock;
            console.log(codeBlock);
          }
        }
      });
    };
  }
);

export function CSSreducer(CSSFileMap, JSClasses) {
  const cssFiles = Object.keys(map);
  cssFiles.forEach( cssFile => {
    console.log(map[cssFile]);
  });
}
