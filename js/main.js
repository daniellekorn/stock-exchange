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
	const response = await fetch(
		`https://financialmodelingprep.com/api/v3/search?query=${userInput}&limit=10&exchange=NASDAQ`
	);
	const data = await response.json();

	/*notice for user if no results*/
	if (data.length === 0) {
		const error = document.createElement("div");
		error.insertAdjacentHTML(
			"afterbegin",
			`We did not find any results that match <strong>"${userInput}"</strong>`
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
		const currentList = searchSymbols;
		currentList.map(getProfile);
	}
	loader.classList.add("hide");
}

async function getProfile(coSymbol) {
	const response = await fetch(
		`https://financialmodelingprep.com/api/v3/company/profile/${coSymbol}`
	);
	const data = await response.json();
	const company = data.profile;
	/*creation of elements w/style*/
	const newResult = document.createElement("a");
	newResult.classList.add("result");
	const logo = document.createElement("img");
	logo.classList.add("uniform-size", "vertical-align");
	const percentChange = document.createElement("span");
	if (company.changesPercentage.includes("+")) {
		percentChange.classList.add("positive");
	} else {
		percentChange.classList.add("negative");
	}
	const lineBreak = document.createElement("hr");
	lineBreak.classList.add("line-break");
	/*assigning specific details to HTML li item 'new result'*/
	logo.src = `${company.image}`;
	percentChange.textContent = `${company.changesPercentage}`;
	newResult.appendChild(logo);
	newResult.insertAdjacentHTML(
		"beforeend",
		`${company.companyName} (${coSymbol})`
	);
	newResult.appendChild(percentChange);
	newResult.href = `company.html?symbol=${coSymbol}`;
	/*append complete result to DOM*/
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
