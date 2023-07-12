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
    const str = "\n  fill: $faq-icon-color;\n  @include size($faq-icon-size);\n  margin-top: 0.6rem;\n"
    return (<div>
        <div>
            <p>
                UNUSED CLASSES
            </p>
            {temp}
        </div>
        
    </div>)
}