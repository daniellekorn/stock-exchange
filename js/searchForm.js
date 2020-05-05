async function searchNasdaq(query) {
	let response = await fetch(
		`https://financialmodelingprep.com/api/v3/search?query=${query}&limit=10&exchange=NASDAQ`
	);
	let data = await response.json();
	return data;
}

async function optimizedSearch(query) {
	const data = await searchNasdaq(query);
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
	const tripletStrings = triplets.map((triple) => {
		return triple.join();
	});

	try {
		let profileData = await Promise.all(
			tripletStrings.map((item) =>
				fetch(
					`https://financialmodelingprep.com/api/v3/company/profile/${item}`
				)
					.then((r) => r.json())
					.catch((error) => ({ error, url }))
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

class SearchForm {
	constructor(parent) {
		this.parent = parent;
		this.createForm();
		this.formDebounce();
	}

	dataForResults(callback) {
		this.callback = callback;
	}

	runSearch(query) {
		optimizedSearch(query).then((companies) => {
			this.callback(companies);
		});
	}

	createForm() {
		const formElement = document.createElement("form");
		formElement.setAttribute("id", "searchForm");
		formElement.autocomplete = "off";
		formElement.classList.add(
			"col-sm-12",
			"form-group",
			"m-0",
			"row",
			"align-items-center"
		);

		/*icon*/
		const icon = `<i class="search-icon col-xs-1 vertical-align fa fa-search fa-lg"></i>`;
		formElement.insertAdjacentHTML("afterbegin", icon);

		/*input area*/
		const inputBox = document.createElement("input");
		inputBox.setAttribute("id", "searchText");
		inputBox.type = "text";
		inputBox.classList.add("col-sm-10", "form-control");
		inputBox.placeholder = "Search...";
		formElement.appendChild(inputBox);

		// /*loader*/
		// const loader = createLoader();

		/*search button*/
		const searchBtn = document.createElement("button");
		searchBtn.setAttribute("id", "searchButton");
		searchBtn.type = "submit";
		searchBtn.classList.add("btn", "btn-primary", "col-xs-1");
		searchBtn.textContent = "Search";
		formElement.appendChild(searchBtn);

		/*append to parent*/
		this.parent.insertAdjacentElement("afterbegin", formElement);
		this.parent.insertAdjacentHTML(
			"afterbegin",
			`<h2 class="center main-title">Search Nasdaq Stocks</h2>`
		);
		const searchLoader = document.getElementById("loader");

		searchBtn.addEventListener("click", (event) => {
			searchLoader.classList.remove("hide");
			this.runSearch(inputBox.value);
			searchLoader.classList.add("hide");
		});

		formElement.addEventListener(
			"submit",
			function (e) {
				e.preventDefault();
			},
			false
		);
	}

	formDebounce() {
		let debounceTimeout;
		const inputBox = document.getElementById("searchText");
		inputBox.addEventListener("input", (event) => {
			searchLoader.classList.remove("hide");
			event.preventDefault();
			if (debounceTimeout) {
				clearTimeout(debounceTimeout);
			}
			debounceTimeout = setTimeout(() => {
				this.runSearch(inputBox.value);
				searchLoader.classList.add("hide");
			}, 500);
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
	}
}
