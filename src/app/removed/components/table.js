"use client";
import "./table.css";

function Table(props) {
  const data = structuredClone(props.data);
  return (
    <>
      <div className="shadow-xl p-0 m-8 bg-white rounded-md">
        <div>
          <p className="px-4 pt-4 pb-1 text-xl">Stylesheet files</p>
          <p className="text-sm pl-4 pb-2 text-slate-500">
            CSS, SCSS, LESS Files in the codebase
          </p>
        </div>
        <div className="bg-slate-100 py-4 font-bold">
          <p className="inline px-5 py-4">File Name</p>
          <p className="inline px-5 py-4">Original Size</p>
          <p className="inline px-5 py-4">Reduced Size</p>
          <p className="inline px-5 py-4">Visual</p>
        </div>
        <div className="table-container w-full m-0 p-0">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>File Name</th>
                <th>Original Size</th>
                <th>Reduced Size</th>
                <th>Visual</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img src="" alt="" width="" />
                </td>
                <td>Content 1</td>
                <td>Content 1</td>
                <td>Content 1</td>
                <td>Content 1</td>
              </tr>
              <tr>
                <td>Content 2</td>
                <td>Content 2</td>
                <td>Content 2</td>
                <td>Content 2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Table;
