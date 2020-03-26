const clearButton = document.querySelector("#clearButton");
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

let displayError;
let symbolArray = [];
const companyCompareBtn = new CompanyCompare("placing bar", compareBar);
const compareCall = companyCompareBtn.createCompareButton();
const searchResults = new resultList(resultChart);

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

const autoSearch = debounce(() => {
	const search = new Search(resultChart, searchText.value);
	if (searchText.value === "") {
		searchResults.clearHistory();
	} else {
		searchResults.clearHistory();
		searchResults.toggleLoader();
		search.runSearch(searchText.value).then(items => {
			items.map(item => {
				let compareBtn = search.createListItems(item, {
					text: search.userInput
				});
				let counter = 0;
				compareBtn.addEventListener("click", () => {
					/*query selector to check for buttons*/
					let numOfButtons = document.querySelectorAll(".company-compare-btn")
						.length;
					if (numOfButtons > 2) {
						if (!compareBar.contains(displayError)) {
							companyCompareBtn.showError();
							displayError = document.querySelector(".warning");
						}
					} else {
						if (counter < 1) {
							counter += 1;
							symbolArray.push(item);
							const compBtn = new CompanyCompare(item, compareBar);
							const quitBtn = compBtn.addButton(item);
							quitBtn.addEventListener("click", () => {
								if (symbolArray.includes(item)) {
									let index = symbolArray.indexOf(item);
									symbolArray.splice(index, 1);
								}
								compBtn.removeButton();
								numOfButtons -= 1;
								counter = 0;
							});
						}
					}
				});
			});
			searchResults.toggleLoader();
		});
	}
}, 1000);

const urlUpdate = () => {
	if (history.pushState) {
		let newurl =
			window.location.protocol +
			"//" +
			window.location.host +
			window.location.pathname +
			`?query=${searchText.value}`;
		window.history.pushState({ path: newurl }, "", newurl);
	}
};

const buildCompareUrl = () => {
	let searchString = "";
	for (let i = 0; i < symbolArray.length; i++) {
		if (i == symbolArray.length - 1) {
			searchString += `${symbolArray[i].symbol}`;
		} else {
			searchString += `${symbolArray[i].symbol},`;
		}
	}
	compareCall.href = `company.html?symbol=${searchString}`;
};

const clearPage = () => {
	const removeBarItems = new CompanyCompare("deleting", compareBar);
	searchResults.clearHistory();
	removeBarItems.clearPage();
};

searchText.addEventListener("input", autoSearch);
searchText.addEventListener("input", urlUpdate);
compareCall.addEventListener("click", buildCompareUrl);
clearButton.addEventListener("click", clearPage);

/* stops automatic reload of page on enter keypress*/
searchForm.addEventListener(
	"submit",
	function(e) {
		e.preventDefault();
	},
	false
);
