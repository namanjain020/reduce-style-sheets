"use client";
import "./table.css";
import Image from "next/image";
import Progress from "./Progress";
import { CountUp } from 'use-count-up'

function Overall(props) {
  const totalFiles = Object.keys(props.data).length;
  const files = Object.keys(props.data);
  let originalSize = 0;
  let reducedSize = 0;
  let remaining = 0;
  let unused = 0;
  files.forEach((file) => {
    originalSize += props.data[file]["original-size"];
    reducedSize += props.data[file]["size-after-unused"];
    remaining += props.data[file]["final-size"];
    unused += Object.keys(props.data[file]["unused-classes"]).length;
  });
  return (
    <>
      <div className="shadow-xl p-4 my-6 mx-20 bg-white rounded-md text-xl text-slate-400">
        <p className="text-slate-800 text-2xl py-2 ">Overall Statistics</p>
        <p className="text-slate-700">Total number of stylesheets parsed: </p>
        <CountUp isCounting end={totalFiles} duration={2} />
        <p className="text-slate-700">
          Total Size of the codebase: 
        </p>
        <CountUp isCounting end={Math.round(originalSize * 100) / 100} duration={2} />
        <p className="text-slate-700">Size of unused styles:</p>
        <CountUp isCounting end={Math.round((originalSize-reducedSize) * 100) / 100} duration={2} />
        <p className="text-slate-700">Size of converted styles:</p>
        <CountUp isCounting end={Math.round((reducedSize-remaining) * 100) / 100} duration={2} />
        <p className="text-slate-700">Final size of codebase: </p>
        <CountUp isCounting end={Math.round(remaining * 100) / 100} duration={2} />
        <p className="text-slate-700">Number of unused classes found: </p>
        <CountUp isCounting end={unused} duration={2} />
      </div>
    </>
  );
}

export default Overall;
