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
  let obj = {};
  importMap(dir, obj);
  fs.writeFileSync("./createdLogs/importMap.json", JSON.stringify(obj));
  obj = {};
  parsingJSFiles(dir,obj);
  fs.writeFileSync("./createdLogs/JSClasses.json",JSON.stringify(obj));
  // CSSreducer(obj);
}
const dir = "../../../testinng-repos/space-tourism/src";
wrapper(dir);
