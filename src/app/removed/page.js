"use client";
import Sidebar from "../components/SideBar";
import { JSONTree } from "react-json-tree";
import MergeRequest from "../components/MergeRequest";
import "./removed.css";
import CodeBlock from "../components/CodeBlock";
import Table from './components/table.js';
// If you're using Immutable.js: `npm i --save immutable`
import { Map } from "immutable";
import obj from "../../../../distributed-result/removedBlocks.json";
import { useEffect, useState, useRef } from "react";
// use the component in your app!



const theme = {
  scheme: "monokai",
  author: "wimer hazenberg (http://www.monokai.nl)",
  base00: "#272822",
  base01: "#383830",
  base02: "#49483e",
  base03: "#75715e",
  base04: "#a59f85",
  base05: "#f8f8f2",
  base06: "#f5f4f1",
  base07: "#f9f8f5",
  base08: "#f92672",
  base09: "#fd971f",
  base0A: "#f4bf75",
  base0B: "#a6e22e",
  base0C: "#a1efe4",
  base0D: "#66d9ef",
  base0E: "#ae81ff",
  base0F: "#cc6633",
};

export default function Home() {
  const newobj = structuredClone(obj);
  const files = Object.keys(newobj);
  // var filename = fullPath.replace(/^.*[\\\/]/, '')
  // const data = [{ name: "test1" }, { name: "test2" }];
  const listItems = files.map((d) => <li key={d.name}>{d.replace(/^.*[\\\/]/, '')}</li>);
  // const codeRef = useRef(null);
  // let json;
  // let newobj;

  // newobj = structuredClone(obj);
  const COLUMNS = ['Name', 'Age', 'Address'];
  const DATA = [
    ['Sarah Brown', 31, '100 Broadway St., New York City, New York'],
    ['Jane Smith', 32, '100 Market St., San Francisco, California'],
    ['Joe Black', 33, '100 Macquarie St., Sydney, Australia'],
  ];
  // const keys = Object.keys(newobj);
  // keys.forEach((key) => {
  //   const newKey = key.replace(
  //     "/Users/nikunjshah/Desktop/work/sprinklr-app-client/apps/distributed-app/",
  //     ".../"
  //   );
  //   newobj[newKey] = newobj[key];
  //   delete newobj[key];
  // });
  const content = `
  .activityHeader {\n  height: 5 * $spacer;\n  border-bottom: 0.1rem solid $azure;\n  @include media('>md') {\n    padding: 0 1.2rem;\n  }\n  @include media('<sm') {\n    margin-bottom: $spacer;\n  }\n}`;
  const diff = [
    '.visit-marketplace {',
    '+ top: 1px',
    'font-size: 12px;',
    '-text-align: center;',
    '}',
  ];
  return (
    <>
      <Sidebar class="${styles.class} ">
        <header>
          <h1 className="text-5xl p-3">Reduce StyleSheets</h1>
          <h2 className="text-3xl p-4 ">Style reduced</h2>
        </header>
        <MergeRequest diff={diff} />
        <CodeBlock content={content}/>
        <div className="shadow-xl p-0 m-4 bg-white rounded">
          <h2>StyleSheets</h2>
          <Table></Table>
        </div>
        <div className="pl-5">
          {/* <JSONTree theme={theme} data={newobj} />; */}
        </div>
      </Sidebar>
    </>
  );
}
