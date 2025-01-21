let userInput = process.argv[2];

function fetchData(success) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success === "true") {
        resolve("Data fetched successfully!");
      } else if (success === "false") {
        reject("Error: Failed to fetch data.");
      } else {
        reject("Invalid Input, Please Enter True Or False");
      }
    }, 2000);
  });
}

const data = fetchData(userInput)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
