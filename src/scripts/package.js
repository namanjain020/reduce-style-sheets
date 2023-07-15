import fs from "fs";
import path from "path";
import * as prettier from "prettier";

import { fileSystem } from "./fileSystem.js";
import { importMap } from "./importMap.js";
import { stylesheetRemover } from "./stylesheetRemover.js";
import { stylesheetReducer } from "./stylesheetReducerCopy.js";
import { stylesheetConverter } from "./stylesheetConverterCopy.js";
import { parsingJSFiles } from "./parsingJSFiles.js";
import { finalTraverse } from "./finalTraverse.js";
import { middleTraverse } from "./middleTraverse.js";
import { variableParse } from "./variableParse.js";
import { unusedVariables } from "./unusedVariables.js";
import { emptyBlock } from "./emptyBlock.js";
import { variableReplace } from "./variableReplace.js";
import { stylesheetRemoverWithoutInit } from "./stylesheetRemoverWithoutInit.js";

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
  setTimeout(async () => {
    await stylesheetRemover(dir, importsTo, styleImports, result);
    setTimeout(async () => {
      await stylesheetReducer(
        dir,
        importsFrom,
        importsTo,
        styleImports,
        result
      );
      setTimeout(async () => {
        await unusedVariables(dir);
        setTimeout(async () => {
          await emptyBlock(dir);
          await variableParse(dir, globalVariables);
          await variableReplace(dir);
          await middleTraverse(dir, importsTo, styleImports, result);

          setTimeout(async () => {
            await stylesheetConverter(
              dir,
              importsFrom,
              importsTo,
              styleImports,
              result,
              globalVariables
            );
            setTimeout(async () => {
              await stylesheetConverter(
                dir,
                importsFrom,
                importsTo,
                styleImports,
                result,
                globalVariables
              );
              await unusedVariables(dir);
              await emptyBlock(dir);
              await stylesheetRemoverWithoutInit(
                dir,
                importsTo,
                styleImports,
                result
              );
              trigger();
            }, 200000);
          }, 200000);
        }, 200000);
      }, 200000);
    }, 200000);
  }, 200000);
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
  }, 150000);
};

// const dir = "../../../../testinng-repos/project_modern_ui_ux_gpt3/src";
let dir = "../../testinng-repos/space-tourism/src";
// let dir = "../detailPane";
// let dir = "../../testinng-repos/mattermost-webapp";
// let dir = "../detailPaneCopy";
dir = path.resolve(dir);
// const dir = "../../../../testinng-repos/screenREC/src";

wrapper(dir);
