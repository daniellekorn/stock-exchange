const searchButton = document.querySelector("#searchButton");
const resultChart = document.querySelector("#resultChart");
const searchText = document.querySelector("#searchText");
const loader = document.querySelector("#loader");
const links = document.querySelectorAll(".result");
const majorIndexes = document.querySelector("#majorIndexes");
const cryptoCurrency = document.querySelector("#cryptoCurrency");
const currencies = document.querySelector("#currencies");
const searchForm = document.querySelector("#searchForm");

function getColor(isPositive, element) {
	return isPositive
		? element.classList.add("positive")
		: element.classList.add("negative");
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

searchText.addEventListener("keyup", function(event) {
	if (event.keyCode === 13) {
		searchButton.click();
	}
});

searchForm.addEventListener(
	"submit",
	function(e) {
		e.preventDefault();
	},
	false
);

searchButton.addEventListener("click", () => {
	loader.classList.remove("hide");
	const searchResults = new resultList(resultChart);
	searchResults.clearHistory();
	const search = new Search(resultChart, searchText.value);
	search.runSearch();
});
