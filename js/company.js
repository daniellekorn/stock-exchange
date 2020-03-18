const heading = document.querySelector("#heading");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const profilePage = document.querySelector("#profilePage");
const pageLoader = document.querySelector("#pageLoader");

async function companyProfile() {
	const urlParams = new URLSearchParams(window.location.search);
	const toSlice = urlParams.toString();
	let slicePoint = toSlice.indexOf("=");
	let symbol = toSlice.slice(slicePoint + 1);
	let profile = await fetch(
		`https://financialmodelingprep.com/api/v3/company/profile/${symbol}`
	);
	let detailsArray = await profile.json();
	createPage(symbol, detailsArray);
	stockHistory(symbol);
	pageLoader.classList.add("hide");
	profilePage.classList.remove("hide");
}

function createPage(symbol, obj) {
	const company = obj.profile;
	/* creation of html page elements*/
	const logo = document.createElement("img");
	const name = document.createElement("div");
	const sharePrice = document.createElement("div");
	const percentChange = document.createElement("div");
	const coDescription = document.createElement("div");
	/*css styling*/
	logo.classList.add("responsive-img");
	name.classList.add("responsive-header");
	if (percentChange.innerText.includes("+")) {
		percentChange.classList.add("positive");
	} else {
		percentChange.classList.add("negative");
	}
	/*assigning content from data array to HTML*/
	logo.src = company.image;
	name.textContent = `${symbol} (${company.companyName})`;
	sharePrice.textContent = company.price;
	coDescription.textContent = company.description;
	percentChange.textContent = company.changesPercentage;
	/*append all to DOM*/
	heading.appendChild(logo);
	heading.appendChild(name);
	price.appendChild(sharePrice);
	price.appendChild(percentChange);
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
			}
		} else if (length > 100 && length <= 1000) {
			if (i % 25 === 0) {
				dates.push(data.historical[i].date);
				priceOnDate.push(data.historical[i].close);
			}
		} else if (length > 1000 && length <= 2000) {
			if (i % 50 === 0) {
				dates.push(data.historical[i].date);
				priceOnDate.push(data.historical[i].close);
			}
		} else if (length > 2000 && length <= 6000) {
			if (i % 100 === 0) {
				dates.push(data.historical[i].date);
				priceOnDate.push(data.historical[i].close);
			}
		} else if (length > 6000) {
			if (i % 200 === 0) {
				dates.push(data.historical[i].date);
				priceOnDate.push(data.historical[i].close);
			}
		} else if (length > 6000 && length <= 10000) {
			if (i % 300 === 0) {
				dates.push(data.historical[i].date);
				priceOnDate.push(data.historical[i].close);
			}
		} else if (length > 10000) {
			if (i % 500 === 0) {
				dates.push(data.historical[i].date);
				priceOnDate.push(data.historical[i].close);
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
					backgroundColor: "#0053ee",
					borderColor: "#0053ee",
					data: arrayTwo
				}
			]
		}
	});
}

window.onload = () => {
	pageLoader.classList.remove("hide");
	companyProfile();
};
