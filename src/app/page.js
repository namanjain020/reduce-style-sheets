"use client";
// import MergeRequest from "./components/MergeRequest";
import Sidebar from "./components/SideBar";
import { Progress } from "@chakra-ui/react";
import "./test.css";
// use the component in your app!
import Text from "next";
// import * as React from "react";
// import { StatefulInput } from "baseui/input";
import dynamic from "next/dynamic";
import * as Diff from 'diff';

// const Client = dynamic(
//   () => {
//     return import("styletron-engine-atomic");
//   },
//   { ssr: false }
// );

// const engine = new Styletron();
// const Centered = styled("div", {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   height: "100%",
// });

import React from "react";


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

  return <div className="merge-request">{generateDiff()}</div>;
};

const one = `/* ======== Destination ========= */
.destination {
  display: flex;
  align-items: center;
  flex-direction: column;
}

/* Destination Names */
.destination-names {
  position: relative;
  left: 50%;
  transform: translate(-50%, 50%);
  margin: 30px 0 0;
  top: 50px;
}
p {
  font-family: "Barlow", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  color: #d0d6f9;
  width: 90%;
  margin: 0 auto;
}`;


const other =`
/* ======== Destination ========= */
.destination {
}

/* Destination Names */
.destination-names {
  transform: translate(-50%, 50%);
  top: 50px;
}
p {
  font-family: "Barlow", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  color: #d0d6f9;
  width: 90%;
  margin: 0 auto;
}`


// const diff = Diff.diffLines(one, other);




// function compare(props)
// {
//   const lines = [];
//   diff.forEach((part) => {
//     // green for additions, red for deletions
//     // grey for common parts
//     const color = part.added ? 'green' :
//       part.removed ? 'red' : 'grey';
//       lines.push()
//       console.log(part.value[color]);
//   //   process.stderr.write(part.value[color]);
//   });
// }

export default function Home() {
  // React.useEffect
  // const [value, setValue] = React.useState(70);
  return (
    <div>
      <MergeRequest original={one} newFile={other}/>
      <Progress value={80} />
    </div>
  );
}
