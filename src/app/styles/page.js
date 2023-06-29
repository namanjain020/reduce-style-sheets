"use client"
import Sidebar from "../components/SideBar";
import obj from "../../scripts/createdLogs/removedBlocks"
// use the component in your app!

export default function Home() {
  return (
    <>
    <Sidebar>
    <header>
        <h1 className="text-5xl p-3">Reduce StyleSheets</h1>
        <h2 className="text-3xl p-4 ">Style reduced</h2>
      </header>
      <div >
        <pre> {JSON.stringify(obj,null,'\t')}</pre>
      </div>
    </Sidebar>
      
    </>
  );
}
