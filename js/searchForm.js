class SearchForm extends SearchFunctions {
	constructor(parent) {
		super();
		this.parent = parent;
		this.createForm();
		//move this
		const loader = createLoader("searchLoader");
		this.parent.appendChild(loader);
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
		const searchBar = this.createSearchBar();
		formElement.appendChild(searchBar);
		this.parent.insertAdjacentElement("afterbegin", formElement);
		this.parent.insertAdjacentHTML(
			"afterbegin",
			`<h2 class="text-center main-title display-4 mt-5">Search Nasdaq Stocks</h2>`
		);
	}

	createSearchBar() {
		/*text input area*/
		const inputWrapper = document.createElement("div");
		const iconWrapper = document.createElement("div");
		iconWrapper.classList.add("input-group-prepend");
		const iconParent = document.createElement("span");
		iconParent.classList.add("input-group-text", "bg-white", "col-xs-1");
		const icon = document.createElement("i");
		icon.classList.add("fa", "fa-search");
		iconParent.appendChild(icon);
		iconWrapper.appendChild(iconParent);
		inputWrapper.appendChild(iconWrapper);
		inputWrapper.classList.add("input-group", "col-md-12", "p-0");
		const inputBox = document.createElement("input");
		inputBox.setAttribute("id", "searchText");
		inputBox.type = "text";
		inputBox.classList.add("col-sm-10", "form-control", "shadow-none");
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

		/*Button functionality to run search & show loader*/
		const searchLoader = document.getElementById("searchLoader");
		searchBtn.addEventListener("click", (event) => {
			event.preventDefault();
			searchLoader.classList.remove("d-none");
			this.runSearch(inputBox.value);
			searchLoader.classList.add("d-none");
		});

		return inputWrapper;
	}

	formDebounce(inputBox) {
		let debounceTimeout;
		const searchLoader = document.getElementById("searchLoader");
		inputBox.addEventListener("input", (event) => {
			searchLoader.classList.remove("d-none");
			event.preventDefault();
			if (debounceTimeout) {
				clearTimeout(debounceTimeout);
			}
			debounceTimeout = setTimeout(() => {
				this.runSearch(inputBox.value);
				searchLoader.classList.add("d-none");
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
