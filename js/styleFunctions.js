//use these in dif places (for instance get color in marquee and in searchResults,
// add loader here to use for compare and home as well)

class StyleFunctions {
	highlight(profileName, symbol) {
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

	getColor(isPositive, element) {
		return isPositive
			? element.classList.add("positive")
			: element.classList.add("negative");
	}
}
