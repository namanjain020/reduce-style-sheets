import fs from "fs";
import path from "path";
import postcss from "postcss";
import scss from "postcss-scss";
const __dirname = path.resolve();

let counter = 0;

function regexHelper(className, fileName, importsFrom, recur) {
  
  if (recur > 5) {
    return "Stop Checking";
  }
  // console.log(fileName);
  const content = fs.readFileSync(fileName, "utf-8");
  const str = `${className}`;
  // const regex = new RegExp(`\\b${className}\\b`);
  if (content.includes(className)) {
    return "Found";
  } else {
    if (fileName in importsFrom) {
      for (let idx = 0; idx < importsFrom[fileName]["scripts"].length; idx++) {
        if (
          regexHelper(
            className,
            importsFrom[fileName]["scripts"][idx],
            importsFrom,
            recur + 1
          ) === "Found"
        ) {
          return "Found";
        }
      }
    }
  }
  return "Not Found";
}

function helper(className, filePath, importsFrom, importsTo, styleImports) {
  let arr = [filePath];
  if (filePath in styleImports) {
    styleImports[filePath].forEach((file) => arr.push(file));
  }
  for (let idx = 0; idx < arr.length; idx++) {
    if (arr[idx] in importsTo) {
      for (let idx2 = 0; idx2 < importsTo[arr[idx]].length; idx2++) {
        if (
          regexHelper(className, importsTo[arr[idx]][idx2], importsFrom, 1) ===
          "Found"
        ) {
          // console.log(true);
          return true;
        }
      }
    }
  }
  return false;
  // return boolVal;
}

function removeClasses(
  filePath,
  importsFrom,
  importsTo,
  styleImports,
  removedBlocks
) {
  const css = fs.readFileSync(filePath, "utf8");
  // let removedBlocks = JSON.parse(fs.readFileSync("./logs/removedBlocks.json"));
  
  postcss([
    removeUnusedClasses(
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
  // fs.writeFileSync("./logs/removedBlocks.json", JSON.stringify(removedBlocks));
}
const removeUnusedClasses = postcss.plugin(
  "remove-unused-classes",
  (filePath, importsFrom, importsTo, styleImports, removedBlocks) => {
    return (root) => {
      root.walkRules((rule) => {
        const codeBlock = rule.toString();
        // console.log(codeBlock);
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
          const regex = /[:+~>@\[$&\\]/;
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
            // console.log(filePath);
            if (
              !helper(
                className.substring(1),
                filePath,
                importsFrom,
                importsTo,
                styleImports
              )
            ) {
              // const obj = {classes[0] : codeBlock};
              if (!(filePath in removedBlocks)) {
                removedBlocks[filePath] = {};
              }
              if (!("unused-classes" in removedBlocks[filePath])) {
                removedBlocks[filePath]["unused-classes"] = {};
              }
              removedBlocks[filePath]["replaced-tailwind"] = {};
              // removedBlocks[filePath]["unused-classes"][
              //   classes[0].substring(1)
              // ] = "codeblock";
              removedBlocks[filePath]["unused-classes"][
                classes[0].substring(1)
              ] = codeBlock.replace(classes[0], "");

              // Uncommet to start removal \\
              // rule.remove();
            }
          }
        }
      });
    };
  }
);

export function stylesheetReducer(
  dirt,
  importsFrom,
  importsTo,
  styleImports,
  removedBlocks
) {
  // console.log(styleImports);

  const dir = path.resolve(dirt);
  const files = fs.readdirSync(dir);
  // files = fs.readdirSync(dir);
  //Recursive function
  files
    .filter((file) => !file.includes("__tests__"))
    .filter((file) => !file.includes("tests"))
    .filter((file) => !file.startsWith("_"))
    .forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        stylesheetReducer(
          filePath,
          importsFrom,
          importsTo,
          styleImports,
          removedBlocks
        );
      } else if (stats.isFile()) {
        const extension = path.extname(filePath);
        if ([".css", ".scss", ".less"].includes(extension)) {
          console.log(counter);
          console.log(filePath);
          counter++;
          removeClasses(
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
