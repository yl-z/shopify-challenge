const votesCanvas = document.querySelector("canvas#numVotes");
const ratingsCanvas = document.querySelector("canvas#avgRatings");
const graph = document.querySelector(".feedback");
const ESTIMATES = ratingsData;
const XSHIFT = 20;
const YSHIFT = 75;
const YSCALE = 100;
const [RATINGS, VOTES] = extractBaseXY(ESTIMATES);


function showOutcome(e) {
    graph.style = "display: block";
    votesCanvas.classList.remove("off");
    ratingsCanvas.classList.remove("off");

    graphBaseDensity(RATINGS, ratingsCanvas);
    graphBaseDensity(VOTES, votesCanvas);

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
            const color = `rgba(${Math.random()*155+50}, ${Math.random()*155+50}, ${Math.random()*155+50}, 1)`;

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
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        for (i=0; i<data.length; i++) {
            ctx.strokeStyle = "rgba(0,0,0,0.125)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(XSHIFT + i/2, YSHIFT + data[i][1]*YSCALE);
            ctx.lineTo(XSHIFT + i/2, YSHIFT - data[i][1]*YSCALE);
            ctx.stroke();
        }
    }
}

function graphHighlight(data, movieID, highlight, color, canvas) {
    let xLocation = -100;
    let yLocation = 0;

    const nomination = document.querySelector(`[data-movieResults=${movieID}]`);
    nomination.style = `color : ${color}`;

    for (i=0; i<data.length-1; i++) {
        if (highlight>=data[i][0] && highlight<=data[i+1][0]) {
            xLocation = i/2;
            yLocation = 2*Math.random()*data[i][1]*YSCALE - data[i][1]*YSCALE ;
        }
    }
    
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(XSHIFT + xLocation, YSHIFT + yLocation - 2);
        ctx.lineTo(XSHIFT + xLocation, YSHIFT + yLocation + 2);
        ctx.stroke();
    }
}

function reset() {

}