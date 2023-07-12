"use client";
import Sidebar from "../components/SideBar";
// import { JSONTree } from "react-json-tree";
import MergeRequest from "../components/MergeRequest";
import "./removed.css";
import CodeBlock from "../components/CodeBlock";
import Table from "./components/table.js";
import RightPane from "./rightPane.js";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
// If you're using Immutable.js: `npm i --save immutable`
import { Map } from "immutable";
import Overall from "./components/overall.js";
import obj from "../../../results/dst.json";
import { useEffect, useState, useRef } from "react";
import UnifiedDiffView from "../components/MergeRequest";
// use the component in your app!

import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});


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
      <div className="flex">

        <RightPane />
      </div>
    </div>
  );
}
