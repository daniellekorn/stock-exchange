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
	const searchResults = new resultList(resultChart);
	searchResults.clearHistory();
	const search = new Search(resultChart, searchText.value);
	search.runSearch();
});
