"use client";
import Sidebar from "../components/SideBar";
// import { JSONTree } from "react-json-tree";
import "./removed.css";

import Table from "./components/table.js";
// If you're using Immutable.js: `npm i --save immutable`
import Overall from "./components/overall.js";
import obj from "../../../results/dst6.json";
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
      <Overall data={obj}></Overall>
      <Table data={obj}></Table>
      <div className="pl-5"></div>
    </div>
  );
}
