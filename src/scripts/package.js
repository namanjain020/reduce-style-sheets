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
import { mixinParse } from "./mixinParse.js";
import { variableParse } from "./variableParse.js";
import { unusedVariables } from "./unusedVariables.js";
import { emptyBlock } from "./emptyBlock.js";
import { variableReplace } from "./variableReplace.js";
import { stylesheetRemoverWithoutInit } from "./stylesheetRemoverWithoutInit.js";
import { mixinReplace } from "./mixinReplace.js";

async function deleteAllFilesInDir(dirPath) {
  try {
    fs.readdirSync(dirPath).forEach((file) => {
      fs.rmSync(path.join(dirPath, file));
    });
  } catch (error) {
    console.log(error);
  }
}

export async function wrapper(dir) {
  if (fs.existsSync("logs")) {
    deleteAllFilesInDir("./logs");
    fs.rmdirSync("./logs");
  }
  fs.mkdirSync("logs");
  let counter = 0;
  let variablePath = "./src/scripts/bins/variables.scss";
  let mixinPath = "./src/scripts/bins/mixin.scss";
  variablePath = path.resolve(variablePath);
  mixinPath = path.resolve(mixinPath);
  const original = fileSystem(dir, counter);
  let importsTo = {},
    importsFrom = {},
    styleImports = {},
    result = {},
    globalVariables = {},
    globalMixins = {};
  await importMap(dir, importsTo, importsFrom, styleImports);
  await mixinParse(dir, globalMixins, mixinPath);
  await variableParse(dir, globalVariables, variablePath);
  await stylesheetRemover(dir, importsTo, styleImports, result);
  await stylesheetReducer(dir, importsFrom, importsTo, styleImports, result);
  setTimeout(async () => {
    await mixinReplace(dir, globalMixins);
    await middleTraverse(dir, importsTo, styleImports, result);
    setTimeout(async () => {
      await mixinReplace(dir, globalMixins);
      await variableReplace(dir, globalVariables);
      await variableReplace(dir, globalVariables);
      await emptyBlock(dir);
      setTimeout(async () => {
        await variableReplace(dir, globalVariables);
        await mixinReplace(dir, globalMixins);
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
          setTimeout(async () => {
            await stylesheetConverter(
              dir,
              importsFrom,
              importsTo,
              styleImports,
              result,
              globalVariables
            );
            await emptyBlock(dir);
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
                await emptyBlock(dir);
                await stylesheetRemoverWithoutInit(
                  dir,
                  importsTo,
                  styleImports,
                  result
                );
                setTimeout(async () => {
                  await finalTraverse(dir, importsTo, styleImports, result);
                  setTimeout(async () => {
                    trigger(dir, importsFrom, importsTo, styleImports, result);
                  }, 60000);
                }, 60000);
              }, 60000);
            }, 60000);
          }, 60000);
        }, 60000);
      }, 60000);
    }, 60000);
  }, 60000);
}
const trigger = async (dir, importsFrom, importsTo, styleImports, result) => {
  setTimeout(async () => {
    console.log("RESULTS HAVE BEEN PRINTED");
    fs.writeFileSync(
      "./logs/results.json",
      prettier.format(JSON.stringify(result), { parser: "json" })
    );
  }, 60000);
};

