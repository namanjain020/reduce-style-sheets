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

async function wrapper2(dir) {
  const importsTo = {},
    styleImports = {},result ={};
  await finalTraverse(dir, importsTo, styleImports, result);
  console.log(result);
  fs.writeFileSync(
    "./logs/finalResults.json",
    prettier.format(JSON.stringify(result), { parser: "json" })
  );
}

// const trigger = async (dir, importsFrom, importsTo, styleImports, result) => {

//   setTimeout(async () => {
//     console.log("RESULTS HAVE BEEN PRINTED");
//     // console.log(result);
//     // fs.writeFileSync(
//     //   "./logs/importsTo.json",
//     //   prettier.format(JSON.stringify(importsTo), { parser: "json" })
//     // );
//     // fs.writeFileSync(
//     //   "./logs/importsFrom.json",
//     //   prettier.format(JSON.stringify(importsFrom), { parser: "json" })
//     // );
//     // fs.writeFileSync(
//     //   "./logs/styleImports.json",
//     //   prettier.format(JSON.stringify(styleImports), { parser: "json" })
//     // );
//     fs.writeFileSync(
//       "./logs/results.json",
//       prettier.format(JSON.stringify(result), { parser: "json" })
//     );
//   }, 100000);
// };

// const dir = "../../../../testinng-repos/project_modern_ui_ux_gpt3/src";
// let dir = "../../testinng-repos/space-tourism/src";
// let dir = "../detailPane";
let dir = "../../testinng-repos/mattermost-webapp";
// let dir = "../detailPaneCopy";
dir = path.resolve(dir);
// const dir = "../../../../testinng-repos/screenREC/src";

wrapper2(dir);
