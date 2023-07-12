"use client";
import "./table.css";
import Image from "next/image";
import Progress from "./Progress";

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
      <div className="shadow-xl p-4 my-8 mx-20 bg-white rounded-md text-xl text-slate-600">
        <p>Total number of stylesheets: {totalFiles}</p>
        <p>
          Total Size of the codebase: {Math.round(originalSize * 100) / 100} KB
        </p>
        <p>Size of unused styles: {Math.round((originalSize-reducedSize) * 100) / 100} KB</p>
        <p>Final size of codebase: {Math.round(remaining * 100) / 100} KB</p>
        <p>Number of unused classes found: {unused}</p>
      </div>
    </>
  );
}

export default Overall;
