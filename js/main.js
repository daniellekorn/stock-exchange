const searchButton = document.querySelector("#searchButton");
const resultChart = document.querySelector("#resultChart");
const searchText = document.querySelector("#searchText");
const loader = document.querySelector("#loader");
const title = document.querySelector("#title");
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

	/*notice for user if no results*/
	if (data.length === 0) {
		const error = document.createElement("div");
		error.appendChild(
			document.createTextNode(
				`We did not find any results that match <strong>"${userInput}"</strong>`
			)
		);
		error.classList.add("error-style");
		resultChart.append(error);
	} else {
		for (let i = 0; i < data.length; i++) {
			const newResult = document.createElement("a");
			const lineBreak = document.createElement("hr");
			let name = data[i].name;
			let symbol = data[i].symbol;
			newResult.classList.add("result");
			lineBreak.classList.add("line-break");
			newResult.appendChild(document.createTextNode(`${name} (${symbol})`));
			newResult.href = `company.html?symbol=${symbol}`;
			resultChart.appendChild(newResult);
			resultChart.appendChild(lineBreak);
		}
	}
	loader.classList.add("hide");
}

searchButton.addEventListener("click", () => {
	loader.classList.remove("hide");
	userInput = searchText.value;
	searching();
});

/* Why not working?
searchText.addEventListener("keyup", function(event) {
	event.preventDefault();
	if (event.keyCode === 13) {
		searchButton.click();
	}
});*/
