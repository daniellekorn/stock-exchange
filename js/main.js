const searchButton = document.querySelector("#searchButton");
const resultChart = document.querySelector("#resultChart");
const searchText = document.querySelector("#searchText");
const loader = document.querySelector("#loader");
const links = document.querySelectorAll(".result");
const marquee = document.querySelector("#marquee");

function clearHistory() {
	let child = resultChart.lastElementChild;
	while (child) {
		resultChart.removeChild(child);
		child = resultChart.lastElementChild;
	}
}

async function searching() {
	clearHistory();
	let response = await fetch(
		`https://financialmodelingprep.com/api/v3/search?query=${userInput}&limit=10&exchange=NASDAQ`
	);
	let data = await response.json();

	/*notice for user if no results*/
	if (data.length === 0) {
		const error = document.createElement("div");
		error.insertAdjacentHTML(
			"afterbegin",
			`We did not find any results that match <strong>"${userInput}"</strong>`
		);
		error.classList.add("error-style");
		resultChart.append(error);
	} else {
		const searchSymbols = [];
		for (let i = 0; i < data.length; i++) {
			let symbol = data[i].symbol;
			searchSymbols.push(symbol);
		}
		const triplets = createTriplets(searchSymbols);
		const tripletStrings = triplets.map(triple => {
			return triple.join();
		});
		getProfileData(tripletStrings);
	}
	loader.classList.add("hide");
}

function createTriplets(array) {
	var j = 0;
	triplets = [];
	triplets.push([]);
	for (i = 1; i <= array.length; i++) {
		// always updating the final array
		triplets[j].push(array[i - 1]);

		if (i % 3 == 0) {
			triplets.push([]);
			j++;
		}
	}
	if (triplets[0].length === 0) {
		// if the data you received was epmty
		console.log("Error: empty array");
	}
	return triplets;
}

const getProfileData = async array => {
	let allTogether = [];
	let merged = [];
	try {
		let data = await Promise.all(
			array.map(item =>
				fetch(
					`https://financialmodelingprep.com/api/v3/company/profile/${item}`
				)
					.then(r => r.json())
					.catch(error => ({ error, url }))
			)
		);
		for (let i = 0; i < data.length; i++) {
			if (i < data.length - 1) {
				allTogether.push(data[i].companyProfiles);
			} else {
				allTogether.push(data[i]);
			}
		}
		merged = [].concat.apply([], allTogether);
		merged.map(company => {
			createListItem(company);
		});
	} catch (err) {
		console.log(err);
	}
};

function createListItem(company) {
	const symbol = company.symbol;
	const profile = company.profile;
	/*creation of elements w/style*/
	const newResult = document.createElement("a");
	newResult.classList.add("result");
	const logo = document.createElement("img");
	logo.classList.add("uniform-size", "vertical-align");
	const percentChange = document.createElement("span");
	if (profile.changesPercentage.includes("+")) {
		percentChange.classList.add("positive");
	} else {
		percentChange.classList.add("negative");
	}
	const lineBreak = document.createElement("hr");
	lineBreak.classList.add("line-break");
	/*assigning specific details to HTML li item 'new result'*/
	logo.src = `${profile.image}`;
	percentChange.textContent = `${profile.changesPercentage}`;
	newResult.appendChild(logo);
	newResult.insertAdjacentHTML(
		"beforeend",
		`${profile.companyName} (${symbol})`
	);
	newResult.appendChild(percentChange);
	newResult.href = `company.html?symbol=${symbol}`;
	/*append complete result to DOM*/
	resultChart.appendChild(newResult);
	resultChart.appendChild(lineBreak);
}

window.onload = async () => {
	let response = await fetch(
		"https://financialmodelingprep.com/api/v3/stock/real-time-price"
	);
	let data = await response.json();
	stocks = data.stockList;

	/*I wanted to make some red and some green, but the server cannot handle so many requests at once
	in order for me to get the profile and find whether it is in the pos or neg, suggestions?*/
	// try {
	// 	let data = await Promise.all(
	// 		stocks.map(item =>
	// 			fetch(
	// 				`https://financialmodelingprep.com/api/v3/company/profile/${item.symbol}`
	// 			)
	// 				.then(response => response.json())
	// 				.catch(error => ({ error, url }))
	// 		)
	// 	);
	// 	console.log(data);
	// } catch (err) {
	// 	console.log(err);
	// }

	const allListings = stocks.map(item => {
		return `<li class="marquee-list"><span>${item.symbol}</span> <span class="positive">$${item.price}</span></li>`;
	});
	console.log(allListings);
	marquee.innerHTML = allListings.join("");
};

searchButton.addEventListener("click", () => {
	loader.classList.remove("hide");
	userInput = searchText.value;
	searching();
});
