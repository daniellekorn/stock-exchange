const searchButton = document.querySelector("#searchButton");
const resultChart = document.querySelector("#resultChart");
const searchText = document.querySelector("#searchText");
const loader = document.querySelector("#loader");
const links = document.querySelectorAll(".result");
const majorIndexes = document.querySelector("#majorIndexes");
const cryptoCurrency = document.querySelector("#cryptoCurrency");
const currencies = document.querySelector("#currencies");
const searchForm = document.querySelector("#searchForm");
const compare = document.getElementsByClassName(".compare-btn");
const compareBar = document.getElementById("compareBar");

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

	let compareBtn = new companyCompare("hi", compareBar);
	compareBtn.runCompareButton();
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

searchButton.addEventListener("click", () => {
	autoSearch.cancel();
	const searchResults = new resultList(resultChart);
	searchResults.clearHistory();
	const search = new Search(resultChart, searchText.value);
	search.runSearch().then(items => {
		items.map(item => {
			search.createListItems(item, {
				text: search.userInput
			});
		});
	});
});

const autoSearch = debounce(function() {
	const search = new Search(resultChart, searchText.value);
	const searchResults = new resultList(resultChart);
	if (searchText.value === "") {
		searchResults.clearHistory();
	} else {
		searchResults.clearHistory();
		search.runSearch(searchText.value).then(items => {
			items.map(item => {
				let compareBtn = search.createListItems(item, {
					text: search.userInput
				});
				let counter = 0;
				compareBtn.addEventListener("click", () => {
					if (counter < 1) {
						counter += 1;
						console.log(counter);
						const compBtn = new companyCompare(item, compareBar);
						const quitBtn = compBtn.addButton(item);
						quitBtn.addEventListener("click", () => {
							compBtn.removeButton();
							counter = 0;
						});
					}
					console.log(counter);
				});
			});
			searchResults.toggleLoader();
		});
	}
}, 1000);

searchText.addEventListener("input", autoSearch);
searchText.addEventListener("input", () => {
	if (history.pushState) {
		let newurl =
			window.location.protocol +
			"//" +
			window.location.host +
			window.location.pathname +
			`?query=${searchText.value}`;
		window.history.pushState({ path: newurl }, "", newurl);
	}
});
