window.onload = (() => {
	//two class instantiations that will be passed to other classes for functional reusability
	const style = new Style();
	const searchFunctions = new SearchFunctions();

	//creation of page elements
	new Marquee(document.getElementById("fullSite"), style);

	const searchForm = new SearchForm(
		document.getElementById("searchContainer"),
		searchFunctions
	);
	searchForm.formDebounce(document.getElementById("searchText"));

	const results = new ResultsList(
		document.getElementById("resultChart"),
		document.getElementById("compareBar"),
		style
	);

	//callback function sent to SearchForm: determines functionality of search and del
	// allows information to be passed from resultsList to the Search class
	const searchText = document.getElementById("searchText");
	searchForm.dataForResults((data) => {
		if (searchText.value === "") {
			results.clearHistory();
		} else if (data[0].status == "404") {
			results.noMatches();
		} else {
			results.clearHistory();
			results.createListItems(data);
		}
	});
})();
