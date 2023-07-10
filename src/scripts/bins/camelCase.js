const camelCase = (str) => {
  let temp ="";
  for (let idx = 0; idx < str.length; idx++) {
    if (str[idx] == "-") {
      temp = temp + str[idx+1].toUpperCase();
      idx = idx + 1;
    } else {
      temp = temp + str[idx];
    }
  }
  return temp;
};

export default camelCase;
// console.log(camelCase("object-position"));
