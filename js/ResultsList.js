class ResultsList {
	constructor(parent) {
		this.parent = parent;
		this.compareBar = compareBar;
	}

	clearHistory() {
		let child = this.parent.lastElementChild;
		while (child) {
			this.parent.removeChild(child);
			child = this.parent.lastElementChild;
		}
	}

	noMatches() {
		const error = document.createElement("div");
		error.insertAdjacentHTML(
			"afterbegin",
			`We did not find any results that match <strong>"${searchText.value}"</strong>`
		);
		error.classList.add("text-danger", "mt-2");
		resultChart.append(error);
	}

	createListItems(companies) {
		//Dependency Injection to give each list item access to comp compare functionality
		const compareResults = new CompanyCompare(this.compareBar);

		//Mapping for results list physical display
		companies.map((company) => {
			const symbol = company.symbol;
			const profile = company.profile;
			//account for null values in API
			for (let item in profile) {
				if (company.profile[item] === null) {
					company.profile[item] = "";
				}
			}
			/*creation of elements w/style*/
			const ul = document.createElement("ul");
			ul.classList.add("list-group", "list-group-flush");
			const newResult = document.createElement("li");
			newResult.classList.add("list-group-item");

			const linkWrapper = document.createElement("a");
			linkWrapper.href = `company.html?symbol=${symbol}`;

			const logo = document.createElement("img");
			logo.classList.add("img-fluid", "logo");
			logo.src = `${profile.image}`;
			linkWrapper.appendChild(logo);

			const name = highlight(profile.companyName, symbol);
			linkWrapper.appendChild(name);

			const percentChange = document.createElement("span");
			percentChange.textContent = `${profile.changesPercentage}`;
			getColor(
				profile.changesPercentage.toString().includes("+"),
				percentChange
			);
			linkWrapper.appendChild(percentChange);

			const compBtn = document.createElement("button");
			compBtn.classList.add(
				"btn",
				"btn-outline-primary",
				"btn-sm",
				"float-right"
			);
			compBtn.textContent = "Compare";
			newResult.appendChild(linkWrapper);
			newResult.appendChild(compBtn);
			//on click instantiate funct. from CompareCompany class
			compBtn.addEventListener("click", () => {
				compareResults.addCompany(company);
			});

			/*append complete result to cont. then to DOM*/
			ul.appendChild(newResult);
			this.parent.appendChild(ul);
		});
	}
}
