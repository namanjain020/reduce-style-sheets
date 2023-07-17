"use client";
import Image from "next/image";
import Progress from "./Progress";
import "./codeblock.css";
import { useState } from "react";
import * as Diff from 'diff';

const MergeRequest = ({ original, newFile }) => {
  const generateDiff = () => {
    const diff = Diff.diffLines(original, newFile);
    const diffElements = diff.map((part, index) => {
      const className = part.added
        ? 'added'
        : part.removed
        ? 'removed'
        : 'unchanged';

      return (
        <pre key={index} className={className}>
          <code>
          {part.value}
          </code>
          </pre>
      );
    });
    return diffElements;
  };
  return <div className="merge-request overflow-y-auto min-h-[16rem] max-h-[30rem] p-0 m-0">{generateDiff()}</div>;
};




export default function TailwindCodeblock(props) {
  const obj = structuredClone(props.tailwind);
  const og =props.original;
  const final =props.final;

  const classes = Object.keys(obj);
  let codeblock = "";
  // console.log(keys);
  // console.log(classes);
  const newline = "\n";
  const temp = classes.forEach((c) => {
    codeblock += c + "\n\t";
    if (obj[c]) {
      obj[c].forEach((property) => {
        codeblock += JSON.stringify(property)+"\n\t" ;
      });
    }

    codeblock += newline;
  });

  return (
    <div className="bg-slate-50">
      <p className="text-md p-2">Changed Code</p>
      <MergeRequest original={og} newFile={final}/>
      <div>
      {/* <p>Replaced Tailwind</p>
        <pre>
          <code>{codeblock}</code>
        </pre> */}
      </div>
    </div>
  );
}
