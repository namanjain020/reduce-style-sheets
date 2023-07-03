import fs from "fs";
import path from "path";
const __dirname = path.resolve();
import postcss from "postcss";
// Custom PostCSS plugin
let Obj = {};

function remCSSClasses(dir) {
  const css = fs.readFileSync(dir, "utf8");

  postcss([cssToJSON])
    .process(css, { from: undefined })
    .then((result) => {
    //   fs.writeFile(
    //     directoryPath + `/${fileName}`,
    //     result.css,
    //     (err) => err && console.error(err)
    //   );
      // writeToFile(directoryPath + `/${fileNames}`, result.css);
      // console.log(result.css);
    })
    .catch((error) => {
      console.error(error);
    });
}

const cssToJSON = postcss.plugin("css-to-json", () => {
  return (root) => {
    root.walkRules((rule) => {
      // Check if the rule has a selector with a class name
      const codeBlock = rule.toString();
      if (rule.selector && rule.selector.includes(".")) {
        Obj[rule.selector] = {};
        const current = Obj.selector;
        const atrule = rule.nodes[0];
        if (atrule.name && atrule.name === "apply") {
            const ts = atrule.params;
            Obj[rule.selector]['tailwind'] = ts;
            // console.log(ts);
        }
        Obj[rule.selector]['raw']=null
        rule.walkDecls(decl => {
            // Transform each property declaration here
            Obj[rule.selector]['raw'] = decl.prop;
        });
        // const temp = rule.decl.prop;
        // Obj[rule.selector].raw = temp;
      }
    });
  };
  return Obj;
});


const dir = "./logs/next.css";
remCSSClasses(dir)
fs.writeFileSync("./logs/test.json", JSON.stringify(Obj));
console.log(Obj);

