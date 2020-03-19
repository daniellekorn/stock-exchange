const searchButton = document.querySelector("#searchButton");
const resultChart = document.querySelector("#resultChart");
const searchText = document.querySelector("#searchText");
const loader = document.querySelector("#loader");
const links = document.querySelectorAll(".result");
const majorIndexes = document.querySelector("#majorIndexes");
const cryptoCurrency = document.querySelector("#cryptoCurrency");
const currencies = document.querySelector("#currencies");
const searchForm = document.querySelector("#searchForm");

function clearHistory() {
	let child = resultChart.lastElementChild;
	while (child) {
		resultChart.removeChild(child);
		child = resultChart.lastElementChild;
	}
}

function createTriplets(array) {
	var j = 0;
	triplets = [];
	triplets.push([]);
	for (i = 1; i <= array.length; i++) {
		// always updating the final array
		triplets[j].push(array[i - 1]);

		if (i % 3 == 0) {
			triplets.push([]);
			j++;
		}
	}
	if (triplets[0].length === 0) {
		// if the data you received was epmty
		console.log("Error: empty array");
	}
	return triplets;
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
		error.insertAdjacentHTML(
			"afterbegin",
			`We did not find any results that match <strong>"${userInput}"</strong>`
		);
		error.classList.add("error-style");
		resultChart.append(error);
	} else {
		const searchSymbols = [];
		for (let i = 0; i < data.length; i++) {
			let symbol = data[i].symbol;
			searchSymbols.push(symbol);
		}
		const triplets = createTriplets(searchSymbols);
		const tripletStrings = triplets.map(triple => {
			return triple.join();
		});
		getProfileData(tripletStrings);
	}
	loader.classList.add("hide");
}

const getProfileData = async array => {
	let allTogether = [];
	let merged = [];
	try {
		let data = await Promise.all(
			array.map(item =>
				fetch(
					`https://financialmodelingprep.com/api/v3/company/profile/${item}`
				)
					.then(r => r.json())
					.catch(error => ({ error, url }))
			)
		);
		for (let i = 0; i < data.length; i++) {
			if (i < data.length - 1) {
				allTogether.push(data[i].companyProfiles);
			} else {
				allTogether.push(data[i]);
			}
		}
		merged = [].concat.apply([], allTogether);
		merged.map(company => {
			createListItem(company);
		});
	} catch (err) {
		console.log(err);
	}
};

function getColor(isPositive, element) {
	return isPositive
		? element.classList.add("positive")
		: element.classList.add("negative");
}

function createListItem(company) {
	const symbol = company.symbol;
	const profile = company.profile;
	/*creation of elements w/style*/
	const newResult = document.createElement("a");
	newResult.classList.add("result");
	const logo = document.createElement("img");
	logo.classList.add("uniform-size", "vertical-align");
	const percentChange = document.createElement("span");
	getColor(profile.changesPercentage.includes("+"), percentChange);
	const lineBreak = document.createElement("hr");
	lineBreak.classList.add("line-break");
	/*assigning specific details to HTML li item 'new result'*/
	logo.src = `${profile.image}`;
	percentChange.textContent = `${profile.changesPercentage}`;
	newResult.appendChild(logo);
	newResult.insertAdjacentHTML(
		"beforeend",
		`${profile.companyName} (${symbol})`
	);
	newResult.appendChild(percentChange);
	newResult.href = `company.html?symbol=${symbol}`;
	/*append complete result to DOM*/
	resultChart.appendChild(newResult);
	resultChart.appendChild(lineBreak);
}

function createSideBar(item) {
	const box = document.createElement("div");
	const ticker = document.createElement("div");
	const name = document.createElement("div");
	const price = document.createElement("div");
	const change = document.createElement("div");
	getColor(!item.changes.toString().includes("-"), change);
	ticker.textContent = item.ticker;
	let percentage = Math.round(item.changes * 100) / 100;
	change.textContent = `(${percentage}%)`;

	if (item.price) {
		price.textContent = `$${item.price}`;
	} else {
		price.textContent = `$${item.ask}`;
	}

	if (this.half) {
		box.classList.add("flexible", "w-wrap");
		box.appendChild(ticker);
		change.classList.add("space");
	} else {
		name.textContent = item.indexName;
		box.appendChild(name);
		box.classList.add("even-out");
	}
	box.appendChild(change);
	box.appendChild(price);
	box.classList.add("side-bar-item");
	this.domItem.appendChild(box);
}

let mostImpCurrency = ["EUR/USD", "USD/JPY", "GBP/USD", "EUR/GBP", "USD/CHF"];
let mostImpCrypto = ["BTC", "ETH", "LTC", "DASH", "XRP"];
let mostImpIndexes = [".DJI", ".IXIC", ".INX", "%5EFCHI", "%5EXAU", "%5EXAX"];
function findRelevant(mainArray, impArray) {
	let newArray = [];
	mainArray.forEach(item => {
		if (impArray.includes(item.ticker) || impArray.includes(item.name)) {
			newArray.push(item);
		}
	});
	return newArray;
}

window.onload = async () => {
	/*use Promise.all to do these 3 fetches?*/
	/*Major Indexes side bar info*/
	let indexesResponse = await fetch(
		"https://financialmodelingprep.com/api/v3/majors-indexes"
	);
	let indexesData = await indexesResponse.json();
	let majorData = indexesData.majorIndexesList;
	let condensedIndexes = findRelevant(majorData, mostImpIndexes);
	condensedIndexes.map(createSideBar, {
		domItem: majorIndexes
	});

	/*Currencies side bar info*/
	let currencyResponse = await fetch(
		"https://financialmodelingprep.com/api/v3/forex"
	);
	let currencyData = await currencyResponse.json();
	let currencyIndexes = currencyData.forexList;
	let condensedCurrency = findRelevant(currencyIndexes, mostImpCurrency);
	condensedCurrency.map(createSideBar, {
		domItem: currencies,
		half: true
	});

	/*Cryptocurrency side bar info*/
	let cryptoResponse = await fetch(
		"https://financialmodelingprep.com/api/v3/cryptocurrencies"
	);
	let cryptoData = await cryptoResponse.json();
	let cryptoIndexes = cryptoData.cryptocurrenciesList;
	let condensedCrypto = findRelevant(cryptoIndexes, mostImpCrypto);
	condensedCrypto.map(createSideBar, {
		domItem: cryptoCurrency,
		half: true
	});
};

searchButton.addEventListener("click", () => {
	loader.classList.remove("hide");
	userInput = searchText.value;
	searching();
});

searchForm.addEventListener(
	"submit",
	function(e) {
		e.preventDefault();
	},
	false
);

searchText.addEventListener("keyup", function(event) {
	if (event.keyCode === 13) {
		searchButton.click();
	}
});
