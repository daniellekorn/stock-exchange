const searchButton = document.querySelector("#searchButton");
const resultChart = document.querySelector("#resultChart");
const searchText = document.querySelector("#searchText");
const loader = document.querySelector("#loader");

class Search {
	constructor(element) {}

	clearHistory() {
		let child = resultChart.lastElementChild;
		while (child) {
			resultChart.removeChild(child);
			child = resultChart.lastElementChild;
		}
	}

	createTriplets(array) {
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

	async runSearch() {
		this.clearHistory();
		let response = await fetch(
			`https://financialmodelingprep.com/api/v3/search?query=${userInput}&limit=10&exchange=NASDAQ`
		);
		let data = await response.json();
	}

	async getProfileData(array) {
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
	}

	createListItems(company) {
        const symbol = company.symbol;
        const profile = company.profile;
        /*creation of elements w/style*/
        const newResult = document.createElement("a");
        newResult.classList.add("result");
        const logo = document.createElement("img");
        logo.classList.add("uniform-size", "vertical-align");
        const percentChange = document.createElement("span");
        getColor(profile.changesPercentage.includes("+"), percentChange);
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
    }
}
