//finalizes
import postcss from "postcss";
import fs from "fs";
import temp from "postcss-import";
import path from "path";
import { TailwindConverter } from "css-to-tailwindcss";


// Tailwind converter used (Abstraction)
const converter = new TailwindConverter({
  remInPx: 20,
  // set null if you don't want to convert rem to pixels
  postCSSPlugins: [temp], // add any postcss plugins to this array
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

function converterFunc(filePath, obj) {
  const css = fs.readFileSync(filePath,'utf-8');
  converter.convertCSS(css).then(({convertedRoot,nodes})=>{
    tailwindToJSON(convertedRoot.toString(),obj);
  })
  async function tailwindToJSON(css) {
    return postcss([tsPlugin])
      .process(css, { from: undefined })
      .then((result) => {})
      .catch((error) => {
        console.error(error);
      });
  }
  const tsPlugin = postcss.plugin("ts-plugin",() => {
    return(root) =>{
      root.walkRules((rule)=>{
        const regex = /[:\s,>#*+]/g;
        if (
          !regex.test(rule.selector) &&
          rule.selector &&
          rule.selector.includes(".")
        ) {
          const arr = rule.selector
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
          if (ids.length === 0 && tags.length === 0 && classes.length === 1) {
            let Obj = JSON.parse(fs.readFileSync(obj,'utf-8'));
            Obj[rule.selector.substr(1)] = {};
            const atrule = rule.nodes[0];
            if (atrule.name && atrule.name === "apply" && rule.parent.type !== 'atrule') {
              const ts = atrule.params;
              Obj[rule.selector.substr(1)]["tailwind"] = ts;
            }
            Obj[rule.selector.substr(1)]["raw"] = null;
            rule.walkDecls((decl) => {
              // Transform each property declaration here
              Obj[rule.selector.substr(1)]["raw"] = decl.prop;
            });
            fs.writeFileSync(obj,JSON.stringify(Obj));
          }
        }
      })
    }
  })
}

export function cssToTailwind(dir, obj) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (file !== "assets") {
      if (stats.isDirectory()) {
        cssToTailwind(filePath, obj);
      } else if (stats.isFile()) {
        const extension = path.extname(filePath);
        if (extension === ".css") {
          converterFunc(filePath, obj);
        }
      }
    }
  });
}

