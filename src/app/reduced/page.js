"use client"
import Sidebar from "../components/SideBar";
import reduced from "../../scripts/createdLogs/reduced"
// use the component in your app!

export default function Home() {
  return (
    <>
    <Sidebar>
    <header>
        <h1 className="text-5xl p-3">Reduce StyleSheets</h1>
        <h2 className="text-3xl p-4">Reduced codebase</h2>
      </header>
      <div >
        <pre> {JSON.stringify(reduced,null,'\t')}</pre>
      </div>
    </Sidebar>
    </>
  );
}
