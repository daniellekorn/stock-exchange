class Marquee {
	constructor(parent) {
		this.parent = parent;
		this.createMarquee();
	}

	async getData() {
		let marqueeResponse = await fetch(
			"https://financialmodelingprep.com/api/v3/majors-indexes"
		);
		let marqueeData = await marqueeResponse.json();
		let stocks = marqueeData.majorIndexesList;
		return stocks;
	}

	createMarquee() {
		const marqueeBody = document.createElement("div");
		marqueeBody.classList.add("marquee");
		marqueeBody.id = "marquee";
		const ul = document.createElement("ul");
		ul.classList.add("marquee-content", "flexible");
		this.getData().then((items) => {
			items.map((item) => {
				const listItem = document.createElement("li");
				listItem.className = "marquee-list";
				const childName = document.createElement("span");
				childName.textContent = item.indexName;
				const childPrice = document.createElement("span");
				childPrice.textContent = ` $${item.price}`;
				getColor(!item.changes.toString().includes("-"), childPrice);
				listItem.appendChild(childName);
				listItem.appendChild(childPrice);
				ul.appendChild(listItem);
			});
			marqueeBody.appendChild(ul);
			this.parent.insertAdjacentElement("afterbegin", marqueeBody);
		});
	}
}
