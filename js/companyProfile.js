class CompanyProfile {
	constructor(parent, symbol) {
		this.parent = parent;
		this.symbol = symbol;
	}

	load() {
		/*this conditional allows for the next forEach fetch (neeeded incase of comparison)*/
		if (typeof this.symbol === "string") {
			this.symbol = [this.symbol];
		}
		this.symbol.forEach(async (symbol) => {
			let profile = await fetch(
				`https://financialmodelingprep.com/api/v3/company/profile/${symbol}`
			);
			let detailsArray = await profile.json();
			console.log(detailsArray);
			this.createPage(symbol, detailsArray);
			this.addChart(symbol);
		});
		profilePage.classList.remove("hide");
	}

	//use from other input (used 3 times in code! DRY)
	getColor(isPositive, element) {
		return isPositive
			? element.classList.add("text-success")
			: element.classList.add("text-danger");
	}

	createPage(symbol, obj) {
		const company = obj.profile;
		const newCompany = document.createElement("div");
		const heading = this.heading(symbol, company);
		const price = this.price(company);
		const description = this.description(company);
		const chartContainer = this.chartContainer(symbol);
		/*append all to DOM*/
		newCompany.appendChild(heading);
		newCompany.appendChild(price);
		newCompany.appendChild(description);
		newCompany.appendChild(chartContainer);
		newCompany.classList.add("shadow-sm", "p-3", "mb-5", "bg-white", "rounded");
		// /*account for comparison card style*/
		if (this.symbol.length === 1) {
			newCompany.classList.add("col-md-8", "offset-md-2");
		} else if (this.symbol.length === 2) {
			newCompany.classList.add("col-md-4", "offset-md-1");
		} else {
			newCompany.classList.add("col-md-4", "pl-5");
		}
		this.parent.appendChild(newCompany);
	}

	heading(symbol, company) {
		const heading = document.createElement("div");
		heading.classList.add("row", "mb-3");
		const logo = document.createElement("img");
		logo.classList.add("img-fluid", "logo-profile");
		logo.src = company.image;
		const name = document.createElement("div");
		name.classList.add("h2");
		name.textContent = `${symbol} (${company.companyName})`;
		heading.appendChild(logo);
		heading.appendChild(name);
		return heading;
	}

	price(company) {
		const price = document.createElement("div");
		price.classList.add("row", "mb-3", "h5");
		const sharePrice = document.createElement("div");
		sharePrice.textContent = `Stock price: $${company.price}`;
		const percentChange = document.createElement("div");
		percentChange.classList.add("ml-1");
		percentChange.textContent = company.changesPercentage;
		this.getColor(company.changesPercentage.includes("+"), percentChange);
		price.appendChild(sharePrice);
		price.appendChild(percentChange);
		return price;
	}

	description(company) {
		const coDescription = document.createElement("div");
		coDescription.textContent = company.description;
		return coDescription;
	}

	chartContainer(symbol) {
		const chartContainer = document.createElement("div");
		chartContainer.classList.add("w-75", "justify-self-center");
		chartContainer.insertAdjacentHTML(
			"beforeend",
			`<canvas id="coChart${symbol}" class="chart" width="80%" height="80%"></canvas>`
		);
		return chartContainer;
	}

	async addChart(symbol) {
		const myChart = document
			.getElementById(`coChart${symbol}`)
			.getContext("2d");
		const companyChart = new Chart(myChart, {
			type: "line",
			data: {
				labels: [],
				datasets: [
					{
						label: "Price on Close",
						backgroundColor: "#0053ee",
						borderColor: "#0053ee",
						data: [],
					},
				],
			},
		});

		let history = await fetch(
			`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line`
		);
		let data = await history.json();
		let yearLength = data.historical.length / 365;
		let yearDecimal = 2020 - yearLength;
		let year = Math.round(yearDecimal);
		for (let i = 0; i < data.historical.length; i++) {
			if (data.historical[i].date.slice(0, 4) === year.toString()) {
				companyChart.data.labels.push(year);
				companyChart.data.datasets[0].data.push(data.historical[i].close);
				year += 1;
			}
		}
		companyChart.update();
	}
}
