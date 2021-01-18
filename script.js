const input = document.querySelector("input[class='mainInput']");
const resultsCardDiv = document.querySelector(".searchResults");
const nominationsCardDiv = document.querySelector(".nominationResults");
let nomStack = [];

const resultsList = document.createElement("ul");
const nominationList = document.createElement("ul");
resultsCardDiv.appendChild(resultsList);
nominationsCardDiv.appendChild(nominationList);

input.addEventListener("keydown", getResults);

function getResults(e) {
    if (e.keyCode == 13) { //listen for enter key
        let uRL = `https://www.omdbapi.com/?apikey=24585241&s='${this.value.trim()}'`;
        let request = new XMLHttpRequest();
        request.open("GET", uRL);
        request.responseType = "json";
        request.send();
        request.onload = function () {
            currentResult = request.response;
            if (currentResult.Response == "False") {
                showErrorMessage();
            } else {
                updateResults(currentResult);
            }
            
        };
    } 
}

function updateResults(responseObj) {
    clearPrevSearch();

    for (let key in  responseObj.Search) {
        const movie = responseObj.Search[key];
        const listItem = document.createElement("li");
        listItem.className = "searchResult";
        listItem.setAttribute("data-movieResults", movie.imdbID);
        listItem.textContent = `${movie.Title} (${movie.Year}) `;

        const nomButton = document.createElement("button");
        nomButton.className = "nomButton";
        nomButton.setAttribute("data-movie", movie.imdbID);
        nomButton.addEventListener("mousedown", addNomination);
        nomButton.textContent = "Nominate";
        for (i=0; i< nomStack.length; i++) {
            if (movie.imdbID == nomStack[i]) nomButton.disabled = "true";
        }
        listItem.appendChild(nomButton);
        resultsList.appendChild(listItem);
    }
    toggleCompletion();
}

function showErrorMessage() {
    clearPrevSearch();
    const message = document.createElement("li");
    message.textContent = "Please be more specific";
    message.className = "searchResult";
    resultsList.appendChild(message);
}

function addNomination(e) { 
    const origItem = document.querySelector(`[data-movieResults="${this.dataset.movie}"]`);
    const sourceButton = origItem.querySelector("button");
    sourceButton.disabled = "true";

    const listItem = origItem.cloneNode(true); //deep clone
    listItem.setAttribute("data-movieNominated", this.dataset.movie);
    listItem.className = "nominationResult";
    listItem.querySelector("button").remove();

    const unNomButton = document.createElement("button");
    unNomButton.className = "unNomButton";
    unNomButton.setAttribute("data-movie", this.dataset.movie);
    unNomButton.addEventListener("mousedown", removeNomination);
    unNomButton.textContent = "Remove";
    listItem.appendChild(unNomButton);

    nominationList.appendChild(listItem);

    nomStack.push(this.dataset.movie);

    toggleCompletion();
}

function removeNomination(e) {
    const listItem = document.querySelector(`[data-movieNominated="${this.dataset.movie}"]`);
    listItem.remove();  //remove from display

    for (i=0; i<=nomStack.length; i++) {    //remove from memory
        if (nomStack[i]==this.dataset.movie) {
            nomStack.splice(i, 1);
        }
    }

    toggleCompletion();
}


function toggleCompletion() {
    toggleBanner();
    toggleSubmit();
    toggleDisables();
}

function toggleBanner() {
    const banner = document.querySelector(".banner");
    if (nomStack.length >= 5) {
        banner.style = "display: block";
    } else {
        banner.style = "display: none";
    }
}

function toggleSubmit() {
    const btn = document.querySelector(".submitBtn");
    if (nomStack.length >= 5) {
        btn.disabled = false;
        btn.style = "display: block";
        btn.addEventListener("mousedown", showOutcome);
    } else {
        btn.disabled = true;
        btn.style = "display: none";
    }
}

function toggleDisables() {
    const searchResults = Array.from(document.querySelectorAll(".searchResult"));

    if (nomStack.length >= 5) {
        for (i=0; i<searchResults.length; i++) { 
            searchResults[i].querySelector("button").disabled = true;
        }
    } else {
        for (i=0; i<searchResults.length; i++) { 
            searchResults[i].querySelector("button").disabled = false;
            for (j=0; j<nomStack.length; j++) {
                if(searchResults[i].dataset.movieresults==nomStack[j]){
                    searchResults[i].querySelector("button").disabled = true;
                }
            }
        }
    }
}

function clearPrevSearch() {
    let searchResults = Array.from(document.querySelectorAll(".searchResult"));
    for (i=0; i<searchResults.length; i++) {
        if (searchResults[i]) searchResults[i].remove();
    }
}


function showOutcome() {
    
}
