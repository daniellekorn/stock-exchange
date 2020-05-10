window.onload = (() => {
	//instantiate reusable functionality classes for Dependency Injection
	const style = new Style();
	const searchFunctions = new SearchFunctions();
	const compareResults = new CompanyCompare(
		document.getElementById("compareBar")
	);

	//creation of page elements
	new Marquee(document.getElementById("fullSite"), style);

	const searchForm = new SearchForm(
		document.getElementById("searchContainer"),
		searchFunctions
	);
	searchForm.formDebounce(document.getElementById("searchText"));

	const results = new ResultsList(
		document.getElementById("resultChart"),
		compareResults,
		style
	);

	// dataForResults sets callback function in SearchForm
	// allows information to be passed from the search to ResultsList
	const searchText = document.getElementById("searchText");
	searchForm.dataForResults((companies) => {
		if (searchText.value === "") {
			results.clearHistory();
		} else if (companies[0].status == "404") {
			results.noMatches();
		} else {
			results.clearHistory();
			results.createListItems(companies);
		}
	});
})();
