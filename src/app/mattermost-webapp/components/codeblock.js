"use client";
import Image from "next/image";
import Progress from "./Progress";
import "./codeblock.css"

export default function Codeblock (props){
    const unusedObj = structuredClone(props.unused);
    const unusedClasses = Object.keys(unusedObj);
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
    const twObj = structuredClone(props.tw);
    const twClasses = Object.keys(twObj);
    return (<div>
        <div >
            <p>
                Unused Classes
            </p>
            {temp}
        </div>
        
    </div>)
}