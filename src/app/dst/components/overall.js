"use client";
import "./table.css";
import Image from "next/image";
import Progress from "./Progress";
import { CountUp } from "use-count-up";
import Widget from "../../components/Widget";
import { Chart } from "react-google-charts";
import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";

function Overall(props) {
  const totalFiles = Object.keys(props.data).length;
  const files = Object.keys(props.data);
  let originalSize = 0;
  let reducedSize = 0;
  let remaining = 0;
  let unused = 0;
  let converted = 0;
  let cleaned = 0;
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
    if (props.data[file]["converted-number"]) {
      converted += props.data[file]["converted-number"];
    }
    console.log(props.data[file]["final-size"]);
    if (
      props.data[file]["final-size"] &&
      props.data[file]["final-size"] === 0
    ) {
      console.log("Hello");
      cleaned+=1;
    }
    cleaned=3;
  });
  console.log(originalSize, reducedSize, remaining, converted);
  const info = [
    ["Task", "in KB"],
    ["Remaining", remaining],
    ["Converted", reducedSize - remaining],
    ["Unused Classes", originalSize - reducedSize],
  ];
  const options = {
    title: "",
  };
  return (
    <>
      <div className="p-4 w-3/4 bg-white rounded-[12px] text-xl overflow-hidden text-slate-400 font-sans">
        <div className=" flex bg-white text-3xl justify-between mx-[8px] mt-2">
          <div
            className=" flex flex-row w-44 rounded-[8px] place-content-center hover:bg-[#F2F5F7] bg-[#F2F5F7] text-center cursor-pointer  text-sm"
            style={{ outline: "1px solid rgb(30, 144, 255)" }}
          >
            <Link href="/dst">
              <p className="text-[16px] text-black font-medium place-content-center p-[11px]">
                Distributed-app
              </p>
            </Link>
          </div>
          <div className=" flex flex-row bg-white w-44 rounded-[8px] place-content-center hover:bg-[#F2F5F7]  text-center cursor-pointer  text-sm">
            <Link href="/mattermost">
              <p className="text-[16px] text-black font-medium text-center p-[11px]">
                Mattermost-webapp
              </p>
            </Link>
          </div>
          <div className=" flex flex-row bg-white w-44 rounded-[8px] place-content-center hover:bg-[#F2F5F7]  text-center cursor-pointer  text-sm">
            <Link href="/testing">
              <p className="text-[16px] text-black font-medium text-center p-[11px]">
                Testing-repository
              </p>
            </Link>
          </div>
        </div>
        <div className="place-content-center px-[8px]">
          <hr class="h-[0.4rem] w-full rounded-xl bg-[#F0F3F4] border-0  my-4"></hr>
        </div>

        <div className="flex flex-row justify-between">
          <Widget text="No. of stylesheets" number={totalFiles} />
          <Widget text="No. of unused classes" number={unused} />
          <Widget text="No. of converted styles" number={converted} />
          <Widget text="No. of removed stylesheets" number={cleaned} />
        </div>

        {/* <div className="flex ">
          <div className="px-6 w-1/2">
            <p className="text-slate-700">
              Total number of stylesheets parsed:{" "}
            </p>
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
          <div className="flex w-1/2">
            <Chart
              chartType="PieChart"
              data={info}
              options={options}
              width={"100%"}
              height={"100%"}
            />
          </div>
        </div> */}
      </div>
    </>
  );
}

export default Overall;
