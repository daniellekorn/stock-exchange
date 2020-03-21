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

	createListItems(company) {
		const symbol = company.symbol;
		const profile = company.profile;
		/*creation of elements w/style*/
		const newResult = document.createElement("a");
		newResult.classList.add("result");
		const logo = document.createElement("img");
		logo.classList.add("uniform-size");
		const percentChange = document.createElement("span");
		getColor(profile.changesPercentage.includes("+"), percentChange);
		const name = document.createElement("span");
		const lineBreak = document.createElement("hr");
		lineBreak.classList.add("line-break");
		/*assigning specific details to HTML li item 'new result'*/
		logo.src = `${profile.image}`;
		percentChange.textContent = `${profile.changesPercentage}`;
		name.textContent = `${profile.companyName} (${symbol})`;
		name.classList.add("result-name");
		newResult.appendChild(logo);
		newResult.appendChild(name);
		newResult.appendChild(percentChange);
		newResult.href = `company.html?symbol=${symbol}`;
		/*append complete result to DOM*/
		this.element.appendChild(newResult);
		this.element.appendChild(lineBreak);
	}
}
