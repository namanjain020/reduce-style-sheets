"use client";
import "./removed.css";
import RightPane from "./rightPane.js";

import Link from 'next/link';
import CardComponent from "./components/CardComponent";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
// If you're using Immutable.js: `npm i --save immutable`
// use the component in your app!

import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className={roboto.className}>
      <div className="flex overflow-clip">
          <RightPane />
      </div>
    </div>
  );
}
