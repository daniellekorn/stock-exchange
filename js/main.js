const searchButton = document.querySelector("#searchButton");
const resultChart = document.querySelector("#resultChart");
const searchText = document.querySelector("#searchText");
const loader = document.querySelector("#loader");
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
		/*create symbol list of 10 companies then get profiles w/ second fetch in map*/
	} else {
		const searchSymbols = [];
		for (let i = 0; i < data.length; i++) {
			let symbol = data[i].symbol;
			searchSymbols.push(symbol);
		}
		let currentList = searchSymbols;
		currentList.map(getData);
	}
	loader.classList.add("hide");
}

async function getData(coSymbol) {
	const response = await fetch(
		`https://financialmodelingprep.com/api/v3/company/profile/${coSymbol}`
	);
	const data = await response.json();
	let company = data.profile;

	const newResult = document.createElement("a");
	const logo = document.createElement("img");
	const percentChange = document.createElement("span");
	const lineBreak = document.createElement("hr");
	newResult.classList.add("result");
	lineBreak.classList.add("line-break");
	logo.classList.add("uniform-size", "vertical-align");
	logo.src = `${company.image}`;

	newResult.appendChild(logo);
	newResult.appendChild(
		document.createTextNode(`${company.companyName} (${coSymbol})`)
	);
	if (company.changesPercentage.includes("+")) {
		percentChange.classList.add("positive");
	} else {
		percentChange.classList.add("negative");
	}
	percentChange.appendChild(
		document.createTextNode(`${company.changesPercentage}`)
	);
	newResult.appendChild(percentChange);
	newResult.href = `company.html?symbol=${coSymbol}`;
	resultChart.appendChild(newResult);
	resultChart.appendChild(lineBreak);
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
