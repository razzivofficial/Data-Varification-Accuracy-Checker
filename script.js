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
  ];

  // Create the chart
  let chart = c3.generate({
    bindto: "#chart",
    data: {
      columns: [
        ["Actual"].concat(counts),
        ["Expected"].concat(expected.map((x) => x * numbers.length)),
      ],
    },
    axis: {
      x: {
        type: "category",
        categories: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
    },
  });

  // Calculate the accuracy score
  let score = 0;
  for (let i = 0; i < counts.length; i++) {
    let digit = i + 1;
    let expectedCount = expected[i] * numbers.length;
    let actualCount = counts[i];
    let deviation = actualCount - expectedCount;
    let accuracy =
      (Math.log10(1 + 1 / digit) * Math.abs(deviation)) / expectedCount;
    score += accuracy;
  }
  score = 100 - (score * 100) / 9;

  // Display the accuracy score
  let percent = document.getElementById("percent");
  percent.innerHTML = `The data is EXPECTED to be ${score.toFixed(
    2
  )}% accurate.`;
}
