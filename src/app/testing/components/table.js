"use client";
import "./table.css";
import Image from "next/image";
import Progress from "./Progress";
import CodeBlock from "./codeblock.js";
import TailwindCodeBlock from "./tailwindBlock.js";
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
  let totalOriginalSize = 0;
  let sizeAfterUnused = 0;
  let sizeFinal = 0;
  Object.keys(result).forEach((file) => {
    totalOriginalSize += result[file]["original-size"];
    sizeAfterUnused += result[file]["size-after-unused"];
    sizeFinal += result[file]["final-size"];
  });
  console.log(totalOriginalSize);
  const info = [
    ["Task", "in KB"],
    ["Remaining", sizeFinal],
    ["Converted", sizeAfterUnused - sizeFinal],
    ["Unused Classes", totalOriginalSize - sizeAfterUnused],
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
    <div key={file.id} >
      
      <AccordionItem>
        <div className="border-2">
          <AccordionButton>
            
            
                <p className="w-[36rem] py-3 pl-6">
                {file.replace(/^.*[\\\/]/, "")}
              </p>
              <p className="w-[12rem] py-3">
                {result[file]["original-size"]} KB
              </p>
              <p className=" w-[12rem] py-3">
                {result[file]["size-after-unused"]} KB
              </p>
              <div className="p-5  w-[22rem]">
                <Progress 
                  val={Math.round(
                    (result[file]["reduced-size"] /
                      1000 /
                      result[file]["original-size"]) *
                      100
                  )}
                />
              </div>
          </AccordionButton>

          <AccordionPanel>
            <CodeBlock
              unused={result[file]["unused-classes"]}
              tw={result[file]["replaced-tailwind"]}
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
        <div className="current border-2">
          <AccordionButton>
              <p className="w-[36rem] py-3 pl-6">
                {file.replace(/^.*[\\\/]/, "")}
              </p>
              <p className="w-[12rem] py-3">
                {result[file]["size-after-unused"]} KB
              </p>
              <p className="w-[12rem] py-3">{result[file]["final-size"]} KB</p>
              <div className=" w-[22rem] p-5">
                <Progress
                  val={Math.round(
                    (result[file]["reduced-size"] /
                      1000 /
                      result[file]["original-size"]) *
                      100
                  )}
                />
            </div>
          </AccordionButton>

          <AccordionPanel>
            <TailwindCodeBlock tailwind={result[file]["replaced-tailwind"]} />
          </AccordionPanel>
        </div>
      </AccordionItem>
    </div>
  ));

  return (
    <>
      <div className="shadow-xl p-0 my-8 mx-20  bg-white rounded-md">
        <div>
          <p className="px-4 pt-4 pb-1 text-xl">Stylesheet files</p>
          <p className="text-sm pl-4 pb-2 text-slate-500">
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
            <TabPanel>
              <div className="bg-slate-100 py-1 font-bold flex p-2">
                
                <p className="w-[36rem] py-4 pl-8">File Name</p>
                <p className="w-[12rem] py-4">Size Before</p>
                <p className=" w-[12rem] py-4">Size After</p>
                <p className=" w-[22rem] py-4">Visualiser</p>
              </div>
              <Accordion allowToggle>
                <div className="w-full">{unusedClasses}</div>
              </Accordion>
              <div className="table-container w-full m-0 p-0"></div>
            </TabPanel>
            <TabPanel>
              <div className="bg-slate-100 py-1 font-bold flex p-2">
                
                <p className="w-[36rem] py-4 pl-8">File Name</p>
                <p className="w-[12rem] py-4">Size Before</p>
                <p className=" w-[12rem] py-4">Size After</p>
                <p className=" w-[22rem] py-4">Visualiser</p>
              </div>
              <Accordion allowToggle>
                <div>{replaced}</div>
              </Accordion>
              <div className="table-container w-full m-0 p-0"></div>
            </TabPanel>
            <TabPanel>
              <div className="w-[40rem]">
                <Chart
                  chartType="PieChart"
                  data={info}
                  options={options}
                  width={"100%"}
                  height={"600px"}
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
