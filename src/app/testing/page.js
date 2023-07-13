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
        <div className="w-2/12 bg-white text-3xl drop-shadow-2xl content-center">
          <div className="w-4/5 m-4 p-4 drop-shadow-lg text-center text-sm">
          <Card className=" hover:bg-slate-100">
          <Link href='/dst'>
            <CardBody>
             <p>Distributed-app</p>
            </CardBody>
            </Link>
          </Card>
          </div>
          <div className="w-4/5 m-4 p-4 drop-shadow-lg text-center text-sm">
          <Card className=" hover:bg-slate-100 ">
          <Link href='/mattermost'>
            <CardBody>
             <p>Mattermost-webapp</p>
            </CardBody>
            </Link>
          </Card>
          </div>
          <div className="w-4/5 m-4 p-4 drop-shadow-lg text-center text-sm">
          <Card className=" hover:bg-slate-100">
          <Link href='/testing'>
            <CardBody>
             <p>Testing-repo</p>
            </CardBody>
            </Link>
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
