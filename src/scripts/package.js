import fs from "fs";
import path from "path";
import * as prettier from "prettier";

import { fileSystem } from "./fileSystem.js";
import { importMap } from "./importMap.js";
import { stylesheetRemover } from "./stylesheetRemover.js";
import { stylesheetReducer } from "./stylesheetReducer.js";
import { stylesheetConverter } from "./stylesheetConverterCopy.js";
import { parsingJSFiles } from "./parsingJSFiles.js";
import { finalTraverse } from "./finalTraverse.js";
import { middleTraverse } from "./middleTraverse.js";
import {variableParse} from "./variableParse.js";

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
    result = {},
    globalVariables = {};
  await importMap(dir, importsTo, importsFrom, styleImports);
  await variableParse(dir, globalVariables);
  // console.log(globalVariables);
  // trigger();
  await stylesheetRemover(dir, importsTo, styleImports, result);
  setTimeout(async () => {
    await stylesheetReducer(dir, importsFrom, importsTo, styleImports, result);
    setTimeout(async () => {
      await middleTraverse(dir, importsTo, styleImports, result);
      setTimeout(async () => {
        await stylesheetConverter(
          dir,
          importsFrom,
          importsTo,
          styleImports,
          result,globalVariables
        );
        setTimeout(async () => {
          trigger(importsFrom, importsTo, styleImports, result);
        }, 20000);
      }, 20000);
    }, 20000);
  }, 20000);
}
const trigger = (importsFrom, importsTo, styleImports, result) => {
  setTimeout(async () => {
    await finalTraverse(dir, importsTo, styleImports, result);
    console.log("RESULTS HAVE BEEN PRINTED");
    // console.log(result);
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
    fs.writeFileSync(
      "./logs/removedBlocks.json",
      prettier.format(JSON.stringify(result), { parser: "json" })
    );
  }, 20000);
};

// const dir = "../../../../testinng-repos/project_modern_ui_ux_gpt3/src";
let dir = "../../testinng-repos/space-tourism/src";
// let dir = "../detailPane";
// let dir = "../../testinng-repos/mattermost-webapp";
// let dir = "../detailPaneCopy";
dir = path.resolve(dir);
// const dir = "../../../../testinng-repos/screenREC/src";

wrapper(dir);
