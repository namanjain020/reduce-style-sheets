import fs from "fs";
import path from "path";
import prettier from "prettier";

import { fileSystem } from "./fileSystem.js";
import { importMap } from "./importMap.js";
import { stylesheetRemover } from "./stylesheetRemover.js";
import { stylesheetReducer } from "./stylesheetReducer.js";
import { stylesheetConverter } from "./stylesheetConverterCopy.js";
import { parsingJSFiles } from "./parsingJSFiles.js";
import { finalTraverse } from "./finalTraverse.js";

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
  await importMap(dir, importsTo, importsFrom, styleImports);

  await stylesheetRemover(dir, importsTo, styleImports, result);
  setTimeout(async () => {
    await stylesheetReducer(dir, importsFrom, importsTo, styleImports, result);
    setTimeout(async () => {
      await stylesheetConverter(dir, importsFrom, importsTo, styleImports, result);
      setTimeout(() => {
        finalTraverse(dir, importsTo, styleImports, result);
        trigger(importsFrom, importsTo, styleImports, result);
      }, 60000);
    }, 60000);
  }, 60000);

  //   setTimeout(() => {
  // await stylesheetReducer(dir, importsFrom, importsTo, styleImports, result);
  //     setTimeout(() => {
  //
  //       setTimeout(() => {
  //         console.log("Results printed to the file");
  //         trigger(result);
  //         setTimeout(() => {
  //           const reduced = fileSystem(dir);
  //           fs.writeFileSync("./logs/reduced.json", JSON.stringify(reduced));
  //         }, 4000);
  //       }, 210000);
  //     }, 150000);
  //   }, 12000);
  // }, 12000);
}
const trigger = (importsFrom, importsTo, styleImports, result) => {
  setTimeout(() => {
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
  }, 60000);
};

// const dir = "../../../../testinng-repos/project_modern_ui_ux_gpt3/src";
// let dir = "../../testinng-repos/space-tourism/src";
// let dir = "../detailPane";
let dir = "../../testinng-repos/mattermost-webapp";
dir = path.resolve(dir);
// const dir = "../../../../testinng-repos/screenREC/src";
// const dir = "../../contacts";
wrapper(dir);
