"use client";
import Sidebar from "../components/SideBar";
// import { JSONTree } from "react-json-tree";
import MergeRequest from "../components/MergeRequest";
import "./removed.css";
import CodeBlock from "../components/CodeBlock";
import Table from "./components/table.js";
// If you're using Immutable.js: `npm i --save immutable`
import { Map } from "immutable";
import Overall from "./components/overall.js";
import obj from "../../../dst-logs/removedBlocks (1).json";
import { useEffect, useState, useRef } from "react";
import UnifiedDiffView from "../components/MergeRequest";
// use the component in your app!

import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

const dummy = {
  "/Users/nikunjshah/Desktop/work/sprinklr-app-client/apps/distributed-app/components/engagementEntity/taskItem/variants/profileTask/profileTask.mod.scss":
    {
      "original-size": 0.306,
      unused: false,
      empty: false,
      "unused-classes": {},
      "replaced-tailwind": {},
      "reduced-size": 306,
    },
  "/Users/nikunjshah/Desktop/work/sprinklr-app-client/apps/distributed-app/components/engagementEntity/universalCaseMessage/universalCaseMessage.mod.scss":
    {
      "original-size": 0.212,
      unused: false,
      empty: false,
      "unused-classes": {},
      "replaced-tailwind": {
        ".dialog": {
          original: ".dialog {\n  width: 90 * $spacer;\n  height: 90%;\n}",
          converted: "w-[90_*_$spacer] h-[90%]",
        },
      },
      "reduced-size": 212,
    },
  "/Users/nikunjshah/Desktop/work/sprinklr-app-client/apps/distributed-app/components/faq/FAQDetailsContainer.mod.scss":
    {
      "original-size": 0.735,
      unused: false,
      empty: false,
      "unused-classes": {
        faqIcon:
          " {\n  fill: $faq-icon-color;\n  @include size($faq-icon-size);\n  margin-top: 0.6rem;\n}",
      },
      "replaced-tailwind": {
        ".faqDetails": {
          original:
            ".faqDetails {\n  width: $content-width;\n  max-width: 100%;\n  border-radius: $spacer/2;\n}",
          converted: "w-[$content-width] max-w-full rounded-[$spacer/2]",
        },
        ".faqDescriptionCont": {
          original:
            ".faqDescriptionCont {\n  @extend .faqDetails;\n  .faqDescriptionHeading {\n    font-size: 2rem;\n  }\n}",
          converted: "text-[2rem]",
        },
        ".faqCont": {
          original:
            ".faqCont {\n  padding: 3 * $spacer 0;\n  @include media('<lg') {\n    padding: 0;\n  }\n}",
          converted: "pr-[*] pt-[3] pb-[$spacer] p-0",
        },
      },
      "reduced-size": 641,
    },
  "/Users/nikunjshah/Desktop/work/sprinklr-app-client/apps/distributed-app/components/filter/components/Filter/filter.mod.scss":
    {
      "original-size": 0.735,
      unused: false,
      empty: false,
      "unused-classes": {
        activeFilterIcon:
          " {\n  .filterActionIcon {\n    visibility: visible;\n  }\n}",
        filterActionIcon: " {\n  visibility: hidden;\n}",
        "flex-order-1": " {\n  order: 1;\n}",
        blurBg:
          " {\n  background-color: rgba(255, 255, 255, 0.7);\n  z-index: 2;\n}",
        saveNameInput:
          " {\n  border: 0.1rem solid $ash;\n\n  &:focus {\n    border: 0.1rem solid $active-color;\n  }\n}",
        saveOptionsContainer: " {\n  border: 0;\n}",
      },
      "replaced-tailwind": {
        ".filterOption": {
          original: ".filterOption {\n  margin: 0 !important;\n}",
          converted: "m-0",
        },
      },
      "reduced-size": 366,
    },
};

export default function Home() {
  const newobj = structuredClone(obj);
  const files = Object.keys(newobj);
  // var filename = fullPath.replace(/^.*[\\\/]/, '')
  // const data = [{ name: "test1" }, { name: "test2" }];
  const listItems = files.map((d) => (
    <li key={d.name}>{d.replace(/^.*[\\\/]/, "")}</li>
  ));
  // const codeRef = useRef(null);
  // let json;
  // let newobj;

  // newobj = structuredClone(obj);
  const COLUMNS = ["Name", "Age", "Address"];
  const DATA = [
    ["Sarah Brown", 31, "100 Broadway St., New York City, New York"],
    ["Jane Smith", 32, "100 Market St., San Francisco, California"],
    ["Joe Black", 33, "100 Macquarie St., Sydney, Australia"],
  ];
  const content = `
  .activityHeader {\n  height: 5 * $spacer;\n  border-bottom: 0.1rem solid $azure;\n  @include media('>md') {\n    padding: 0 1.2rem;\n  }\n  @include media('<sm') {\n    margin-bottom: $spacer;\n  }\n}`;
  // const diff = [
  //   '.visit-marketplace {',
  //   '+ top: 1px',
  //   'font-size: 12px;',
  //   '-text-align: center;',
  //   '}',
  // ];
  const diff = [
    {
      type: "added",
      content:
        '+ const newFunction = () => {\n+   console.log("This is a new function");\n+ }',
    },
    {
      type: "unchanged",
      content: 'function hello() {\n  console.log("Hello, World!");\n}',
    },
    {
      type: "deleted",
      content: '- function greet() {\n-   console.log("Greetings!");\n- }',
    },
  ];
  return (
    <div className={roboto.className}>
      <>
        {/* <Sidebar class="${styles.class} "> */}
        <div className="mx-20  ">
          <h1 className=" text-5xl p-3">Reduce StyleSheets</h1>
          <h2 className="text-3xl p-4 ">Style reduced</h2>
        </div>
        <Overall data={obj}></Overall>
        {/* <UnifiedDiffView diff={diff}/> */}
        {/* <MergeRequest diff={diff} /> */}
        {/* <CodeBlock content={content}/> */}
        <Table data={obj}></Table>

        <div className="pl-5">
          {/* <JSONTree theme={theme} data={newobj} />; */}
        </div>
        {/* </Sidebar> */}
      </>
    </div>
  );
}
