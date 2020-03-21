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

// function debounce(func, wait, immediate) {
// 	let timeout;
// 	return function() {
// 		let context = this,
// 			args = arguments;
// 		let later = function() {
// 			timeout = null;
// 			if (!immediate) func.apply(context, args);
// 		};
// 		let callNow = immediate && !timeout;
// 		clearTimeout(timeout);
// 		timeout = setTimeout(later, wait);
// 		if (callNow) func.apply(context, args);
// 	};
// }

// function autocomplete(inp, arr) {
// 	console.log("entered autocomplete");
// 	let currentFocus;
// 	searchText.addEventListener("input", function(e) {
// 		let a,
// 			b,
// 			i,
// 			val = this.value;
// 		closeAllLists();
// 		if (!val) {
// 			return false;
// 		}
// 		currentFocus = -1;
// 		a.document.createElement("div");
// 		a.setAttribute("id", this.id + "autocomplete-list");
// 		a.setAttribute("class", "autocomplete-items");
// 		this.parentNode.appendChild(a);
// 		for (i = 0; i < arr.length; i++) {
// 			if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
// 				b = document.createElement("div");
// 				b.textContent = arr[i].substr(0, val.length);
// 				b.insertAdjacentHTML(
// 					"beforeend",
// 					`<input type='hidden' value='${arr[i]}'></input>`
// 				);
// 				b.addEventListener("click", function(e) {
// 					inp.value = this.getElementsByTagName("input")[0].value;
// 					closeAllLists();
// 				});
// 				a.appendChild(b);
// 			}
// 		}
// 	});
// }

// const countries = [
// 	"Albania",
// 	"Algeria",
// 	"Andorra",
// 	"Angola",
// 	"Anguilla",
// 	"Antigua & Barbuda",
// 	"Argentina",
// 	"Armenia",
// 	"Aruba",
// 	"Australia",
// 	"Austria",
// 	"Azerbaijan",
// 	"Bahamas",
// 	"Bahrain",
// 	"Bangladesh"
// ];
// const autofillDebounce = debounce(autocomplete(searchText, countries), 250);

// searchText.addEventListener("keyup", autofillDebounce);

// function closeAllLists(elmnt) {
// 	var x = document.getElementsByClassName("autocomplete-items");
// 	for (var i = 0; i < x.length; i++) {
// 		if (elmnt != x[i] && elmnt != inp) {
// 			x[i].parentNode.removeChild(x[i]);
// 		}
// 	}
// }

// document.addEventListener("click", function(e) {
// 	closeAllLists(e.target);
// });

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
