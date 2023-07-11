"use client";
import Image from "next/image";
import Progress from "./Progress";
import "./codeblock.css"

export default function Codeblock (props){
    const unusedObj = structuredClone(props.unused);
    const unusedClasses = Object.keys(unusedObj);
    // console.log(unusedClasses);
    const temp = unusedClasses.map((className) => (
        <div>
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
    // console.log(unusedClasses);
    const temp2 = twClasses.map((className) => (
        <div>
            <pre>
                <code>
                    {twObj[className]['original']}
                </code>
            </pre>
        </div>
    ));
    // const temp = unusedClasses.map((class) => ())
    // const unused = unusedClasses.map((class) => (
    //     <div>
    //         <p>{class}</p>
    //     </div>
    // ));
    const str = "\n  fill: $faq-icon-color;\n  @include size($faq-icon-size);\n  margin-top: 0.6rem;\n"
    return (<div>
        <div>
            <p>
                UNUSED CLASSES
            </p>
            {temp}
        </div>
        <div>
            <p>
                REPLACED TAILWIND
            </p>
            {temp2}
        </div>
        
    </div>)
}