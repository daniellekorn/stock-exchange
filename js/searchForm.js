class Search extends resultList {
	constructor(element, userInput) {
		super(element);
		this.userInput = userInput;
	}

	async runSearch() {
		this.toggleLoader();
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
				return merged;
			} catch (err) {
				console.log(err);
			}
		}
	}
}
