import React from "react";

const Widget = (props) => {
  return (
    <div className="flex flex-col px-8 py-[3.2rem] overflow-hidden w-1/3 mx-2 mb-2 border-2 rounded-[8px] text-center ">
        <span className="text-black  text-center h-1/2 text-[20px] pb-6">{props.text}</span>
        <span className="text-green-500 text-[56px] h-1/2  font-bold p-2">
            {props.number}
            </span>
    </div>
  );
};

export default Widget;
