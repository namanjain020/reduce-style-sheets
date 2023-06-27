import fs from "fs";
import { parsingJSFiles } from "./parsingJSfiles.js";
import { CSSreducer } from "./CSSreducer.js";
import { fileSystem } from "./fileSystem.js";

const dir = "../../../testinng-repos/project_modern_ui_ux_gpt3/src";

export function testing(dir) {
  
  // Collecting the directory details and storing in original.json
  const original = fileSystem(dir);
  fs.writeFileSync("./logs/original.json", JSON.stringify(original));
  
  // Collecting all the classes from JS files
  const requiredClasses = parsingJSFiles(dir);
  fs.writeFileSync("./logs/jsClasses.json",JSON.stringify({requiredClasses}))
  const requiredSet = new Set(requiredClasses);


  // Calling reducer function to remove the css codeblocks
  let removedClasses = {};
  CSSreducer(dir, requiredSet,removedClasses);
  fs.writeFileSync("./logs/CSSClasses.json", JSON.stringify(removedClasses));


  // Collecting directory details after the reduction
  setTimeout(() => {
    const reduced = fileSystem(dir);
    fs.writeFileSync("./logs/reduced.json", JSON.stringify(reduced));
  }, 1000);
}
testing(dir);

