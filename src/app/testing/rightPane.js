"use client";
import Sidebar from "../components/SideBar";
// import { JSONTree } from "react-json-tree";
import "./removed.css";
import Table from "./components/table.js";
// If you're using Immutable.js: `npm i --save immutable`
import Overall from "./components/overall.js";
import obj from "../../../results/testing.json";
// use the component in your app!

import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function RightPane() {
  const newobj = structuredClone(obj);
  const files = Object.keys(newobj);
  const listItems = files.map((d) => (
    <li key={d.name}>{d.replace(/^.*[\\\/]/, "")}</li>
  ));

  return (
    <div className="w-full">
      <div className="mx-10 p-4">
        <h1 className=" text-5xl p-3">Reduce StyleSheets</h1>
        <h2 className="text-3xl p-4">testing-app</h2>
      </div>
      <Overall data={obj}></Overall>
      <Table data={obj}></Table>
      <div className="pl-5">
        {/* <JSONTree theme={theme} data={newobj} />; */}
      </div>
    </div>
  );
}
