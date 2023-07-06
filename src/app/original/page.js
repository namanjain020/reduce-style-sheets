"use client"
import Sidebar from "../components/SideBar";
import { JSONTree } from 'react-json-tree';
import original from "../../../../distributed-result/original.json"
// use the component in your app!

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
}


export default function Home() {
  const keys = Object.keys(original);
  let json;
  keys.forEach(key => {
    if(original[key]['size']===0)
    {
      delete original[key]; 
    }
  });
  console.log(original);
  return (
    <>
    <Sidebar>
    <header>
        <h1 className="text-5xl p-3">Reduce StyleSheets</h1>
        <h2 className="text-3xl p-4 ">Original codebase</h2>
      </header>
      <div className="text-2xl">
      <JSONTree theme={theme}  data={original} />
      </div>
    </Sidebar>
      
    </>
  );
}
