class CompanyCompare {
	constructor(compareBar) {
		this.compareBar = compareBar;
		this.companies = [];
	}

	createMaxError() {
		const error = document.createElement("div");
		error.setAttribute("id", "maxError");
		error.textContent = "Compare up to 3 companies";
		error.classList.add(
			"alert",
			"alert-danger",
			"pt-2",
			"pb-2",
			"w-25",
			"d-inline"
		);
		this.compareBar.insertAdjacentElement("afterbegin", error);
		this.maxError = error;
	}

	addCompany(company) {
		//present error on 4th click attempt
		if (
			this.companies.length === 3 &&
			!this.compareBar.contains(document.getElementById("maxError"))
		) {
			this.createMaxError();
		}
		//push company to this.companies array
		if (
			!this.companies.includes(company.symbol) &&
			this.companies.length <= 2
		) {
			this.companies.push(company.symbol);
			const newBtn = this.addButton(company);
			newBtn.addEventListener(`click`, () => {
				this.removeCompany(company);
			});
		}
		//show main compare btn
		if (this.companies.length > 1) {
			const compareBtn = document.getElementById(`compareBtn`);
			compareBtn.classList.remove("d-none");
			compareBtn.innerText = "Compare companies";
			this.compareBtn = compareBtn;
			this.setSearchParams(this.compareBtn);
		}
	}

	addButton(company) {
		const newBtn = document.createElement("button");
		newBtn.classList.add("btn", "btn-light", "mr-2");
		newBtn.setAttribute("id", `${company.symbol}Btn`);
		newBtn.textContent = `${company.symbol} x`;
		this.compareBar.insertAdjacentElement("afterbegin", newBtn);
		return newBtn;
	}

	removeCompany(company) {
		if (this.maxError) {
			this.maxError.remove();
		}
		this.companies = this.companies.filter(
			(symbol) => symbol !== company.symbol
		);
		const relevantBtn = document.getElementById(`${company.symbol}Btn`);
		relevantBtn.remove();

		if (this.compareBtn && this.companies.length <= 1) {
			this.compareBtn.classList.add("d-none");
		} else if (this.compareBtn && this.companies.length > 1) {
			this.setSearchParams(this.compareBtn);
		}
	}

	setSearchParams(mainCompBtn) {
		let searchString = "";
		for (let i = 0; i < this.companies.length; i++) {
			searchString += `${this.companies[i]},`;
		}
		mainCompBtn.href = `company.html?symbol=${searchString}`;
		console.log(mainCompBtn.href);
	}
}
