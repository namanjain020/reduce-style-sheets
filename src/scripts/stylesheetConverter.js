import fs from "fs";
import path from "path";
import postcss from "postcss";
import { TailwindConverter } from "css-to-tailwindcss";
import postcssImport from "postcss-import";
import postcssNested from "postcss-nested";
import scss from "postcss-scss";

const __dirname = path.resolve();
let counter = 0;
// Tailwind converter used (Abstraction)
const converter = new TailwindConverter({
  remInPx: null,
  // set null if you don't want to convert rem to pixels
  postCSSPlugins: [postcssNested, postcssImport], // add any postcss plugins to this array
  tailwindConfig: {
    // your tailwind config here
    content: [],
    theme: {
      extend: {},
      supports: {
        grid: "display: grid",
        flex: "display: flex",
      },
    },
  },
});
function regexHelper(className, fileName, importsFrom, recur) {
  // console.log(fileName);
  if (recur > 5) {
    return false;
  }
  // console.log(fileName);
  const content = fs.readFileSync(fileName, "utf-8");
  const str = `${className}`;
  // const regex = new RegExp(`\\b${className}\\b`);
  if (content.includes(str)) {
    return true;
  } else {
    if (fileName in importsFrom) {
      for (let idx = 0; idx < importsFrom[fileName]["scripts"].length; idx++) {
        if (
          regexHelper(
            className,
            importsFrom[fileName]["scripts"][idx],
            importsFrom,
            recur + 1
          )
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

function convertClasses(
  filePath,
  importsFrom,
  importsTo,
  styleImports,
  removedBlocks
) {
  const css = fs.readFileSync(filePath, "utf8");
  postcss([
    postcssNested,
    convertUsedClasses(
      filePath,
      importsFrom,
      importsTo,
      styleImports,
      removedBlocks
    ),
  ])
    .process(css, { from: undefined, parser: scss })
    .then((result) => {
      fs.writeFile(filePath, result.css, (err) => err && console.error(err));
    })
    .catch((error) => {
      console.error(error);
    });
}
const convertUsedClasses = postcss.plugin(
  "convert-used-classes",
  (filePath, importsFrom, importsTo, styleImports, removedBlocks) => {
    return (root) => {
      root.walkRules((rule) => {
        const codeBlock = rule.toString();
        // Check if the rule has a class selector
        if (rule.selector && rule.selector.includes(".")) {
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
          const regex = /[:+~>@$&\\]/;
          const parent = rule.parent;
          if (
            (!parent || !parent.selector) &&
            ids.length === 0 &&
            tags.length === 0 &&
            classes.length === 1 &&
            !regex.test(rule.selector)
          ) {
            const className = classes[0];
            console.log(className);
            converter
              .convertCSS(rule.toString())
              .then(({ convertedRoot, nodes }) => {
                console.log(convertedRoot.toString());
                console.log(counter);
                counter++;
              });
          }
        }
      });
    };
  }
);

export function stylesheetConverter(
  dirt,
  importsFrom,
  importsTo,
  styleImports,
  removedBlocks
) {
  // console.log(styleImports);

  const dir = path.resolve(dirt);
  const files = fs.readdirSync(dir);
  //Recursive function
  files
    .filter((file) => !file.includes("__tests__"))
    .filter((file) => !file.includes("tests"))
    .filter((file) => !file.startsWith("_"))
    .forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        stylesheetConverter(
          filePath,
          importsFrom,
          importsTo,
          styleImports,
          removedBlocks
        );
      } else if (stats.isFile()) {
        const extension = path.extname(filePath);
        if ([".css", ".scss", ".less"].includes(extension)) {
          // console.log(counter);
          // console.log(filePath);
          // counter++;
          convertClasses(
            filePath,
            importsFrom,
            importsTo,
            styleImports,
            removedBlocks
          );
        }
      }
    });
}