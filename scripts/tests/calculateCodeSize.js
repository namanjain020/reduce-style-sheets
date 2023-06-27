import fs, { writeFileSync } from "fs";
import path from "path";
const __dirname = path.resolve();

export function calculateCodebaseSize(directory) {
  
  // writeFileSync('./logs/test.json',)
  // console.log("calculating codebase size")

  let totalSize = 0;
  function calculateFileSize(filePath) {
    //stat Sync returns information about the given file path
    const stats = fs.statSync(filePath);
    // console.log(stats.)
    totalSize += stats.size;
    return stats.size;
  }

  function traverseDirectory(directory) {
    let obj={};
    const myArray = directory.split("/");
    let word = myArray.slice(-1)
    console.log(word);


    const files = fs.readdirSync(directory);
    files.forEach((file) => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      // console.log(file);
      if (stats.isDirectory()) {
        traverseDirectory(filePath);
        
      } else if (stats.isFile()) {
        calculateFileSize(filePath);
      }
    });
  }
  traverseDirectory(directory);
  console.log("Total codebase storage size:", totalSize / 1000, "kb");
  return totalSize / 1000;
}

// export default calculateCodebaseSize;
// Usage example
// const codebaseDirectory =
//   "../../../Reduce-stylesheets/multipage-coffee-shop-site-reactjs/src"; // Replace with the actual directory path
// calculateCodebaseSize(codebaseDirectory);
