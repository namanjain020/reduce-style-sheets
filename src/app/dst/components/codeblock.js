"use client";
import Image from "next/image";
import Progress from "./Progress";
import "./codeblock.css";
import * as Diff from "diff";

const MergeRequest = ({ original, newFile }) => {
  const generateDiff = () => {
    const diff = Diff.diffLines(original, newFile);
    const diffElements = diff.map((part, index) => {
      const className = part.added
        ? "added"
        : part.removed
        ? "removed"
        : "unchanged";

      return (
        <pre key={index} className={className}>
          <code>{part.value}</code>
        </pre>
      );
    });
    return diffElements;
  };
  return (
    <div className="merge-request overflow-y-auto min-h-[16rem] max-h-[30rem] p-0 m-0">{generateDiff()}</div>
  );
};

export default function Codeblock(props) {
  const unusedObj = structuredClone(props.unused);
  const unusedClasses = Object.keys(unusedObj);
  const og = props.original;
  const final = props.final;
  // console.log(unusedClasses);
  const temp = unusedClasses.map((className) => (
    <div key={className.id}>
      <pre>
        <code>
          {className}
          {unusedObj[className]}
        </code>
      </pre>
    </div>
  ));
  return (
    <div className="bg-slate-50">
      <p className="text-md p-2">Changed Code</p>
      <MergeRequest original={og} newFile={final} />
      <div>
        {/* <p>
                Unused Classes
            </p>
            {temp} */}
      </div>
    </div>
  );
}
