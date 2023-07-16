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
        <div className="border-1">
          <AccordionButton className="py-4 px-0">
            <Tooltip
              label={file}
              hasArrow
              aria-label="A tooltip"
              bg="gray.300"
              color="black"
              placement="bottom"
            >
              <p className="w-[36rem] pl-8  flex  justify-self-start">
                {file.replace(/^.*[\\\/]/, "")}
              </p>
            </Tooltip>

            <p className="w-[12rem] flex justify-self-start">
              {result[file]["original-size"]} KB
            </p>
            <p className=" w-[12rem] flex  justify-self-start">
              {result[file]["size-after-unused"]} KB
            </p>
            <div className="  w-[20rem]">
              {/* <p className="p-0">{Math.round(
                  (result[file]["size-after-unused"] /
                    result[file]["original-size"]) *
                    100
                )} %</p> */}
              <Progress
                val={Math.round(
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
              label={file}
              hasArrow
              aria-label="A tooltip"
              bg="gray.300"
              color="black"
              placement="bottom"
            >
              <p className="w-[36rem] pl-8  flex  justify-self-start">
                {file.replace(/^.*[\\\/]/, "")}
              </p>
            </Tooltip>
            <p className="w-[12rem] flex justify-self-start">
              {result[file]["size-after-unused"]} KB
            </p>
            <p className=" w-[12rem] flex justify-self-start">
              {result[file]["final-size"]} KB
            </p>
            <div className=" w-[20rem] ">
              {/* <p className="p-0">{Math.round(
                  (result[file]["final-size"] /
                    result[file]["size-after-unused"]) *
                    100
                )} %</p> */}
              <Progress
                val={Math.round(
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
      <div className="shadow-xl p-0 my-8 mx-20  bg-white rounded-md">
        <div>
          <p className="px-6 pt-4 pb-1 text-2xl">Stylesheet files</p>
          <p className="text-xl pl-6 pb-2 text-slate-500">
            CSS, SCSS, LESS Files in the codebase
          </p>
        </div>
        <Tabs isFitted variant="line" size="lg">
          <TabList>
            <Tab>Unused Classes</Tab>
            <Tab>Styles to Utility Classes</Tab>
            <Tab>Analytics</Tab>
          </TabList>
          <TabPanels>
            <TabPanel className="p-0">
              <div className="bg-slate-100  font-bold flex">
                <p className="w-[36rem] py-4 pl-8 flex justify-self-start">
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
              <div className="bg-slate-100 font-bold flex">
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
            <TabPanel>
              <div>
                <Chart
                  chartType="PieChart"
                  data={info}
                  options={options}
                  width={"100%"}
                  height={"500px"}
                />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </>
  );
}

export default Table;
