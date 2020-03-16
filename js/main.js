const searchButton = document.getElementById("searchButton");
const resultChart = document.getElementById("resultChart");
const searchText = document.getElementById("searchText");
const loader = document.getElementById("loader");
const title = document.getElementById("title");
const links = document.querySelectorAll(".result");

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
		`https://financialmodelingprep.com/api/v3/search?query=${userInput}&limit=10&exchange=NASDAQ`
	);
	let data = await response.json();

	for (let i = 0; i < data.length; i++) {
		let newResult = document.createElement("a");
		let lineBreak = document.createElement("hr");
		let name = data[i].name;
		let symbol = data[i].symbol;
		newResult.classList.add("result");
		lineBreak.classList.add("line-break");
		newResult.innerHTML = `${name} (${symbol})`;
		newResult.href = `company.html?symbol=${symbol}`;
		resultChart.appendChild(newResult);
		resultChart.appendChild(lineBreak);
	}
	loader.classList.replace("show", "hide");
}

searchButton.addEventListener("click", () => {
	loader.classList.replace("hide", "show");
	userInput = searchText.value;
	searching();
});
