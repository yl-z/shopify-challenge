const votesCanvas = document.querySelector("#numVotes");
const ratingsCanvas = document.querySelector("#avgRatings");
const graphs = document.querySelector(".feedback");
const ESTIMATES = ratingsData;
const XSHIFT = 20;
const YSHIFT = 75;
const YSCALE = 190;
const [RATINGS, VOTES] = extractBaseXY(ESTIMATES);
const PALETTE = ["rgba(25, 162, 165, 0.8)",
                 "rgba(164, 25, 165, 0.8)",
                 "rgba(164, 162, 25, 0.8)",
                 "rgba(25, 25, 165, 0.8)",
                 "rgba(164, 25, 25, 0.8)"];
console.log(PALETTE);


function showOutcome(e) {
    graphs.style = "display: block";
    votesCanvas.classList.remove("off");
    ratingsCanvas.classList.remove("off");

    graphBaseDensity(RATINGS, ratingsCanvas);
    graphBaseDensity(VOTES, votesCanvas);

    let colorCounter = 0;
    for (i=0; i<nomStack.length; i++) {
        let uRL = `https://www.omdbapi.com/?apikey=24585241&i=${nomStack[i]}`;
        fetch(uRL)
        .then(function(response) {
            return response.json();
        })
        .then(function(response){
            const chosenRating = +response.imdbRating;
            const chosenVotes = Math.log(+response.imdbVotes.replace(",",""));
            const movie=response.imdbID;
            let color = PALETTE[colorCounter];
            colorCounter++; //need this because the promise cannot work with i

            graphHighlight(RATINGS, movie, chosenRating, color, ratingsCanvas);
            graphHighlight(VOTES, movie, chosenVotes, color, votesCanvas);
        })
    }

    //remove search results card
    document.querySelector(".searchResults").remove();

    //remove "remove" buttons
    document.querySelectorAll(".unNomButton").forEach((node) => node.remove());
    
    //remove submit button
    document.querySelector("button.submitBtn").remove();
    //document.querySelector("button.submitBtn").addEventListener("mousedown", reset);
}

function extractBaseXY(data) {
    let ratings = [];
    let votes = [];

    for (i=0; i < data.length; i++) {
        ratings[i] = [data[i][0],data[i][1]]; //from R output x and y values of density estimates
        votes[i] = [data[i][2],data[i][3]]; //for both graphs together
    }
    return [ratings, votes];
}

function graphBaseDensity(data, canvas) { //514x2 array, canvas element
    let graph = document.createElementNS("http://www.w3.org/2000/svg","polyline");
    let coordsString = `${XSHIFT}, ${YSHIFT}`;
    
    for (i=0; i<data.length; i++) {
        coordsString = coordsString + ` ${XSHIFT + i/2}, ${YSHIFT - data[i][1]*YSCALE}`;
    }

    graph.setAttribute("points",coordsString);
    graph.setAttribute("stroke", "rgba(255, 170, 170, 0.82)");
    graph.setAttribute("stroke-width", "3");
    graph.setAttribute("fill", "rgba(164, 162, 165, 0.336)");
    graph.setAttribute("stroke-linecap", "round");
    canvas.appendChild(graph);
    console.log(canvas);
}


function graphHighlight(data, movieID, highlight, color, canvas) {
    let xLocation = -100;
    let yLocation = 0;

    const nomination = document.querySelector(`[data-movieResults=${movieID}]`);
    nomination.style = `color : ${color}`;

    for (i=0; i<data.length-1; i++) {
        if (highlight>=data[i][0] && highlight<=data[i+1][0]) {
            xLocation = i/2;
            yLocation = Math.random()*data[i][1]*YSCALE;
        }
    }

    let marker = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    marker.setAttribute("cx", `${XSHIFT + xLocation}`);
    marker.setAttribute("cy", `${YSHIFT - yLocation}`);
    marker.setAttribute("r", "2");
    marker.setAttribute("fill", `${color}`);
    canvas.appendChild(marker);
}

function reset() {

}