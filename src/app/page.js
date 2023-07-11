"use client";
import MergeRequest from "./components/MergeRequest";
import Sidebar from "./components/SideBar";
// use the component in your app!

import * as React from "react";
import { ProgressBar, SIZE } from "baseui/progress-bar";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider, styled } from "baseui";
import { StatefulInput } from "baseui/input";

const engine = new Styletron();
const Centered = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
});

export default function Home() {
  const [value, setValue] = React.useState(70);
  return (
    <div>
      <StyletronProvider value={engine}>
        <BaseProvider theme={LightTheme}>
          <Centered>
            <ProgressBar value={value} size={SIZE.large} />
          </Centered>
        </BaseProvider>
      </StyletronProvider>
    </div>
  );
}
