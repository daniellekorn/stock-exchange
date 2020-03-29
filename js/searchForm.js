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

async function runSearch(query) {
	let response = await fetch(
		`https://financialmodelingprep.com/api/v3/search?query=${query}&limit=10&exchange=NASDAQ`
	);
	let data = await response.json();
	console.log(data);
	let j = 0;
	let triplets = [];
	triplets.push([]);
	for (let i = 1; i <= data.length; i++) {
		triplets[j].push(data[i - 1].symbol);

		if (i % 3 == 0) {
			triplets.push([]);
			j++;
		}
	}
	const tripletStrings = triplets.map(triple => {
		return triple.join();
	});
	console.log(tripletStrings);

	try {
		let profileData = await Promise.all(
			tripletStrings.map(item =>
				fetch(
					`https://financialmodelingprep.com/api/v3/company/profile/${item}`
				)
					.then(r => r.json())
					.catch(error => ({ error, url }))
			)
		);
		/*account for differences in API index names*/
		let allTogether = [];
		for (let i = 0; i < profileData.length; i++) {
			/*mult. req at once vs. single req*/
			if (i < profileData.length - 1) {
				allTogether.push(profileData[i].companyProfiles);
			} else {
				allTogether.push(profileData[i]);
			}
		}
		let merged = [].concat.apply([], allTogether);
		return merged;
	} catch (err) {
		console.log(err);
	}
}

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

function createLoader() {
	const loader = document.createElement("div");
	loader.setAttribute("id", "loader");
	loader.classList.add("loader", "hide");
	const loaderBar = document.createElement("span");
	loaderBar.className = "loader-bar";
	const loaderBar2 = document.createElement("span");
	loaderBar2.className = "loader-bar";
	const loaderBar3 = document.createElement("span");
	loaderBar3.className = "loader-bar";
	loader.appendChild(loaderBar);
	loader.appendChild(loaderBar2);
	loader.appendChild(loaderBar3);
	return loader;
}

class Search {
	constructor(element, userInput) {
		this.element = element;
		this.userInput = userInput;

		const searchBarContainer = document.createElement("div");
		searchBarContainer.classList.add("form-container", "flexible");
		const formElement = document.createElement("form");
		formElement.setAttribute("id", "searchForm");
		formElement.autocomplete = "off";
		formElement.classList.add("flexible", "search-box");

		/*icon*/
		const iconContainer = document.createElement("div");
		const icon = `<i class="search-icon vertical-align fa fa-search fa-lg"></i>`;
		iconContainer.insertAdjacentHTML("afterbegin", icon);

		/*input area*/
		const autocompleteField = document.createElement("div");
		autocompleteField.className = "autocomplete";
		const inputBox = document.createElement("input");
		inputBox.setAttribute("id", "searchText");
		inputBox.type = "text";
		inputBox.classList.add("autocomplete", "search-text");
		inputBox.placeholder = "Search...";
		autocompleteField.appendChild(inputBox);

		/*form container*/
		formElement.appendChild(iconContainer);
		formElement.appendChild(autocompleteField);

		/*loader*/
		const loader = createLoader();

		/*clear button*/
		const clearBtn = document.createElement("input");
		clearBtn.setAttribute("id", "clearButton");
		clearBtn.type = "submit";
		clearBtn.classList.add("search-button", "btn");
		clearBtn.value = "Clear";
		autocompleteField.appendChild(clearBtn);

		/*append to parent*/
		searchBarContainer.appendChild(formElement);
		searchBarContainer.appendChild(loader);
		searchBarContainer.appendChild(clearBtn);
		element.insertAdjacentElement("afterbegin", searchBarContainer);

		const searchLoader = document.getElementById("loader");
		inputBox.addEventListener("input", event => {
			searchLoader.classList.remove("hide");
			event.preventDefault();
			runSearch(inputBox.value).then(companies => {
				debounce(this.callback(companies), 5000);
			});
		});

		formElement.addEventListener(
			"submit",
			function(e) {
				e.preventDefault();
			},
			false
		);
	}

	dataForResults(callback) {
		this.callback = callback;
	}
}
