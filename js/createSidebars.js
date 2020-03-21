class sidebarItem {
	constructor(element, apiLink, wantedArray, referenceName) {
		this.element = element;
		this.apiLink = apiLink;
		this.wantedArray = wantedArray;
		this.referenceName = referenceName;
	}

	async apiSearch() {
		let response = await fetch(this.apiLink);
		let data = await response.json();
		let jsonArray = data[this.referenceName];
		console.log(jsonArray);
		let condensedIndexes = this.findRelevant(jsonArray, this.wantedArray);
		condensedIndexes.map(this.createSideBar, {
			domItem: this.element
		});
	}

	createSideBar(item) {
		const box = document.createElement("div");
		const ticker = document.createElement("div");
		const name = document.createElement("div");
		const price = document.createElement("div");
		const change = document.createElement("div");
		getColor(!item.changes.toString().includes("-"), change);
		ticker.textContent = item.ticker;
		let percentage = Math.round(item.changes * 100) / 100;
		change.textContent = `(${percentage}%)`;

		if (item.price) {
			price.textContent = `$${item.price}`;
		} else {
			price.textContent = `$${item.ask}`;
		}

		if (item.indexName) {
			name.textContent = item.indexName;
			box.appendChild(name);
			box.classList.add("even-out");
		} else {
			box.classList.add("flexible", "w-wrap");
			box.appendChild(ticker);
			change.classList.add("space");
		}
		box.appendChild(change);
		box.appendChild(price);
		box.classList.add("side-bar-item");
		this.domItem.appendChild(box);
	}

	findRelevant(mainArray, impArray) {
		let newArray = [];
		mainArray.forEach(item => {
			if (impArray.includes(item.ticker) || impArray.includes(item.name)) {
				newArray.push(item);
			}
		});
		return newArray;
	}
}

let majorIndexesUrl = "https://financialmodelingprep.com/api/v3/majors-indexes";
let wantedIndexes = [".DJI", ".IXIC", ".INX", "%5EFCHI", "%5EXAU", "%5EXAX"];
let currenciesUrl = "https://financialmodelingprep.com/api/v3/forex";
let wantedCurrencies = ["EUR/USD", "USD/JPY", "GBP/USD", "EUR/GBP", "USD/CHF"];
let cryptoUrl = "https://financialmodelingprep.com/api/v3/cryptocurrencies";
let wantedCrypto = ["BTC", "ETH", "LTC", "DASH", "XRP"];
