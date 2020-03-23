class resultList {
	constructor(element, resultArray) {
		this.element = element;
		this.resultArray = resultArray;
	}

	toggleLoader() {
		if (loader.classList.contains("hide")) {
			loader.classList.remove("hide");
		} else if (!loader.classList.contains("hide")) {
			loader.classList.add("hide");
		}
	}

	clearHistory() {
		let child = this.element.lastElementChild;
		while (child) {
			this.element.removeChild(child);
			child = this.element.lastElementChild;
		}
	}

	noMatches() {
		const error = document.createElement("div");
		error.insertAdjacentHTML(
			"afterbegin",
			`We did not find any results that match <strong>"${this.userInput}"</strong>`
		);
		error.classList.add("error-style");
		resultChart.append(error);
	}

	createListItems(company, text) {
		const symbol = company.symbol;
		const profile = company.profile;
		/*creation of elements w/style*/
		const contianer = document.createElement("div");
		contianer.classList.add("flexible", "result-container");
		const newResult = document.createElement("a");
		newResult.classList.add("result");
		const logo = document.createElement("img");
		logo.classList.add("uniform-size");
		logo.src = `${profile.image}`;
		const percentChange = document.createElement("span");
		getColor(profile.changesPercentage.includes("+"), percentChange);
		percentChange.textContent = `${profile.changesPercentage}`;
		const name = document.createElement("span");
		const lineBreak = document.createElement("hr");
		lineBreak.classList.add("line-break");
		const compare = document.createElement("div");

		/*highlighting for autocomplete*/
		text = text["text"].toLowerCase();
		let nameIndex = profile.companyName.toLowerCase().indexOf(text);
		let symbolIndex = symbol.toLowerCase().indexOf(text);
		if (nameIndex >= 0) {
			let highlightNeeded =
				profile.companyName.substring(0, nameIndex) +
				"<span class='highlight'>" +
				profile.companyName.substring(nameIndex, nameIndex + text.length) +
				"</span>" +
				profile.companyName.substring(nameIndex + text.length);
			name.insertAdjacentHTML("afterbegin", highlightNeeded);
		} else {
			name.insertAdjacentHTML("afterbegin", profile.companyName);
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
		name.classList.add("result-name");

		/*append all elements to result div*/
		newResult.appendChild(logo);
		newResult.appendChild(name);
		newResult.appendChild(percentChange);
		newResult.href = `company.html?symbol=${symbol}`;
		compare.insertAdjacentHTML(
			"beforeend",
			'<button class="compare-btn btn">Compare</button>'
		);
		contianer.appendChild(newResult);
		contianer.appendChild(compare);
		/*append complete result to DOM*/
		this.element.appendChild(contianer);
		this.element.appendChild(lineBreak);
		return compare;
	}
}
