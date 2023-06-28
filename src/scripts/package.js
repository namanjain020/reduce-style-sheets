import fs from "fs";
import { fileSystem } from "./fileSystem.js";
import { importMap } from "./importMap.js";
import { CSSreducer } from "./CSSreducer.js";
import { parsingJSFiles } from "./parsingJSFiles.js";
function wrapper(dir) {
  if (fs.existsSync("createdLogs")) {
    console.log("createdLogs folder exists remove it run the file.");
    return;
  } else {
    fs.mkdirSync("createdLogs");
  }
  const original = fileSystem(dir);
  fs.writeFileSync("./createdLogs/original.json", JSON.stringify(original));
  let obj1 = {},
    obj2 = {};
  importMap(dir, obj1, obj2);
  setTimeout(() => {
    fs.writeFileSync(
      "./createdLogs/mapStylesToScripts.json",
      JSON.stringify(obj1)
    );
    fs.writeFileSync(
      "./createdLogs/mapScriptsToScripts.json",
      JSON.stringify(obj2)
    );
    CSSreducer(obj1, obj2);
  }, 2000);
}
// const dir = "../../../testinng-repos/project_modern_ui_ux_gpt3/src";
const dir = "../../../testinng-repos/space-tourism/src";
wrapper(dir);
