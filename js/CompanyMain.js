window.onload = (() => {
	const urlParams = new URLSearchParams(window.location.search);
	const symbol = urlParams.get("symbol");
	let symbolsArray = [];
	if (symbol.toString().length > 5) {
		compareSymbols = symbol.split(",");
		symbolsArray = compareSymbols.filter(
			(symbol) => symbol != "" || null || undefined
		);
	} else {
		symbolsArray.push(symbol);
	}
	const style = new Style();
	const compInfo = new CompanyProfile(
		document.getElementById("profilePage"),
		symbolsArray,
		style
	);
	compInfo.load();
})();
