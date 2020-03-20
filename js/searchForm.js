class Search extends resultList {
	constructor(element, userInput) {
		super(element);
		this.userInput = userInput;
	}

	async runSearch() {
		let response = await fetch(
			`https://financialmodelingprep.com/api/v3/search?query=${this.userInput}&limit=10&exchange=NASDAQ`
		);
		let data = await response.json();
		if (data.length === 0) {
			this.noMatches();
		} else {
			let promiseArrayTriplets = [];
			for (let i = 0; i < data.length; i += 3) {
				if (i < data.length - 1) {
					promiseArrayTriplets.push(
						`https://financialmodelingprep.com/api/v3/company/profile/${
							data[i].symbol
						},${data[i + 1].symbol},${data[i + 2].symbol}`
					);
				} else {
					promiseArrayTriplets.push(
						`https://financialmodelingprep.com/api/v3/company/profile/${data[i].symbol}`
					);
				}
			}
			try {
				let profileData = await Promise.all(
					promiseArrayTriplets.map(item =>
						fetch(item)
							.then(r => r.json())
							.catch(error => ({ error, url }))
					)
				);
				/*account for differences in API index names*/
				let allTogether = [];
				for (let i = 0; i < profileData.length; i++) {
					/*mult. req at once vs. single req*/
					if (i < profileData.length - 1) {
						allTogether.push(profileData[i].companyProfiles);
					} else {
						allTogether.push(profileData[i]);
					}
				}
				let merged = [].concat.apply([], allTogether);
				merged.map(company => {
					this.createListItems(company);
				});
			} catch (err) {
				console.log(err);
			}
		}
	}
}
// 	constructor(element, userInput) {
// 		super(element);
// 		this.userInput = userInput;
// 	}

// 	createTriplets(array) {
// 		let j = 0;
// 		let triplets = [];
// 		triplets.push([]);
// 		for (let i = 1; i <= array.length; i++) {
// 			triplets[j].push(array[i - 1]);

// 			if (i % 3 == 0) {
// 				triplets.push([]);
// 				j++;
// 			}
// 		}
// 		if (triplets[0].length === 0) {
// 			// if the data you received was epmty
// 			console.log("Error: empty array");
// 		}
// 		return triplets;
// 	}

// 	async getProfileData(array) {
// 		let allTogether = [];
// 		let merged = [];
// 		try {
// 			let data = await Promise.all(
// 				array.map(item =>
// 					fetch(
// 						`https://financialmodelingprep.com/api/v3/company/profile/${item}`
// 					)
// 						.then(r => r.json())
// 						.catch(error => ({ error, url }))
// 				)
// 			);
// 			for (let i = 0; i < data.length; i++) {
// 				if (i < data.length - 1) {
// 					allTogether.push(data[i].companyProfiles);
// 				} else {
// 					allTogether.push(data[i]);
// 				}
// 			}
// 			merged = [].concat.apply([], allTogether);
// 			merged.map(company => {
// 				this.createListItems(company);
// 			});
// 		} catch (err) {
// 			console.log(err);
// 		}
// 	}

// 	async runSearch() {
// 		let response = await fetch(
// 			`https://financialmodelingprep.com/api/v3/search?query=${this.userInput}&limit=10&exchange=NASDAQ`
// 		);
// 		let data = await response.json();

// 		if (data.length === 0) {
// 			const error = document.createElement("div");
// 			error.insertAdjacentHTML(
// 				"afterbegin",
// 				`We did not find any results that match <strong>"${this.userInput}"</strong>`
// 			);
// 			error.classList.add("error-style");
// 			resultChart.append(error);
// 		} else {
// 			const searchSymbols = [];
// 			for (let i = 0; i < data.length; i++) {
// 				let symbol = data[i].symbol;
// 				searchSymbols.push(symbol);
// 			}
// 			let triple = this.createTriplets(searchSymbols);
// 			const tripletStrings = triple.map(triple => {
// 				return triple.join();
// 			});
// 			this.getProfileData(tripletStrings);
// 		}
// 		loader.classList.add("hide");
// 	}
