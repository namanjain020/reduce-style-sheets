import React from "react";

const Widget = (props) => {
  return (
    <div className="flex flex-col px-8 py-20 overflow-hidden w-1/3 m-2 border-2 rounded-[8px] text-center ">
        <p className="text-black  text-xl">{props.text}</p>
        <p className="text-green-500 text-5xl font-bold p-2">
            {props.number}
            </p>
    </div>
  );
};

export default Widget;
