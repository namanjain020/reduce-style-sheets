"use client";
import MergeRequest from "./components/MergeRequest";
import Sidebar from "./components/SideBar";
import { Progress } from '@chakra-ui/react'
// use the component in your app!
import Text from "next"
import * as React from "react";
// import { StatefulInput } from "baseui/input";
import dynamic from "next/dynamic";

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

export default function Home() {
  // React.useEffect
  // const [value, setValue] = React.useState(70);
  return (
    <div>
      <Progress value={80} />
    </div>
  );
}
