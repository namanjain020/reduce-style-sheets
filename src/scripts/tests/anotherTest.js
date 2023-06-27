import fs from "fs";
import path from "path";
const __dirname = path.resolve();
import postcss from "postcss";

function remCSSClasses(convertedClasses, filePath, param) {
  const css = fs.readFileSync(filePath, "utf8");
  postcss([removeConverted(convertedClasses)])
    .process(css, { from: undefined })
    .then((result) => {
      fs.writeFile(
        filePath,
        result.css,
        (err) => err && console.error(err)
      );
      // fs.writeFile(filePath, result.css);
      // console.log(result.css);
    })
    .catch((error) => {
      console.error(error);
    });
}

const removeConverted = postcss.plugin(
  "remove-converted",
  (convertedClasses) => {
    return (root) => {
      root.walkRules((rule) => {
        // console.log("hello")
        // Check if the rule has a selector with a class name
        const codeBlock = rule.toString();
        if (rule.selector && rule.selector.includes(".")) {
          const arr = rule.selector
            .match(/(\.[^\s.#]+|#[^\s.#]+|[^.\s#][^\s.#]+)?/g)
            .filter((el) => el != "");
          let classes = [];
          let ids = [];
          let tags = [];
        //   console.log(rule.selector);
        //   console.log(arr);
          arr.forEach((el) => {
            if (el[0] === ".") classes.push(el);
            else if (el[0] === "#") ids.push(el);
            else tags.push(el);
          });
          // console.log(classes);
          // console.log("classes " + classes);
          // console.log("ids " + ids);
          // console.log("tags " + tags);

          //No pseudo selectors are taken in tc for now
          const regex = /[:+~>]/;
          let required = true;
          if (
            ids.length === 0 &&
            tags.length === 0 &&
            classes.length === 1 &&
            !regex.test(rule.selector)
          ) {
            if(convertedClasses.includes(rule.selector.substring(1)))
            {
              console.log(rule.selector + " was removed and converted to tailwind")
                rule.remove();
                // console.log(codeBlock);
            }
          }
        }
      });
    };
  }
);

export function CSSreducer(dir, convertedClasses, param) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      CSSreducer(filePath, convertedClasses, param);
    } else if (stats.isFile()) {
      const extension = path.extname(filePath);
      if (extension === ".css") {
        remCSSClasses(convertedClasses, filePath, param);
      }
    }
  });
}

