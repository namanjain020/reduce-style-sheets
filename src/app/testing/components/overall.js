"use client";
import "./table.css";
import Image from "next/image";
import Progress from "./Progress";
import { CountUp } from "use-count-up";

import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";

function Overall(props) {
  const totalFiles = Object.keys(props.data).length;
  const files = Object.keys(props.data);
  let originalSize = 0;
  let reducedSize = 0;
  let remaining = 0;
  let unused = 0;
  files.forEach((file) => {
    if (props.data[file]["original-size"]) {
      originalSize += props.data[file]["original-size"];
    }
    if (props.data[file]["size-after-unused"]) {
      reducedSize += props.data[file]["size-after-unused"];
    }
    if (props.data[file]["final-size"]) {
      remaining += props.data[file]["final-size"];
    }
    if (props.data[file]["unused-classes"]) {
      unused += Object.keys(props.data[file]["unused-classes"]).length;
    }
  });

  return (
    <>
      <div className="shadow-xl p-4 my-6 mx-20 bg-white rounded-md text-xl text-slate-400 font-sans">
      <div className="px-6 py-3">
        <h1 className="text-4xl text-black">Reduce StyleSheets</h1>
        <h2 className="text-2xl pt-1 text-slate-500">Testing Repository</h2>
      </div>
        <div className=" flex bg-white text-3xl justify-between px-6 my-2">
          <div className=" flex drop-shadow-lg text-center text-sm">
            <Card className=" hover:bg-slate-300">
              <Link href="/dst">
                <CardBody>
                  <p>Distributed-app</p>
                </CardBody>
              </Link>
            </Card>
          </div>
          <div className="flex   drop-shadow-lg text-center text-sm">
            <Card className=" hover:bg-slate-300">
              <Link href="/mattermost">
                <CardBody>
                  <p>Mattermost-webapp</p>
                </CardBody>
              </Link>
            </Card>
          </div>
          <div className="flex  drop-shadow-lg text-center text-sm">
            <Card className=" hover:bg-slate-300">
              <Link href="/testing">
                <CardBody>
                  <p>Testing-repository</p>
                </CardBody>
              </Link>
            </Card>
          </div>
        </div>
        <p className="text-slate-800 text-3xl py-2 px-6 ">Overall Statistics</p>

        <div className="px-6">
          <p className="text-slate-700">Total number of stylesheets parsed: </p>
          <CountUp isCounting end={totalFiles} duration={2} />
          <p className="text-slate-700">Total Size:</p>
          <CountUp
            isCounting
            end={Math.round(originalSize * 100) / 100}
            duration={2}
          />
          <p className="text-slate-700">Size of unused styles:</p>
          <CountUp
            isCounting
            end={Math.round((originalSize - reducedSize) * 100) / 100}
            duration={2}
          />

          <p className="text-slate-700">Size of converted styles:</p>
          <CountUp
            isCounting
            end={Math.round((reducedSize - remaining) * 100) / 100}
            duration={2}
          />
          <p className="text-slate-700">Final size </p>
          <CountUp
            isCounting
            end={Math.round(remaining * 100) / 100}
            duration={2}
          />
          <p className="text-slate-700">Number of unused classes found: </p>
          <CountUp isCounting end={unused} duration={2} />
        </div>
      </div>

    </>
  );
}

export default Overall;
