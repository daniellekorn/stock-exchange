class Marquee {
  constructor(parent, style) {
    this.parent = parent;
    this.style = style;
    this.createMarquee();
  }

  async getData() {
    let marqueeResponse = await fetch(
      "https://financialmodelingprep.com/api/v3/quotes/index?apikey=28cbf7a3e170c33fbb032df9b9e13434"
    );
    let marqueeData = await marqueeResponse.json();
    return marqueeData;
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
        childName.textContent = item.name;
        const childPrice = document.createElement("span");
        childPrice.textContent = ` $${item.price}`;
        this.style.getColor(!item.change.toString().includes("-"), childPrice);
        listItem.appendChild(childName);
        listItem.appendChild(childPrice);
        ul.appendChild(listItem);
      });
      marqueeBody.appendChild(ul);
      this.parent.insertAdjacentElement("afterbegin", marqueeBody);
    });
  }
}
