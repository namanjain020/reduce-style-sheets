//finalizes
import postcss from "postcss";
import fs from "fs";
import temp from "postcss-import";
import path from "path";
import { TailwindConverter } from "css-to-tailwindcss";
// const __dirname = path.resolve();
// import postcss from "postcss";

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



// console.log("THE BEGIN");

function converterFunc(filePath, obj) {
  const css = fs.readFileSync(filePath,'utf-8');
  converter.convertCSS(css).then(({convertedRoot,nodes})=>{
    // console.log(convertedRoot.toString());
    // console.log(css);
    // console.log(convertedRoot.toString());
    // console.log("\n\n")
    tailwindToJSON(convertedRoot.toString(),obj);
    // let Obj
  })
  function tailwindToJSON(css) {
    // console.log(css);
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
          // console.log(rule.selector);
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
          // console.log()
          // console.log(ids.length+" "+tags.length +" "+ classes.length)
          if (ids.length === 0 && tags.length === 0 && classes.length === 1) {
            let Obj = JSON.parse(fs.readFileSync(obj,'utf-8'));
            Obj[rule.selector.substr(1)] = {};
            // const current = Obj.selector;
            const atrule = rule.nodes[0];
            // console.log(atrule.params);
            // console.log(rule.parent.type);
            if (atrule.name && atrule.name === "apply" && rule.parent.type !== 'atrule') {
              const ts = atrule.params;
              Obj[rule.selector.substr(1)]["tailwind"] = ts;
              // console.log(ts);
            }
            Obj[rule.selector.substr(1)]["raw"] = null;
            rule.walkDecls((decl) => {
              // Transform each property declaration here
              Obj[rule.selector.substr(1)]["raw"] = decl.prop;
            });
            fs.writeFileSync(obj,JSON.stringify(Obj));
            // const temp = rule.decl.prop;
            // Obj[rule.selector].raw = temp;
          }
        }
      })
    }
  })


  // const css = fs.readFileSync(filePath, "utf-8");
  // converter.convertCSS(css).then(({convertedRoot,nodes}) =>{
  //   const ts = convertedRoot.toString();
  //   console.log(ts);
  // })
  // postcss([convertPlugin])
  //   .process(css, { from: undefined })
  //   .then((result) => {
  //     fs.writeFile(filePath, result.css, (err) => err && console.error(err));
  //     // fs.writeFile(filePath, result.css);
  //     // console.log(result.css);
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
}

const convertPlugin = postcss.plugin("tailwind-to-json", () => {
  return (root) => {
    const css = root.toString();
    // let string = 's';
    converter.convertCSS(css).then(({ convertedRoot, nodes }) => {
      const ts = convertedRoot.toString();
      root.walkRules((rule) => {
        const codeBlock = rule.toString();
        const regex = /[:\s,>#*+]/g;
        if (
          !regex.test(rule.selector) &&
          rule.selector &&
          rule.selector.includes(".")
        ) {
          const arr = rule.selector
            .match(/\.([^\s\{\:\>\+\~\[\]\)\(\#\,\.]+)/g)
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
            // Obj[rule.selector.substr(1)] = {};
            // const current = Obj.selector;
            // const atrule = rule.nodes[0];
            // if (atrule.name && atrule.name === "apply") {
            //   const ts = atrule.params;
            //   Obj[rule.selector.substr(1)]["tailwind"] = ts;
            // console.log(ts);
          }
        }
      });
    });

    // fs.writeFileSync("./logs/next.css", convertedRoot.toString());

    // root.walkRules((rule) => {
    //   // Check if the rule has a selector with a class name
    //   const codeBlock = rule.toString();
    //   const regex = /[:\s,>#*+]/g;
    //   if (
    //     !regex.test(rule.selector) &&
    //     rule.selector &&
    //     rule.selector.includes(".")
    //   ) {
    //     const arr = rule.selector
    //       .match(/\.([^\s\{\:\>\+\~\[\]\)\(\#\,\.]+)/g)
    //       .filter((el) => el != "");
    //     let classes = [];
    //     let ids = [];
    //     let tags = [];
    //     arr.forEach((el) => {
    //       if (el[0] === ".") classes.push(el);
    //       else if (el[0] === "#") ids.push(el);
    //       else tags.push(el);
    //     });
    //     if (ids.length === 0 && tags.length === 0 && classes.length === 1) {
    //       Obj[rule.selector.substr(1)] = {};
    //       const current = Obj.selector;
    //       const atrule = rule.nodes[0];
    //       if (atrule.name && atrule.name === "apply") {
    //         const ts = atrule.params;
    //         Obj[rule.selector.substr(1)]["tailwind"] = ts;
    //         // console.log(ts);
    //       }
    //       Obj[rule.selector.substr(1)]["raw"] = null;
    //       rule.walkDecls((decl) => {
    //         // Transform each property declaration here
    //         Obj[rule.selector.substr(1)]["raw"] = decl.prop;
    //       });
    //       // const temp = rule.decl.prop;
    //       // Obj[rule.selector].raw = temp;
    //     }
    //   }
    // });
  };
  return Obj;
});

export function cssToTailwind(dir, obj) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    // console.log(file);
    if (file !== "assets") {
      // console.log(file);
      if (stats.isDirectory()) {
        cssToTailwind(filePath, obj);
      } else if (stats.isFile()) {
        const extension = path.extname(filePath);
        //     // console.log(filePath);
        //     // const fileSize = calculateFileSize(filePath);
        if (extension === ".css") {
          //       // console.log(filePath);
          //       // console.log("JS File checked " + filePath);
          converterFunc(filePath, obj);
          // remCSSClasses(reqClasses, filePath, param);
        }
      }
    }
  });
  // let Obj = {};

  //FUNCTION
  // function toJSON(css) {
  //   // console.log(css);
  //   return postcss([toCodeblock])
  //     .process(css, { from: undefined })
  //     .then((result) => {})
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }
  // Custom PostCSS plugin
  // const toCodeblock = postcss.plugin("to-codeblock", () => {
  //   return (root) => {
  //     root.walkRules((rule) => {
  //       // Check if the rule has a selector with a class name
  //       // console.log("HAHHA");
  //               const codeBlock = rule.toString();
  //       const regex = /[:\s,>#*+]/g;
  //       if (
  //         !regex.test(rule.selector) &&
  //         rule.selector &&
  //         rule.selector.includes(".")
  //       ) {
  //         const arr = rule.selector
  //           .match(/\.([^\s\{\:\>\+\~\[\]\)\(\#\,\.]+)/g)
  //           .filter((el) => el != "");
  //         let classes = [];
  //         let ids = [];
  //         let tags = [];
  //         arr.forEach((el) => {
  //           if (el[0] === ".") classes.push(el);
  //           else if (el[0] === "#") ids.push(el);
  //           else tags.push(el);
  //         });
  //         if (ids.length === 0 && tags.length === 0 && classes.length === 1 && rule.parent.type === 'root') {
  //           // console.log(rule.parent.type)
  //           console.log(rule.toString());
  //           // Obj[rule.selector.substr(1)] = {};
  //           // const current = Obj.selector;
  //           // const atrule = rule.nodes[0];
  //           // if (atrule.name && atrule.name === "apply") {
  //           //   const ts = atrule.params;
  //           //   Obj[rule.selector.substr(1)]["tailwind"] = ts;
  //           //   // console.log(ts);
  //           // }
  //           // Obj[rule.selector.substr(1)]["raw"] = null;
  //           // rule.walkDecls((decl) => {
  //           //   // Transform each property declaration here
  //           //   Obj[rule.selector.substr(1)]["raw"] = decl.prop;
  //           // });
  //           // const temp = rule.decl.prop;
  //           // Obj[rule.selector].raw = temp;
  //         }
  //       }
  //     });
  //   };
  //   return Obj;
  // });

  // toJSON(css);

  // Custom PostCSS plugin
  // const tailwindToJson = postcss.plugin("tailwind-to-json", () => {
  //   return (root) => {
  //     root.walkRules((rule) => {
  //       // Check if the rule has a selector with a class name
  //       const codeBlock = rule.toString();
  //       const regex = /[:\s,>#*+]/g;
  //       if (
  //         !regex.test(rule.selector) &&
  //         rule.selector &&
  //         rule.selector.includes(".")
  //       ) {
  //         const arr = rule.selector
  //           .match(/\.([^\s\{\:\>\+\~\[\]\)\(\#\,\.]+)/g)
  //           .filter((el) => el != "");
  //         let classes = [];
  //         let ids = [];
  //         let tags = [];
  //         arr.forEach((el) => {
  //           if (el[0] === ".") classes.push(el);
  //           else if (el[0] === "#") ids.push(el);
  //           else tags.push(el);
  //         });
  //         if (ids.length === 0 && tags.length === 0 && classes.length === 1) {
  //           Obj[rule.selector.substr(1)] = {};
  //           const current = Obj.selector;
  //           const atrule = rule.nodes[0];
  //           if (atrule.name && atrule.name === "apply") {
  //             const ts = atrule.params;
  //             Obj[rule.selector.substr(1)]["tailwind"] = ts;
  //             // console.log(ts);
  //           }
  //           Obj[rule.selector.substr(1)]["raw"] = null;
  //           rule.walkDecls((decl) => {
  //             // Transform each property declaration here
  //             Obj[rule.selector.substr(1)]["raw"] = decl.prop;
  //           });
  //           // const temp = rule.decl.prop;
  //           // Obj[rule.selector].raw = temp;
  //         }
  //       }
  //     });
  //   };
  //   return Obj;
  // });
  // const css = fs.readFileSync(dir, "utf8");
  // let utilClassString ;
  // let newobj = {};
  // let string = "s";
  // converter.convertCSS(css).then(({ convertedRoot, nodes }) => {
  //   // toJSON(convertedRoot.toString());
  //   // utilClassString = convertedRoot.toString();
  //   // console.log(Obj);
  //   string = convertedRoot.toString();
  //   // fs.writeFileSync("./logs/next.css", convertedRoot.toString());
  // });
  // console.log(string);
}


// const dir = "../../../testinng-repos/breaking-bad-cast/src";
// const obj = "./logs/tailwindClasses.json";
// const empty ={};
// fs.writeFileSync(obj,JSON.stringify(empty));
// cssToTailwind(dir, obj);
