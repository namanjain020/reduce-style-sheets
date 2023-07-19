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
  let files = Object.keys(result);
  files.sort();
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
      <AccordionItem className="" style={{borderLeftWidth:"1px",borderTopWidth:"1px",borderBottomWidth:"0px",borderRightWidth:"1px"}}>
        <div className="">
          <AccordionButton
            _hover={{backgroundColor:"#F8F8FA"}}
            _expanded={{ color: "#0E61F6", backgroundColor: "#F8F8FA" }}
            
            className={result[file]["empty"]?"bg-[#C70F5C]/[.2] px-0 py-[0.5rem]":"bg-white px-0 py-[0.5rem]"}
          
          >
            <span className="w-[36rem] pl-[0.8rem]  flex  justify-self-start text-[14px] font-normal">
              <Tooltip
                style={{ borderRadius: "12px" }}
                label={file.substring(file.indexOf("app-client"))}
                hasArrow
                aria-label="A tooltip"
                bg="black"
                color="white"
                placement="left"
              >
                {file.replace(/^.*[\\\/]/, "")}
              </Tooltip>
            </span>

            <span className="w-[12rem] flex justify-self-start text-[14px] font-normal">
              {result[file]["original-size"]} KB
            </span>
            <span className=" w-[12rem] flex  justify-self-start text-[14px] font-normal">
              {result[file]["size-after-unused"]} KB
            </span>
            <div className="w-[24rem] pr-4 text-left">
              <span className="p-0 align-left mb-[4px] text-[14px] font-semibold">
                {Math.round(
                  100 -
                    (result[file]["size-after-unused"] /
                      result[file]["original-size"]) *
                      100
                )}{" "}
                %
              </span>

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
      <AccordionItem     style={{borderLeftWidth:"1px",borderTopWidth:"1px",borderBottomWidth:"0px",borderRightWidth:"1px"}}>
        <div className="border-1">
        <AccordionButton 
            _hover={{backgroundColor:"#F8F8FA"}}
            _expanded={{ color: "#0E61F6", backgroundColor: "#F8F8FA" }}
            className={result[file]["empty"]?"bg-[#C70F5C]/[.2] px-0 py-[0.5rem]":"bg-white px-0 py-[0.5rem]"}
          >
            <span className="w-[36rem] pl-[0.8rem]  flex  justify-self-start text-[14px] font-normal">
              <Tooltip
                style={{ borderRadius: "12px" }}
                label={file.substring(file.indexOf("app-client"))}
                hasArrow
                aria-label="A tooltip"
                bg="black"
                color="white"
                placement="left"
              >
                {file.replace(/^.*[\\\/]/, "")}
              </Tooltip>
            </span>

            <p className="w-[12rem] flex justify-self-start text-[14px] font-normal">
              {result[file]["size-after-unused"]} KB
            </p>
            <p className=" w-[12rem] flex  justify-self-start text-[14px] font-normal">
              {result[file]["final-size"]} KB
            </p>
            <div className="  w-[24rem] pr-4 text-left">
              <span className="p-0 align-left mb-[4px] text-[14px] font-semibold">
                {Math.round(
                  100 -
                    (result[file]["final-size"] /
                      result[file]["size-after-unused"]) *
                      100
                )}{" "}
                %
              </span>
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
      <div className="rounded-[12px] w-3/4 p-4  mx-20 bg-white overflow-hidden">
        <div>
          <p className=" pb-[0.1rem] text-[16px] font-semibold">Stylesheet files</p>
          <p className="  text-[14px] italic font-normal text-slate-500">
            CSS, SCSS, LESS Files in the codebase
          </p>
        </div>
        <div>
          <Tabs isFitted variant="line" size="md">
            <div>
              <TabList>
                <Tab>Unused Classes</Tab>
                <Tab>Styles to Utility Classes</Tab>
              </TabList>
            </div>
            <div className=" border-[#DBDBDB] border-b-[1px] rounded-b-lg mt-2" >
              <TabPanels>
                <TabPanel className="p-0">
                  <div className="border-t-[1px] border-x-[1px] rounded-t-lg bg-[#F8F8FA] text-[13px] font-semibold flex py-[0.5rem]">
                    <p className="w-[36rem]  pl-[0.8rem] flex justify-self-start ">
                      File Name
                    </p>
                    <p className="w-[12rem]   flex justify-self-start">
                      Size Before
                    </p>
                    <p className=" w-[12rem]  flex justify-self-start">
                      Size After
                    </p>
                    <p className=" w-[24rem]  flex justify-self-start">
                      Visualiser
                    </p>
                  </div>
                  <Accordion allowToggle>
                    <div className="w-full">{unusedClasses}</div>
                  </Accordion>
                  <div className="table-container w-full m-0 p-0"></div>
                </TabPanel>
                <TabPanel className="p-0">
                <div className="border-t-[1px] border-x-[1px] rounded-t-lg bg-[#F8F8FA] text-[13px] font-semibold flex py-[0.5rem]">
                      <p className="w-[36rem] pl-[0.8rem] flex justify-self-start">
                      File Name
                    </p>
                    <p className="w-[12rem]  flex justify-self-start">
                      Size Before
                    </p>
                    <p className=" w-[12rem]  flex justify-self-start">
                      Size After
                    </p>
                    <p className="w-[24rem]  flex justify-self-start">
                      Visualiser
                    </p>
                  </div>
                  <Accordion allowToggle>
                    <div className="w-full">{replaced}</div>
                  </Accordion>
                  <div className="table-container w-full m-0 p-0"></div>
                </TabPanel>
              </TabPanels>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default Table;
