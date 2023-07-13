'use client'
export default function CardComponent(props){
    return(
        <div className="bg-slate-200 m-3 rounded-lg ">
            <p className="">
                {props.text}
            </p>
        </div>
    )

}