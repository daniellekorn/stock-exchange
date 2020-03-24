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

let symbolArray = [];
let companyCompareBtn = new companyCompare("placing bar", compareBar);
let activeButton = companyCompareBtn.createCompareButton();

searchButton.addEventListener("click", () => {
	clearTimeout(autoSearch);
	const searchResults = new resultList(resultChart);
	searchResults.clearHistory();
	const search = new Search(resultChart, searchText.value);
	search.runSearch().then(items => {
		items.map(item => {
			let compareBtn = search.createListItems(item, {
				text: search.userInput
			});
			let counter = 0;
			compareBtn.addEventListener("click", () => {
				if (counter < 1) {
					counter += 1;
					const compBtn = new companyCompare(item, compareBar);
					const quitBtn = compBtn.addButton(item);
					quitBtn.addEventListener("click", () => {
						compBtn.removeButton();
						counter = 0;
					});
				}
			});
		});
		searchResults.toggleLoader();
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
					console.log(item);
					if (counter < 1) {
						counter += 1;
						symbolArray.push(item);
						const compBtn = new companyCompare(item, compareBar);
						const quitBtn = compBtn.addButton(item);
						quitBtn.addEventListener("click", () => {
							compBtn.removeButton();
							counter = 0;
						});
					}
				});
			});
			searchResults.toggleLoader();
		});
	}
}, 1000);

activeButton.addEventListener("click", () => {
	let searchString = "";
	for (let i = 0; i < symbolArray.length; i++) {
		if (i == symbolArray.length - 1) {
			searchString += `${symbolArray[i].symbol}`;
		} else {
			searchString += `${symbolArray[i].symbol},`;
		}
	}
	console.log(searchString);
	activeButton.href = `company.html?symbol=${searchString}`;
});

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
