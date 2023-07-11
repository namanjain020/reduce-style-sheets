"use client";
import "./table.css";
import Image from "next/image";
import Progress from "./Progress";
import CodeBlock from "./codeblock.js";

function Table(props) {
  let variable = 10;
  // const targetDiv = document.getElementById("currentBlock");
  const clicked = () => {
    // targetDiv.style.visibility = "visible";
    // alert("Hello")
  };
  let result = structuredClone(props.data);
  const files = Object.keys(result);
  const temp = files.map((file) => (
    <div className="current">
      <div className="flex border-2" onClick={clicked}>
        <Image
          className="w-10 h-10 p-1 mt-2"
          src="/sass-logo.png"
          width={22}
          height={10}
          alt="sass-logo"
        />
        <p className="w-[35rem] py-3 pl-6">{file.replace(/^.*[\\\/]/, "")}</p>
        <p className="w-[12rem] py-3">{result[file]["original-size"]} KB</p>
        <p className=" w-[12rem] py-3">
          {result[file]["reduced-size"] / 1000} KB
        </p>
        <div className=" w-[22rem] py-3 ">
          <Progress
            val={Math.round(
              (result[file]["reduced-size"] /
                1000 /
                result[file]["original-size"]) *
                100
            )}
          />
        </div>
      </div>
      <div className="hidden" id="currentBlock">
        <CodeBlock unused={result[file]["unused-classes"]}   tw ={result[file]["replaced-tailwind"]} />
      </div>
    </div>
  ));
  return (
    <>
      <div className="shadow-xl p-0 my-8 mx-20  bg-white rounded-md">
        <div>
          <p className="px-4 pt-4 pb-1 text-xl">Stylesheet files</p>
          <p className="text-sm pl-4 pb-2 text-slate-500">
            CSS, SCSS, LESS Files in the codebase
          </p>
        </div>
        <div className="bg-slate-100 py-1 font-bold flex p-2">
          <div className="w-[2rem]"></div>
          <p className="w-[35rem] py-4 pl-8">File Name</p>
          <p className="w-[12rem] py-4">Original Size</p>
          <p className=" w-[12rem] py-4">Reduced Size</p>
          <p className=" w-[22rem] py-4">Visualiser</p>
        </div>
        <div>{temp}</div>
        <div className="table-container w-full m-0 p-0"></div>
      </div>
    </>
  );
}

export default Table;
