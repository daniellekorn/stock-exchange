function getColor(isPositive, element) {
	return isPositive
		? element.classList.add("text-danger")
		: element.classList.add("text-success");
}

function createLoader(id) {
	const loader = document.createElement("div");
	loader.setAttribute("id", id);
	loader.role = "status";
	loader.classList.add("spinner-border", "text-primary", "loader", "d-none");
	return loader;
}

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
			"<span class='bg-warning'>" +
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
			"<span class='bg-warning'>" +
			symbol.substring(symbolIndex, symbolIndex + text.length) +
			"</span>" +
			symbol.substring(symbolIndex + text.length);
		name.insertAdjacentHTML("beforeend", highlightNeeded);
	} else {
		name.insertAdjacentHTML("beforeend", ` (${symbol})`);
	}
	return name;
}
