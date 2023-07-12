"use client";
import "./table.css";
import Image from "next/image";
import Progress from "./Progress";
import CodeBlock from "./codeblock.js";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

function Table(props) {
  let result = structuredClone(props.data);
  let files = [];
  Object.keys(result).forEach((file) => {
    if (
      result[file]["original-size"] - result[file]["size-after-unused"]  >
      0
    ) {
      console.log(file);
      files.push(file);
    }
  });
  const unusedClasses = files.map((file) => (
    <div key={file.id}>
      <AccordionItem>
        <div className="current border-2">
          <AccordionButton>
            <div className="flex">
              <Image
                className="w-10 h-10 p-1 mt-2"
                src="/sass-logo.png"
                width={22}
                height={10}
                alt="sass-logo"
              />
              <div className="p-4">
                <AccordionIcon />
              </div>

              <p className="w-[34rem] py-3 pl-6">
                {file.replace(/^.*[\\\/]/, "")}
              </p>
              <p className="w-[12rem] py-3">
                {result[file]["original-size"]} KB
              </p>
              <p className=" w-[11rem] py-3">
                {result[file]["reduced-size"] / 1000} KB
              </p>
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

  const replaced = files.map((file) => (
    <div key={file.id}>
      <AccordionItem>
        <div className="current border-2">
          <AccordionButton>
            <div className="flex">
              <Image
                className="w-10 h-10 p-1 mt-2"
                src="/sass-logo.png"
                width={22}
                height={10}
                alt="sass-logo"
              />
              <div className="p-4">
                <AccordionIcon />
              </div>

              <p className="w-[34rem] py-3 pl-6">
                {file.replace(/^.*[\\\/]/, "")}
              </p>
              <p className="w-[12rem] py-3">
                {result[file]["original-size"]} KB
              </p>
              <p className=" w-[11rem] py-3">
                {result[file]["reduced-size"] / 1000} KB
              </p>
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
                <div className="w-[7rem]"></div>
                <p className="w-[36rem] py-4 pl-8">File Name</p>
                <p className="w-[12rem] py-4">Size Before</p>
                <p className=" w-[12rem] py-4">Size After</p>
                <p className=" w-[22rem] py-4">Visualiser</p>
              </div>
              <Accordion allowToggle>
                <div>{unusedClasses}</div>
              </Accordion>
              <div className="table-container w-full m-0 p-0"></div>
            </TabPanel>
            <TabPanel>
              <div className="bg-slate-100 py-1 font-bold flex p-2">
                <div className="w-[7rem]"></div>
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
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </>
  );
}

export default Table;
