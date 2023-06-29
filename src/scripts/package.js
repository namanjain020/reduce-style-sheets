import fs from "fs";
import path from "path";
import { fileSystem } from "./fileSystem.js";
import { importMap } from "./importMap.js";
import { CSSreducer } from "./CSSreducer.js";
import { parsingJSFiles } from "./parsingJSFiles.js";

async function deleteAllFilesInDir(dirPath) {
  try {
    fs.readdirSync(dirPath).forEach((file) => {
      fs.rmSync(path.join(dirPath, file));
    });
  } catch (error) {
    console.log(error);
  }
}

function wrapper(dir) {
  if (fs.existsSync("logs")) {
    deleteAllFilesInDir("./logs");
    fs.rmdirSync("./logs");
    // deleteAllFilesInDir('./my-directory');
    // console.log("logs folder exists remove it run the file.");
    // return;
  }
  fs.mkdirSync("logs");
  const original = fileSystem(dir);
  fs.writeFileSync("./logs/original.json", JSON.stringify(original));
  let obj1 = {},
    obj2 = {};
  importMap(dir, obj1, obj2);
  setTimeout(() => {

    fs.writeFileSync("./logs/mapStylesToScripts.json", JSON.stringify(obj1));
    fs.writeFileSync("./logs/mapScriptsToScripts.json", JSON.stringify(obj2));
    let obj3 = {};
    CSSreducer(obj1, obj2, obj3);
    fs.writeFileSync("./logs/removedBlocks.json", JSON.stringify(obj3));

    setTimeout(() => {
      const reduced = fileSystem(dir);
      fs.writeFileSync("./logs/reduced.json", JSON.stringify(reduced));
    }, 3000);

  }, 20000);
}
// const dir = "../../../../testinng-repos/space-tourism/src";
const dir = "../../../../testinng-repos/mattermost-webapp";
// const dir = "../../contacts";
wrapper(dir);
