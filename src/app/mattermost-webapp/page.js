"use client";
import "./removed.css";
import RightPane from "./rightPane.js";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
// If you're using Immutable.js: `npm i --save immutable`
// use the component in your app!

import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});



export default function Home() {
  // var filename = fullPath.replace(/^.*[\\\/]/, '')
  // const data = [{ name: "test1" }, { name: "test2" }];
  
  // newobj = structuredClone(obj);
  return (
    <div className={roboto.className}>
      <div className="flex overflow-clip">
        <div className="w-1/12 bg-white text-3xl drop-shadow-2xl " >
        </div>
        <div className="w-11/12">
        <RightPane />
        </div>
      </div>
    </div>
  );
}
