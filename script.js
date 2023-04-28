function checkData() {
  // Get the data from the input field
  let data = document.getElementById("data").value;

  // Split the data into individual numbers
  let numbers = data.split(/\s+/).map(parseFloat);

  // Count the first digit occurrences
  let counts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < numbers.length; i++) {
    let firstDigit = parseInt(numbers[i].toString()[0]);
    if (firstDigit > 0) {
      counts[firstDigit - 1]++;
    }
  }

  // Calculate the expected frequencies based on Benford's Law
  let expected = [
    0.301, 0.176, 0.125, 0.097, 0.079, 0.067, 0.058, 0.051, 0.046,
  ].map((x) => x * numbers.length);

  // Calculate the accuracy for each digit
  let digitAccuracy = [];
  for (let i = 0; i < counts.length; i++) {
    let digit = i + 1;
    let expectedCount = expected[i];
    let actualCount = counts[i];
    let deviation = actualCount - expectedCount;
    let accuracy =
      (Math.log10(1 + 1 / digit) * Math.abs(deviation)) / expectedCount;
    digitAccuracy.push({
      digit: digit,
      expected: ((expectedCount * 100) / numbers.length).toFixed(2) + "%",
      actual: ((actualCount * 100) / numbers.length).toFixed(2) + "%",
      accuracy: (accuracy * 100).toFixed(2) + "%",
    });
  }

  // Create the table
  let table =
    "<table><tr><th>Digit</th><th>Expected</th><th>Actual</th><th>Accuracy</th></tr>";
  for (let i = 0; i < digitAccuracy.length; i++) {
    table +=
      "<tr><td>" +
      digitAccuracy[i].digit +
      "</td><td>" +
      digitAccuracy[i].expected +
      "</td><td>" +
      digitAccuracy[i].actual +
      "</td><td>" +
      digitAccuracy[i].accuracy +
      "</td></tr>";
  }
  table += "</table>";

  // Create the chart
  let chart = c3.generate({
    bindto: "#chart",
    data: {
      type: "bar", // Add this line
      columns: [
        ["Actual"].concat(counts.map((x) => (x / numbers.length) * 100)),
        ["Expected"].concat(expected.map((x) => (x / numbers.length) * 100)),
      ],
    },
    axis: {
      x: {
        type: "category",
        categories: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
    },
  });

  // Calculate the overall accuracy score
  let score = 0;
  for (let i = 0; i < counts.length; i++) {
    let digit = i + 1;
    let expectedCount = expected[i];
    let actualCount = counts[i];
    let deviation = actualCount - expectedCount;
    let accuracy =
      (Math.log10(1 + 1 / digit) * Math.abs(deviation)) / expectedCount;
    score += accuracy;
  }
  let overallAccuracy = ((score / 9) * 100).toFixed(2) + "%";

  // Display the table and overall accuracy score
  document.getElementById("results").innerHTML = table;
  document.getElementById("accuracy").innerHTML =
    "Overall Accuracy: " + overallAccuracy;
}
