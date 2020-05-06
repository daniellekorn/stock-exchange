function highlight(profileName, symbol) {
	const name = document.createElement("span");
	name.classList.add("result-name");
	let text = searchText.value;
	text = text.toLowerCase();
	let nameIndex;
	let symbolIndex;
	if (profileName) {
		nameIndex = profileName.toLowerCase().indexOf(text);
	} else {
		nameIndex = -1;
	}
	if (symbol) {
		symbolIndex = symbol.toLowerCase().indexOf(text);
	} else {
		symbolIndex = -1;
	}
	if (nameIndex >= 0) {
		let highlightNeeded =
			profileName.substring(0, nameIndex) +
			"<span class='highlight'>" +
			profileName.substring(nameIndex, nameIndex + text.length) +
			"</span>" +
			profileName.substring(nameIndex + text.length);
		name.insertAdjacentHTML("afterbegin", highlightNeeded);
	} else {
		name.insertAdjacentHTML("afterbegin", profileName);
	}
	if (symbolIndex >= 0) {
		let highlightNeeded =
			symbol.substring(0, symbolIndex) +
			"<span class='highlight'>" +
			symbol.substring(symbolIndex, symbolIndex + text.length) +
			"</span>" +
			symbol.substring(symbolIndex + text.length);
		name.insertAdjacentHTML("beforeend", highlightNeeded);
	} else {
		name.insertAdjacentHTML("beforeend", ` (${symbol})`);
	}
	return name;
}

function getColor(isPositive, element) {
	return isPositive
		? element.classList.add("text-danger")
		: element.classList.add("text-success");
}

class ResultsList {
	constructor(parent) {
		this.parent = parent;
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
			const contianer = document.createElement("div");
			contianer.classList.add(
				"row",
				"align-items-center",
				"justify-content-between",
				"overflow-hidden"
			);
			const newResult = document.createElement("a");
			newResult.classList.add("text-decoration-none", "text-dark");
			newResult.href = `company.html?symbol=${symbol}`;

			const logo = document.createElement("img");
			logo.classList.add("img-fluid", "logo");
			logo.src = `${profile.image}`;
			newResult.appendChild(logo);

			const name = highlight(profile.companyName, symbol);
			newResult.appendChild(name);

			const percentChange = document.createElement("span");
			percentChange.textContent = `${profile.changesPercentage}`;
			getColor(
				profile.changesPercentage.toString().includes("+"),
				percentChange
			);
			newResult.appendChild(percentChange);

			const lineBreak = document.createElement("hr");
			lineBreak.classList.add("line-break");

			const compBtn = document.createElement("button");
			compBtn.classList.add("btn", "btn-outline-primary", "btn-sm");
			compBtn.textContent = "Compare";

			/*append complete result to cont. then to DOM*/
			contianer.appendChild(newResult);
			contianer.appendChild(compBtn);
			this.parent.appendChild(contianer);
			this.parent.appendChild(lineBreak);

			/*compare button functionality*/
			accessCompare(company, compBtn);
		});
		const searchLoader = document.getElementById("loader");
		searchLoader.classList.add("hide");
	}
}
