import fs from "fs";
import path from "path";
import postcss from "postcss";
import scss from "postcss-scss";
const __dirname = path.resolve();

let counter = 0;

function removeClasses(
  filePath,
  importsFrom,
  importsTo,
  styleImports,
  removedBlocks
) {
  const css = fs.readFileSync(filePath, "utf8");
  // let removedBlocks = JSON.parse(fs.readFileSync("./logs/removedBlocks.json"));
  // console.log(removedBlocks);
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
              // Uncommet to start removal \\
              removedBlocks[filePath]["unused-classes"][
                classes[0].substring(1)
              ] = codeBlock.replace(classes[0], "");
              // rule.remove();
            }
          }
        }
      });
    };
  }
);

export function stylesheetRemover(
  unresolvedDir,
  importsTo,
  styleImports,
  stylesheets
) {
  const dir = path.resolve(unresolvedDir);
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
        stylesheetRemover(
          filePath,
          importsTo,
          styleImports,
          stylesheets
        );
      } else if (stats.isFile()) {
        const extension = path.extname(filePath);
        if([".css", ".scss",".less"].includes(extension))
        {
            const stats = fs.statSync(filePath);
            const fileSize = stats.size;
            //If file is empty delete the file and remove imports
            if(fileSize === 0)
            {
                // TO DO
                if(filePath in styleImports )
                {
                    helper1();
                }
                if(filePath in importsTo)
                {
                  helper2();
                }
            }
            
            // If file is never imported remove
            if(!(filePath in styleImports) && !(filePath in importsTo)){
                stylesheets["never-imported"].push(filePath);
                fs.rmSync(filePath);
            }
        }
         
      }
    });
}
