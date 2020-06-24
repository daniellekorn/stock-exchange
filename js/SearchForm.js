class SearchForm {
  constructor(parent, searchFunctions) {
    this.parent = parent;
    this.searchFunctions = searchFunctions;
    this.createForm();
  }

  dataForResults(callback) {
    this.callback = callback;
  }

  runSearch(query) {
    this.searchFunctions.optimizedSearch(query).then((companies) => {
      this.callback(companies);
    });
  }

  createForm() {
    const formElement = document.createElement("form");
    formElement.setAttribute("id", "searchForm");
    formElement.classList.add(
      "col-md-12",
      "col-xs-10",
      "form-group",
      "mb-2",
      "m-0",
      "p-0"
    );
    const searchBar = this.createSearchBar();
    formElement.appendChild(searchBar);
    this.parent.insertAdjacentElement("afterbegin", formElement);
    this.parent.insertAdjacentHTML(
      "afterbegin",
      `<h2 class="text-center main-title display-4 mt-4">Search Nasdaq Stocks</h2>`
    );
  }

  createSearchBar() {
    /*text input area*/
    const inputWrapper = document.createElement("div");
    inputWrapper.classList.add("shadow-lg", "d-flex", "col-md-12", "input-bar");
    const inputBox = document.createElement("input");
    inputBox.setAttribute("id", "searchText");
    inputBox.type = "text";
    inputBox.classList.add(
      "col-xs-10",
      "form-control",
      "h-100",
      "floating-input",
      "shadow-none"
    );
    inputBox.placeholder = "Search...";
    inputWrapper.appendChild(inputBox);

    /*search button*/
    const searchBtn = document.createElement("button");
    searchBtn.setAttribute("id", "searchButton");
    searchBtn.type = "submit";
    searchBtn.classList.add("floating-input", "blue");
    const icon = document.createElement("i");
    icon.classList.add("fa", "fa-search", "fa-2x");
    searchBtn.appendChild(icon);
    inputWrapper.appendChild(searchBtn);

    /*loader after search bar*/
    const loader = document.createElement("div");
    loader.setAttribute("id", "searchLoader");
    loader.classList.add("spinner-grow", "text-primary", "loader", "d-none");
    this.parent.insertAdjacentElement("beforeend", loader);

    /*Button functionality to run search & show loader*/
    const searchLoader = document.getElementById("searchLoader");
    searchBtn.addEventListener("click", (event) => {
      event.preventDefault();
      searchLoader.classList.remove("d-none");
      this.runSearch(inputBox.value);
      searchLoader.classList.add("d-none");
    });

    return inputWrapper;
  }

  formDebounce(inputBox) {
    let debounceTimeout;
    const searchLoader = document.getElementById("searchLoader");
    inputBox.addEventListener("input", (event) => {
      searchLoader.classList.remove("d-none");
      event.preventDefault();
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      debounceTimeout = setTimeout(() => {
        this.runSearch(inputBox.value);
        searchLoader.classList.add("d-none");
      }, 500);
      if (history.pushState) {
        let newurl =
          window.location.protocol +
          "//" +
          window.location.host +
          window.location.pathname +
          `?query=${searchText.value}`;
        window.history.pushState({ path: newurl }, "", newurl);
      }
    });
  }
}
