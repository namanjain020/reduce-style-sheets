import fs from "fs";
import { cssToTailwind } from "./css-to-tailwind.js";
import { addToClassName } from "./adding-to-className.js";
import { CSSreducer } from "./anotherTest.js";

const dir = "../../../testinng-repos/project_modern_ui_ux_gpt3/src";

export function testing(dir) {
  // const obj = "./logs/tailwindClasses.json";
  
  // fs.appendFile('./logs/tailwindClasses.json', '{}', function (err) {
  //   if (err) throw err;
  //   console.log('created');
  // });
  const empty = {};
  const obj = "./logs/tailwindClasses.json";
  fs.writeFileSync(obj, JSON.stringify(empty));
  cssToTailwind(dir, obj);
  setTimeout(() => {
    const newobj = JSON.parse(fs.readFileSync("./logs/tailwindClasses.json", "utf8"));
    const arr = addToClassName(dir, newobj);
    CSSreducer(dir,arr);
    setTimeout(() => {
      // const reduced = fileSystem(dir);
      // fs.writeFileSync("./logs/final.json", JSON.stringify(reduced));
    }, 1000);
  }, 1000);
}
testing(dir);
