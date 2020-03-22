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
		/*append complete result to DOM*/
		this.element.appendChild(newResult);
		this.element.appendChild(lineBreak);
	}

	// highlight(text) {
	// 	const results = document.getElementsByClassName("result-name");
	// 	const resultArray = Array.from(results);
	// 	let resultText = resultArray.map(item => {
	// 		return item.textContent;
	// 	});
	// 	console.log(resultText);
	// 	resultText.forEach(item => {
	// 		let newDomArray = [];
	// 		let index = item.indexOf(text);
	// 		console.log(index);
	// 		if (index >= 0) {
	// 			let highlightNeeded =
	// 				item.substring(0, index) +
	// 				"<span class='highlight'>" +
	// 				item.substring(index, index + text.length) +
	// 				"</span>" +
	// 				item.substring(index + text.length);
	// 			newDomArray.push(highlightNeeded);
	// 		}
	// 		return newDomArray;
	// 	});
	// }

	// replaceResults() {
	// 	let newDomArray = this.highlight(this.userInput);
	// 	const oldResults = document.getElementsByClassName("result-name");

	// 	for (let i = 0; i < oldResults.length; i++) {
	// 		let str = oldResults[i].innerHTML;
	// 		console.log(str);
	// 		str.replace(str, newDomArray[i].textContent);
	// 	}
	// }
}
