class companyCompare {
	constructor(company, element) {
		this.company = company;
		this.element = element;
	}

	createCompareButton() {
		const compBtn = document.createElement("a");
		compBtn.textContent = "Compare companies";
		compBtn.classList.add("run-compare", "btn");
		this.element.insertAdjacentElement("beforeend", compBtn);
		return compBtn;
	}

	addButton() {
		const newBtn = document.createElement("button");
		newBtn.classList.add("company-compare-btn", "btn");
		newBtn.textContent = this.company.symbol;
		const quitBtn = document.createElement("button");
		quitBtn.classList.add("quit-btn", "btn");
		quitBtn.textContent = "X";
		newBtn.appendChild(quitBtn);
		this.element.insertAdjacentElement("afterbegin", newBtn);
		this.quitBtn = quitBtn;
		this.newBtn = newBtn;
		return this.quitBtn;
	}

	removeButton() {
		this.newBtn.remove();
	}
}
