"use client";
import Image from "next/image";
import Progress from "./Progress";
import "./codeblock.css";
import { useState } from "react";

// {
//     ".categories-container": [
//       { "overflow-x: hidden": "overflow-x-hidden" },
//       { "position: relative": "relative" },
//       { "box-sizing: border-box": "box-border" }
//     ]
//   },



export default function TailwindCodeblock(props) {
  const obj = structuredClone(props.tailwind)  ;
  const classes = Object.keys(obj);
    let codeblock =JSON.stringify(obj);
  return (
    <div>
      <div>
        <p>REPLACED TAILWIND</p>
        <pre>
            <code>
                {codeblock}
            </code>
        </pre>
      </div>
    </div>
  );
}
