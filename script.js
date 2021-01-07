const resultsCardDiv = document.querySelector(".searchResults");
const nominationsCardDiv = document.querySelector(".nominationResults");
const input = document.querySelector("input[class='mainInput']");
let nomStack = [];

const resultsList = document.createElement("ul");
const nominationList = document.createElement("ul");
resultsCardDiv.appendChild(resultsList);
nominationsCardDiv.appendChild(nominationList);

input.addEventListener("keydown", getResults);

function getResults(e) {
    if (e.keyCode == 13) { //listen for enter key
        let uRL = `http://www.omdbapi.com/?apikey=24585241&s='${this.value.trim()}'`;
        let request = new XMLHttpRequest();
        request.open("GET", uRL);
        request.responseType = "json";
        request.send();
        request.onload = function () {
            currentResult = request.response;
            updateResults(currentResult);
        };
    } 
}

function updateResults(responseObj) {
    let list = Array.from(document.querySelectorAll(".searchResult"));
    for (i=0; i<list.length; i++) { //clear area from previous search
        if (list[i]) list[i].remove();
    }

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
}

function addNomination(e) {
    let canNominate = true;
    if (nomStack.length >= 5) canNominate = false;
    for (i=0; i<=nomStack.length; i++) {
        if (nomStack[i]==this.dataset.movie) canNominate = false;
    }
    
    if (canNominate) {
        const origItem = document.querySelector(`[data-movieResults="${this.dataset.movie}"]`);
        const sourceButton = origItem.querySelector("button");
        sourceButton.disabled = "true";
        const listItem = origItem.cloneNode(true);
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
    }

    if (nomStack.length==5) {
        const banner = document.querySelector(".banner");
        banner.style = "display: block";
    }
}

function removeNomination(e) {
    const listItem = document.querySelector(`[data-movieNominated="${this.dataset.movie}"]`);
    listItem.remove();

    for (i=0; i<=nomStack.length; i++) {
        if (nomStack[i]==this.dataset.movie) {
            nomStack.splice(i, 1);
        }
    }

    let list = Array.from(document.querySelectorAll(".searchResult"));
    for (i=0; i<list.length; i++) { 
        if(list[i].dataset.movieresults==this.dataset.movie){
            list[i].querySelector("button").disabled = false;
        }
    }

    if (nomStack.length < 5) {
        const banner = document.querySelector(".banner");
        banner.style = "display: none";
    }
}


