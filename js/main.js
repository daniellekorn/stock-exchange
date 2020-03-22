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

window.onload = () => {
	let majorIndexesResults = new sidebarItem(
		majorIndexes,
		majorIndexesUrl,
		wantedIndexes,
		"majorIndexesList"
	);
	let currenciesResults = new sidebarItem(
		currencies,
		currenciesUrl,
		wantedCurrencies,
		"forexList"
	);
	let cryptoCurrencyResults = new sidebarItem(
		cryptoCurrency,
		cryptoUrl,
		wantedCrypto,
		"cryptocurrenciesList"
	);
	majorIndexesResults.apiSearch();
	currenciesResults.apiSearch();
	cryptoCurrencyResults.apiSearch();
};

function debounce(func, wait, immediate) {
	let timeout;
	return function() {
		let context = this,
			args = arguments;
		let later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		let callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

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

const autoSearch = debounce(function() {
	const search = new Search(resultChart, searchText.value);
	const searchResults = new resultList(resultChart);
	if (searchText.value === "") {
		searchResults.clearHistory();
	} else {
		searchResults.clearHistory();
		search.runSearch();
	}
}, 1000);

searchText.addEventListener("input", autoSearch);

searchButton.addEventListener("click", () => {
	const searchResults = new resultList(resultChart);
	searchResults.clearHistory();
	const search = new Search(resultChart, searchText.value);
	search.runSearch();
});
