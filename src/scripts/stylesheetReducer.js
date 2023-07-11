import fs from "fs";
import path from "path";
import postcss from "postcss";
import scss from "postcss-scss";
const __dirname = path.resolve();

let counter = 0;

async function regexHelper(className, fileName, importsFrom, visited) {
  if (visited.includes(fileName)) {
    return false;
  }
  visited.push(fileName);
  const content = fs.readFileSync(fileName, "utf-8");
  const str = `${className}`;
  if (content.includes(className)) {
    return true;
  } else {
    if (fileName in importsFrom) {
      for (let idx = 0; idx < importsFrom[fileName]["scripts"].length; idx++) {
        const result = await regexHelper(
          className,
          importsFrom[fileName]["scripts"][idx],
          importsFrom,
          visited
        );
        if (result) {
          return true;
        }
      }
    }
  }
  return false;
}

async function helper(
  className,
  filePath,
  importsFrom,
  importsTo,
  styleImports
) {
  let arr = [filePath];
  let visited = [];

  if (filePath in styleImports) {
    styleImports[filePath].forEach((file) => arr.push(file));
  }
  for (let idx = 0; idx < arr.length; idx++) {
    if (arr[idx] in importsTo) {
      for (let idx2 = 0; idx2 < importsTo[arr[idx]].length; idx2++) {
        const res = await regexHelper(
          className,
          importsTo[arr[idx]][idx2],
          importsFrom,
          visited
        );
        if (res) {
          return true;
        }
      }
    }
  }
  console.log(className + " classs is unused");
  return false;
  // return boolVal;
}
async function removeClasses(
  filePath,
  importsFrom,
  importsTo,
  styleImports,
  removedBlocks
) {
  new Promise((res, rej) => {
    const onSuccess = () => {
      res();
    };
    const css = fs.readFileSync(filePath, "utf8");
    // let removedBlocks = JSON.parse(fs.readFileSync("./logs/removedBlocks.json"));
    postcss([
      removeUnusedClasses(
        filePath,
        importsFrom,
        importsTo,
        styleImports,
        removedBlocks,
        onSuccess
      ),
    ])
      .process(css, { from: undefined, parser: scss })
      .then((result) => {

      })
      .catch((error) => {
        console.error(error);
      });
  });
  // fs.writeFileSync("./logs/removedBlocks.json", JSON.stringify(removedBlocks));
}
const removeUnusedClasses = postcss.plugin(
  "remove-unused-classes",
  (
    filePath,
    importsFrom,
    importsTo,
    styleImports,
    removedBlocks,
    onSuccess
  ) => {
    return (root) => {
      root.walkRules(async (rule) => {
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

            const boolVal = await helper(
              className.substring(1),
              filePath,
              importsFrom,
              importsTo,
              styleImports
            );
            if (!boolVal) {
              // console.log(className + "classs is unused");
              removedBlocks[filePath]["unused-classes"][
                classes[0].substring(1)
              ] = codeBlock.replace(classes[0], "");

              // Uncommet to start removal \\
              rule.remove();
              fs.writeFileSync(filePath, root.toString(), (err) => err && console.error(err));
            }
          }
        }
        onSuccess();
      });
    };
  }
);

export async function stylesheetReducer(
  dirt,
  importsFrom,
  importsTo,
  styleImports,
  removedBlocks
) {
  return new Promise(async (res, rej) => {
    console.log("in");
    async function stylesheetReducerHelper(
      dirt,
      importsFrom,
      importsTo,
      styleImports,
      removedBlocks
    ) {
      const dir = path.resolve(dirt);
      const files = fs.readdirSync(dir);
      // files = fs.readdirSync(dir);
      //Recursive function
      files
        .filter((file) => !file.includes("node_modules"))
        .filter((file) => !file.includes("__tests__"))
        .filter((file) => !file.includes("tests"))
        .filter((file) => !file.startsWith("_"))
        .forEach(async (file) => {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);
          if (stats.isDirectory()) {
            await stylesheetReducerHelper(
              filePath,
              importsFrom,
              importsTo,
              styleImports,
              removedBlocks
            );
          } else if (stats.isFile()) {
            const extension = path.extname(filePath);
            if ([".css", ".scss", ".less"].includes(extension)) {
              counter++;
              await removeClasses(
                filePath,
                importsFrom,
                importsTo,
                styleImports,
                removedBlocks
              );
            }
          }
        });
      return;
    }
    await stylesheetReducerHelper(
      dirt,
      importsFrom,
      importsTo,
      styleImports,
      removedBlocks
    );
    console.log("out");
    res();
  });
}
