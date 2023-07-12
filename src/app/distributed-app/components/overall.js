"use client";
import "./table.css";
import Image from "next/image";
import Progress from "./Progress";

function Overall(props) {
    const totalFiles = Object.keys(props.data).length;
    const files = Object.keys(props.data);
    let originalSize =0 ;
    let reducedSize =0 ;
    let unused=0;
    files.forEach(file => {
        originalSize+=props.data[file]['original-size'];
        reducedSize+=(props.data[file]['reduced-size']/1000);
        unused +=(Object.keys(props.data[file]['unused-classes']).length);
    })
  return (
    <>
      <div className="shadow-xl p-4 my-8 mx-20 bg-white rounded-md text-xl text-slate-600">
        <p>Total number of stylesheets: {totalFiles}</p>
        <p>Total Original Size: {Math.round(originalSize * 100) / 100} KB</p>
        <p>Total Reduced Size: {Math.round(reducedSize* 100) / 100} KB</p>
        <p>Number of unused classes found: {unused}</p>
      </div>
    </>
  );
}

export default Overall;
