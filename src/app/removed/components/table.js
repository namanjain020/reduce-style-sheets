"use client";
import "./table.css"


function Table(props) {
  return (
    <>
      <div className="table-container w-full m-0 p-0">
        <table className="table">
          <thead >
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
            <td><img src="" alt="" width=""/></td>
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
    </>
  );
}

export default Table;
