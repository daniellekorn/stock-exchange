class SearchForm extends SearchFunctions {
	constructor(parent) {
		super();
		this.parent = parent;
		this.createForm();
		this.formDebounce();
	}

	dataForResults(callback) {
		this.callback = callback;
	}

	runSearch(query) {
		this.optimizedSearch(query).then((companies) => {
			this.callback(companies);
		});
	}

	createForm() {
		const formElement = document.createElement("form");
		formElement.setAttribute("id", "searchForm");
		formElement.classList.add(
			"col-sm-12",
			"form-group",
			"m-0",
			"row",
			"align-items-center"
		);

		/*text input area*/
		const inputWrapper = document.createElement("div");
		inputWrapper.classList.add("input-group", "col-md-12", "p-0");
		const inputBox = document.createElement("input");
		inputBox.setAttribute("id", "searchText");
		inputBox.type = "text";
		inputBox.classList.add("col-sm-11", "form-control");
		inputBox.placeholder = "Search...";
		inputWrapper.appendChild(inputBox);

		/*search button*/
		const btnWrapper = document.createElement("div");
		btnWrapper.className = "input-group-append";
		const searchBtn = document.createElement("button");
		searchBtn.setAttribute("id", "searchButton");
		searchBtn.type = "submit";
		searchBtn.classList.add("btn", "btn-primary", "col-xs-1");
		searchBtn.textContent = "Search";
		btnWrapper.appendChild(searchBtn);
		inputWrapper.appendChild(btnWrapper);
		formElement.appendChild(inputWrapper);

		// /*loader*/
		// const loader = createLoader();

		/*append title and form to parent element*/
		this.parent.insertAdjacentElement("afterbegin", formElement);
		this.parent.insertAdjacentHTML(
			"afterbegin",
			`<h2 class="text-center main-title">Search Nasdaq Stocks</h2>`
		);

		// const searchLoader = document.getElementById("loader");
		searchBtn.addEventListener("click", (event) => {
			// searchLoader.classList.remove("hide");
			this.runSearch(inputBox.value);
			// searchLoader.classList.add("hide");
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
			// searchLoader.classList.remove("hide");
			event.preventDefault();
			if (debounceTimeout) {
				clearTimeout(debounceTimeout);
			}
			debounceTimeout = setTimeout(() => {
				this.runSearch(inputBox.value);
				// searchLoader.classList.add("hide");
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
