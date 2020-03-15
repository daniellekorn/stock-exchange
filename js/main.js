const searchButton = document.getElementById("searchButton");
const resultChart = document.getElementById("resultChart");
const searchText = document.getElementById("searchText");

function clearHistory() {
	let child = resultChart.lastElementChild;
	while (child) {
		resultChart.removeChild(child);
		child = resultChart.lastElementChild;
	}
}

async function searching() {
	clearHistory();

	let response = await fetch(
		"https://financialmodelingprep.com/api/v3/search?query=" +
			userInput +
			"&limit=10&exchange=NASDAQ"
	);
	let data = await response.json();

	for (let i = 0; i < data.length; i++) {
		let newResult = document.createElement("div");
		newResult.innerHTML = `${data[i].name} (${data[i].symbol})`;
		resultChart.appendChild(newResult);
	}
}

searchButton.addEventListener("click", () => {
	userInput = searchText.value;
	console.log(userInput);
	searching();
});
