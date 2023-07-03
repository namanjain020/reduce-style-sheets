import fs, { writeFileSync } from "fs";
import path from "path";
const __dirname = path.resolve();

let counter;
//Takes in directory and outputs JSON
export function fileSystem(dir) {
  // writeFileSync('./logs/test.json',)
  let totalSize = 0;

  // (filePath) => (fileSize in kb)
  function calculateFileSize(filePath) {
    //statSync() returns information about the given file path
    const stats = fs.statSync(filePath);
    totalSize += stats.size;
    //Returns size in kb
    return stats.size / 1000;
  }

  //Recursive function for traversing directories
  function traverseDirectory(dir) {
    let dirSize = 0;

    //Formatting of output JSON
    let obj = {};
    const myArray = dir.split("/");
    let dirName = myArray.slice(-1);

    const files = fs.readdirSync(dir);
    files
      .filter((file) => !file.includes("__tests__"))
      .filter((file) => !file.includes("tests"))
      .forEach((file) => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          const temp = traverseDirectory(filePath);
          obj[file] = temp;
          dirSize += temp.size;
        } else if (stats.isFile()) {
          const extension = path.extname(filePath);
          if (
            [".css", ".scss", ".less"].includes(
              extension
            )
          ) {
            const fileSize = calculateFileSize(filePath);
            dirSize += fileSize;
            const temp = {};
            temp["size"] = fileSize;
            obj[file] = temp;
            counter++;
          }
        }
      });
        obj["size"] = dirSize;
        return obj;
  }
  counter=0;
  const obj = traverseDirectory(dir);
  console.log("The number of stylesheets :" + counter);
  // console.log("Total codebase storage size:", totalSize / 1000, "kb");
  return obj;
}

/*
JSON FORMAT
{
  dir1:{
    dir2: {
      {
        file1: {size: "x"}
      }
    },
    file2:  {size: "x"},
    file3:  {size: "x"}
  }
}
*/
