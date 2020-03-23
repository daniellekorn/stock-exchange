class companyInfo {
	constructor(element, symbol) {
		this.element = element;
		this.symbol = symbol;
	}

	async load() {
		let profile = await fetch(
			`https://financialmodelingprep.com/api/v3/company/profile/${this.symbol}`
		);
		let detailsArray = await profile.json();
		this.createPage(this.symbol, detailsArray);
		this.addChart();
		pageLoader.classList.add("hide");
		profilePage.classList.remove("hide");
	}

	dynamicFavicon(company) {
		let link =
			document.querySelector("link[rel*='icon']") ||
			document.createElement("link");
		link.type = "image/x-icon";
		link.rel = "shortcut icon";
		link.href = `${company.image}`;
		document.getElementsByTagName("head")[0].appendChild(link);
	}

	getColor(isPositive, element) {
		return isPositive
			? element.classList.add("positive")
			: element.classList.add("negative");
	}

	createPage(symbol, obj) {
		const company = obj.profile;

		const heading = document.createElement("div");
		heading.setAttribute("id", "heading");
		heading.classList.add("heading", "flexible", "flex-child");
		const price = document.createElement("div");
		price.setAttribute("id", "price");
		price.classList.add("price", "flexible", "flex-child");
		const description = document.createElement("div");
		description.setAttribute("id", "description");
		description.classList.add("description", "flex-child");
		const chartContainer = document.createElement("div");
		chartContainer.classList.add("flex-child", "chart-container");
		const pageLoader = document.createElement("div");
		pageLoader.setAttribute("id", "pageLoader");
		pageLoader.classList.add("loader", "hide");
		const loaderBar = document.createElement("span");
		loaderBar.classList.add("loaderBar");
		const loaderBar2 = document.createElement("span");
		loaderBar.classList.add("loaderBar");
		const loaderBar3 = document.createElement("span");
		loaderBar.classList.add("loaderBar");
		pageLoader.appendChild(loaderBar);
		pageLoader.appendChild(loaderBar2);
		pageLoader.appendChild(loaderBar3);
		const title = document.createElement("div");
		title.setAttribute("id", "companyTitle");

		chartContainer.appendChild(pageLoader);
		chartContainer.insertAdjacentHTML(
			"beforeend",
			`<canvas id="coChart" class="chart" width="20%" height="10%"></canvas>`
		);
		/*Add company img/title to title area*/
		this.dynamicFavicon(company);
		title.textContent = company.companyName;
		/* creation of html page elements*/
		const logo = document.createElement("img");
		const name = document.createElement("div");
		const sharePrice = document.createElement("div");
		const percentChange = document.createElement("div");
		percentChange.classList.add("percent");
		const coDescription = document.createElement("div");
		/*css styling*/
		logo.classList.add("responsive-img", "logo");
		name.classList.add("responsive-header");
		this.getColor(company.changesPercentage.includes("+"), percentChange);
		/*assigning content from data array to HTML*/
		logo.src = company.image;
		name.textContent = `${symbol} (${company.companyName})`;
		sharePrice.textContent = `Stock price: $${company.price}`;
		coDescription.textContent = company.description;
		percentChange.textContent = company.changesPercentage;
		/*append all to DOM*/
		heading.appendChild(logo);
		heading.appendChild(name);
		price.appendChild(sharePrice);
		price.appendChild(percentChange);
		description.appendChild(coDescription);
		this.element.appendChild(heading);
		this.element.appendChild(price);
		this.element.appendChild(description);
		this.element.appendChild(chartContainer);
	}

	async addChart() {
		const myChart = document.getElementById("coChart").getContext("2d");
		const companyChart = new Chart(myChart, {
			type: "line",
			data: {
				labels: [],
				datasets: [
					{
						label: "Price on Close",
						backgroundColor: "#0053ee",
						borderColor: "#0053ee",
						data: []
					}
				]
			}
		});

		let history = await fetch(
			`https://financialmodelingprep.com/api/v3/historical-price-full/${this.symbol}?serietype=line`
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
