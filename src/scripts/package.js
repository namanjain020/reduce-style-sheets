import fs from "fs";
import path from "path";
import prettier from "prettier";

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
  fs.writeFileSync(
    "./logs/original.json",
    prettier.format(JSON.stringify(original), { parser: "json" })
  );
  let importsTo = {},
    importsFrom = {},
    styleImports = {},
    result = {};
  importMap(dir, importsTo, importsFrom, styleImports);
  setTimeout(() => {
    // console.log(importsFrom);
    fs.writeFileSync(
      "./logs/importsTo.json",
      prettier.format(JSON.stringify(importsTo), { parser: "json" })
    );
    fs.writeFileSync(
      "./logs/importsFrom.json",
      prettier.format(JSON.stringify(importsFrom), { parser: "json" })
    );
    fs.writeFileSync(
      "./logs/styleImports.json",
      prettier.format(JSON.stringify(styleImports), { parser: "json" })
    );
    stylesheetRemover(dir, importsTo, styleImports, result);
    setTimeout(() => {
      stylesheetReducer(dir, importsFrom, importsTo, styleImports, result);
      setTimeout(() => {
        stylesheetConverter(dir, importsFrom, importsTo, styleImports, result);
        setTimeout(() => {
          console.log("Results printed to the file");
          trigger(result);
          setTimeout(() => {
            const reduced = fileSystem(dir);
            fs.writeFileSync("./logs/reduced.json", JSON.stringify(reduced));
          }, 3000);
        }, 180000);
      }, 120000);
    }, 10000);
  }, 10000);
}
const trigger = (result) => {
  fs.writeFileSync(
    "./logs/removedBlocks.json",
    prettier.format(JSON.stringify(result), { parser: "json" })
  );
};

// const dir = "../../../../testinng-repos/project_modern_ui_ux_gpt3/src";
// let dir = "../../testinng-repos/space-tourism/src";
// let dir = "../detailPane";
let dir = "../../testinng-repos/mattermost-webapp";
dir = path.resolve(dir);
// const dir = "../../../../testinng-repos/screenREC/src";
// const dir = "../../contacts";
wrapper(dir);
