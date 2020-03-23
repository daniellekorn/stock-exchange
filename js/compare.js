class companyCompare {
	constructor(company, element) {
		this.company = company;
		this.element = element;
	}

	runCompareButton() {
		const compBtn = document.createElement("a");
		compBtn.textContent = "Compare companies";
		compBtn.classList.add("run-compare", "btn");
		compBtn.href = "/compare.html";
		this.element.appendChild(compBtn);

		compBtn.addEventListener("click", () => {
			console.log("Button active!");
		});
	}

	addButton() {
		const newBtn = document.createElement("button");
		newBtn.classList.add("company-compare-btn", "btn");
		newBtn.textContent = this.company.symbol;
		const quitBtn = document.createElement("button");
		quitBtn.classList.add("quit-btn", "btn");
		quitBtn.textContent = "X";
		newBtn.appendChild(quitBtn);
		this.element.appendChild(newBtn);
		this.quitBtn = quitBtn;
		this.newBtn = newBtn;
		return this.quitBtn;
	}

	removeButton() {
		this.newBtn.remove();
	}
}
