import fs from "fs";
import path from "path";

import { fileSystem } from "./fileSystem.js";
import { importMap } from "./importMap.js";
import { stylesheetReducer } from "./stylesheetReducer.js";
import { parsingJSFiles } from "./parsingJSFiles.js";
import { stylesheetRemover } from "./stylesheetRemover.js";
import { stylesheetConverter } from "./stylesheetConverter.js";

async function deleteAllFilesInDir(dirPath) {
  try {
    fs.readdirSync(dirPath).forEach((file) => {
      fs.rmSync(path.join(dirPath, file));
    });
  } catch (error) {
    console.log(error);
  }
}

async function wrapper(dir) {
  if (fs.existsSync("logs")) {
    deleteAllFilesInDir("./logs");
    fs.rmdirSync("./logs");
  }
  fs.mkdirSync("logs");
  let counter = 0;
  const original = fileSystem(dir, counter);
  fs.writeFileSync("./logs/original.json", JSON.stringify(original));

  let importsTo = {},
    importsFrom = {},
    styleImports = {};
  importMap(dir, importsTo, importsFrom, styleImports);
  setTimeout(() => {
    fs.writeFileSync("./logs/importsTo.json", JSON.stringify(importsTo));
    fs.writeFileSync("./logs/importsFrom.json", JSON.stringify(importsFrom));

    let unusedStylesheets = { "never-imported": [], "empty": [] };
    // stylesheetRemover(dir,importsTo,styleImports,unusedStylesheets);
    // setTimeout(() => {
    //   fs.writeFileSync("./logs/removedSheets.json",JSON.stringify(unusedStylesheets))
    // }, 2000);

    fs.writeFileSync("./logs/styleImports.json", JSON.stringify(styleImports));
    fs.writeFileSync(
      "./logs/removedBlocks.json",
      JSON.stringify({ key: "value" })
    );
    let obj4 = {};
    stylesheetReducer(dir, importsFrom, importsTo, styleImports, obj4);
    // stylesheetConverter(dir, importsFrom, importsTo, styleImports, obj4);
    setTimeout(() => {  
      fs.writeFileSync("./logs/removedBlocks.json", JSON.stringify(obj4));
    }, 4000);
    setTimeout(() => {
      const reduced = fileSystem(dir);
      fs.writeFileSync("./logs/reduced.json", JSON.stringify(reduced));
    }, 3000);
  }, 10000);
}
// const dir = "../../../../testinng-repos/project_modern_ui_ux_gpt3/src";
// const dir = "../../../../testinng-repos/space-tourism/src";
// let dir = "../../detailPane";
let dir = "../../../../testinng-repos/mattermost-webapp";
dir = path.resolve(dir);
// const dir = "../../../../testinng-repos/screenREC/src";
// const dir = "../../contacts";
wrapper(dir);
