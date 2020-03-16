const heading = document.querySelector("#heading");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const profilePage = document.querySelector("#profile");
const pageLoader = document.querySelector("#pageLoader");

async function companyProfile() {
	const urlParams = new URLSearchParams(window.location.search);
	const toSlice = urlParams.toString();
	let slicePoint = toSlice.indexOf("=");
	let symbol = toSlice.slice(slicePoint + 1);
	let profile = await fetch(
		`https://financialmodelingprep.com/api/v3/company/profile/${symbol}`
	);
	let details = await profile.json();
	createPage(symbol, details);
	stockHistory(symbol);
	pageLoader.classList.replace("show", "hide");
	profilePage.classList.replace("hide", "show");
}

function createPage(symbol, obj) {
	const logo = document.createElement("img");
	logo.src = obj.profile.image;
	heading.appendChild(logo);

	const name = document.createElement("div");
	name.innerText = `${symbol} (${obj.profile.companyName})`;
	heading.appendChild(name);

	const sharePrice = document.createElement("div");
	sharePrice.innerText = obj.profile.price;
	price.appendChild(sharePrice);

	const percentChange = document.createElement("div");
	percentChange.innerText = obj.profile.changesPercentage;
	if (percentChange.innerText.includes("+")) {
		percentChange.classList.add("positive");
	} else {
		percentChange.classList.add("negative");
	}
	price.appendChild(percentChange);
	price.classList.replace("hide", "show");

	const coDescription = document.createElement("div");
	coDescription.innerText = obj.profile.description;
	description.appendChild(coDescription);
}

async function stockHistory(symbol) {
	let history = await fetch(
		`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line`
	);
	let data = await history.json();
	let length = data.historical.length;
	const dates = [];
	const priceOnDate = [];
	for (let i = 0; i < length; i++) {
		if (length <= 100) {
			if (i % 10 === 0) {
				dates.push(data.historical[i].date);
				priceOnDate.push(data.historical[i].close);
			} else {
				continue;
			}
		} else if (length > 100 && length <= 1000) {
			if (i % 25 === 0) {
				dates.push(data.historical[i].date);
				priceOnDate.push(data.historical[i].close);
			} else {
				continue;
			}
		} else if (length > 1000 && length <= 2000) {
			if (i % 50 === 0) {
				dates.push(data.historical[i].date);
				priceOnDate.push(data.historical[i].close);
			} else {
				continue;
			}
		} else if (length > 2000 && length <= 6000) {
			if (i % 100 === 0) {
				dates.push(data.historical[i].date);
				priceOnDate.push(data.historical[i].close);
			} else {
				continue;
			}
		} else if (length > 6000) {
			if (i % 200 === 0) {
				dates.push(data.historical[i].date);
				priceOnDate.push(data.historical[i].close);
			} else {
				continue;
			}
		} else if (length > 6000 && length <= 10000) {
			if (i % 300 === 0) {
				dates.push(data.historical[i].date);
				priceOnDate.push(data.historical[i].close);
			} else {
				continue;
			}
		} else if (length > 10000) {
			if (i % 500 === 0) {
				dates.push(data.historical[i].date);
				priceOnDate.push(data.historical[i].close);
			} else {
				continue;
			}
		}
	}
	generateChart(dates, priceOnDate);
}

function generateChart(arrayOne, arrayTwo) {
	const coChart = document.getElementById("coChart").getContext("2d");
	new Chart(coChart, {
		type: "line",
		data: {
			labels: arrayOne,
			datasets: [
				{
					label: "Price on Close",
					backgroundColor: "#4834d4",
					borderColor: "#4834d4",
					data: arrayTwo
				}
			]
		}
	});
}

window.onload = () => {
	pageLoader.classList.replace("hide", "show");
	companyProfile();
};
