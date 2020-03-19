const marquee = document.querySelector("#marquee");

class Marquee {
	constructor(element) {
		this.element = element;
	}

	async createMarquee() {
		let marqueeResponse = await fetch(
			"https://financialmodelingprep.com/api/v3/stock/real-time-price"
		);
		let marqueeData = await marqueeResponse.json();
		let stocks = marqueeData.stockList;
		const allListings = stocks.map(item => {
			return `<li class="marquee-list"><span>${item.symbol}</span> <span class="neutral">$${item.price}</span></li>`;
		});
		this.element.innerHTML = allListings.join("");
	}
}

const topMarquee = new Marquee(marquee);
topMarquee.createMarquee();
