"use client";
import "./table.css";
import Image from "next/image";
import Progress from "./Progress";
import CodeBlock from "./codeblock.js";
import TailwindCodeBlock from "./tailwindBlock.js";
import { Tooltip } from "@chakra-ui/react";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { Chart } from "react-google-charts";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

function Table(props) {
  let result = structuredClone(props.data);
  const files = Object.keys(result);
  let originalSize = 0;
  let reducedSize = 0;
  let remaining = 0;
  let unused = 0;
  files.forEach((file) => {
    if (props.data[file]["original-size"]) {
      originalSize += props.data[file]["original-size"];
    }
    if (props.data[file]["size-after-unused"]) {
      reducedSize += props.data[file]["size-after-unused"];
    }
    if (props.data[file]["final-size"]) {
      remaining += props.data[file]["final-size"];
    }
    if (props.data[file]["unused-classes"]) {
      unused += Object.keys(props.data[file]["unused-classes"]).length;
    }
  });
  // console.log(totalOriginalSize);
  const info = [
    ["Task", "in KB"],
    ["Remaining", remaining],
    ["Converted", reducedSize - remaining],
    ["Unused Classes", originalSize - reducedSize],
  ];
  const options = {
    title: "",
  };
  let filesForUnused = [];
  Object.keys(result).forEach((file) => {
    if (result[file]["original-size"] - result[file]["size-after-unused"] > 0) {
      // console.log(file);
      filesForUnused.push(file);
    }
  });
  const unusedClasses = filesForUnused.map((file) => (
    <div key={file.id}>
      <AccordionItem>
        <div className="border-1 ">
          <AccordionButton className="py-4 px-0">
            <Tooltip
              label={file.substring(50)}
              hasArrow
              aria-label="A tooltip"
              bg="black"
              color="white"
              placement="bottom-start"
            >
              <p className="w-[36rem] pl-8  flex  justify-self-start text-[14px] font-normal">
                {file.replace(/^.*[\\\/]/, "")}
              </p>
            </Tooltip>

            <p className="w-[12rem] flex justify-self-start text-[14px] font-normal">
              {result[file]["original-size"]} KB
            </p>
            <p className=" w-[12rem] flex  justify-self-start text-[14px] font-normal">
              {result[file]["size-after-unused"]} KB
            </p>
            <div className="  w-[20rem] pr-4">
              {/* <p className="p-0">
                {Math.round(
                  100 -
                    (result[file]["size-after-unused"] /
                      result[file]["original-size"]) *
                      100
                )}{" "}
                %
              </p> */}
              
                <Progress
                  color={
                    Math.round(
                      100 -
                        (result[file]["size-after-unused"] /
                          result[file]["original-size"]) *
                          100
                    ) > 75
                      ? "green"
                      : Math.round(
                          100 -
                            (result[file]["size-after-unused"] /
                              result[file]["original-size"]) *
                              100
                        ) > 50
                      ? "yellow"
                      : "pink"
                  }
                  val={Math.round(
                    100 -
                      (result[file]["size-after-unused"] /
                        result[file]["original-size"]) *
                        100
                  )}
                />
            </div>
          </AccordionButton>

          <AccordionPanel className="p-0">
            <CodeBlock
              unused={result[file]["unused-classes"]}
              original={result[file]["original-code"]}
              final={result[file]["unused-code"]}
            />
          </AccordionPanel>
        </div>
      </AccordionItem>
    </div>
  ));
  let filesForTW = [];
  Object.keys(result).forEach((file) => {
    if (result[file]["size-after-unused"] - result[file]["final-size"] > 0) {
      filesForTW.push(file);
    }
  });
  const replaced = filesForTW.map((file) => (
    <div key={file.id}>
      <AccordionItem>
        <div className="border-1">
          <AccordionButton className="py-4 px-0">
            <Tooltip
              label={file.substring(50)}
              hasArrow
              aria-label="A tooltip"
              bg="black"
              color="white"
              placement="bottom-start"
            >
              <p className="w-[36rem] pl-8  flex  justify-self-start text-[14px] font-normal">
                {file.replace(/^.*[\\\/]/, "")}
              </p>
            </Tooltip>
            <p className="w-[12rem] flex justify-self-start text-[14px] font-normal">
              {result[file]["size-after-unused"]} KB
            </p>
            <p className=" w-[12rem] flex  justify-self-start text-[14px] font-normal">
               {result[file]["final-size"]} KB
            </p>
            <div className=" w-[20rem] pr-4">
              {/* <p className="p-0">{Math.round(100-
                  (result[file]["final-size"] /
                    result[file]["size-after-unused"]) *
                    100
                )} %</p> */}
                <Progress
                  color={
                    Math.round(
                      100 -
                        (result[file]["final-size"] /
                          result[file]["size-after-unused"]) *
                          100
                    ) > 75
                      ? "green"
                      : Math.round(
                          100 -
                            (result[file]["final-size"] /
                              result[file]["size-after-unused"]) *
                              100
                        ) > 50
                      ? "yellow"
                      : "pink"
                  }
                  val={Math.round(
                    100 -
                      (result[file]["final-size"] /
                        result[file]["size-after-unused"]) *
                        100
                  )}
                />
            </div>
          </AccordionButton>
          <AccordionPanel className="p-0">
            <TailwindCodeBlock
              tailwind={result[file]["replaced-tailwind"]}
              original={result[file]["unused-code"]}
              final={result[file]["final-code"]}
            />
          </AccordionPanel>
        </div>
      </AccordionItem>
    </div>
  ));

  return (
    <>
      <div className="rounded-[12px] w-3/4 p-4 my-4 mx-20 bg-white overflow-hidden">
        <div>
          <p className=" pb-2 text-[16px] font-semibold">Stylesheet files</p>
          <p className="  text-[14px] italic font-normal text-slate-500">
            CSS, SCSS, LESS Files in the codebase
          </p>
        </div>
        <div className="border-2 rounded-lg mt-2">
          <Tabs isFitted variant="line" size="lg" className="py-2">
            <TabList>
              <Tab>Unused Classes</Tab>
              <Tab>Styles to Utility Classes</Tab>
            </TabList>
            <TabPanels>
              <TabPanel className="p-0">
                <div className="bg-slate-100 text-[14px] font-medium flex">
                  <p className="w-[36rem] py-4 pl-8 flex justify-self-start ">
                    File Name
                  </p>
                  <p className="w-[12rem] py-4  flex justify-self-start">
                    Size Before
                  </p>
                  <p className=" w-[12rem] py-4  flex justify-self-start">
                    Size After
                  </p>
                  <p className=" w-[20rem] py-4  flex justify-self-start">
                    Visualiser
                  </p>
                </div>
                <Accordion allowToggle>
                  <div className="w-full">{unusedClasses}</div>
                </Accordion>
                <div className="table-container w-full m-0 p-0"></div>
              </TabPanel>
              <TabPanel className="p-0">
                <div className="bg-slate-100 text-[14px] font-medium flex">
                  <p className="w-[36rem] py-4 pl-8 flex justify-self-start">
                    File Name
                  </p>
                  <p className="w-[12rem] py-4  flex justify-self-start">
                    Size Before
                  </p>
                  <p className=" w-[12rem] py-4  flex justify-self-start">
                    Size After
                  </p>
                  <p className="w-[20rem] py-4  flex justify-self-start">
                    Visualiser
                  </p>
                </div>
                <Accordion allowToggle>
                  <div className="w-full">{replaced}</div>
                </Accordion>
                <div className="table-container w-full m-0 p-0"></div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default Table;
