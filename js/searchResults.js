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
		text = text["text"];
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
		// name.textContent = `${profile.companyName} (${symbol})`;
		/*highlighting for autocomplete*/
		let nameText = profile.companyName.normalize();
		let symbolText = symbol;
		let nameIndex = nameText.indexOf(text);
		let symbolIndex = symbolText.indexOf(text);
		if (nameIndex >= 0) {
			let highlightNeeded =
				nameText.substring(0, nameIndex) +
				"<span class='highlight'>" +
				nameText.substring(nameIndex, nameIndex + text.length) +
				"</span>" +
				nameText.substring(nameIndex + text.length);
			name.insertAdjacentHTML("afterbegin", highlightNeeded);
		} else {
			name.insertAdjacentHTML("afterbegin", nameText);
		}
		if (symbolIndex >= 0) {
			let highlightNeeded =
				symbolText.substring(0, symbolIndex) +
				"<span class='highlight'>" +
				symbolText.substring(symbolIndex, symbolIndex + text.length) +
				"</span>" +
				symbolText.substring(symbolIndex + text.length);
			name.insertAdjacentHTML("beforeend", highlightNeeded);
		} else {
			name.insertAdjacentHTML("beforeend", ` (${symbol})`);
		}
		name.classList.add("result-name");
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
