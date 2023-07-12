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
  // var filename = fullPath.replace(/^.*[\\\/]/, '')
  // const data = [{ name: "test1" }, { name: "test2" }];

  // newobj = structuredClone(obj);
  return (
    <div className={roboto.className}>
      <div className="flex overflow-clip">
        <div className="w-2/12 bg-white text-3xl drop-shadow-2xl ">
          <div className="m-2 p-2 drop-shadow-lg">
          <Card>
          <Link href='/distributed-app'>
            <CardBody>
             <p>distributed-app</p>
            </CardBody>
            </Link>
          </Card>
          </div>
          <div className="m-2 p-2 drop-shadow-lg">
          <Card>
          <Link href='/mattermost-webapp'>
            <CardBody>
             <p>mattermost-webapp</p>
            </CardBody>
            </Link>
          </Card>
          </div>
          <div className="m-2 p-2 drop-shadow-lg">
          <Card>
            <CardBody>
             <p>testing-repo</p>
            </CardBody>
          </Card>
          </div>
        </div>
        <div className="w-10/12">
          <RightPane />
        </div>
      </div>
    </div>
  );
}
