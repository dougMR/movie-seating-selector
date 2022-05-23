/*
I thought I was simplifying the app by not making it rebuild all the seats when one is selected / deselected.  Instead, I just toggled a .selected class for the seat.

BUT keeping track of numSelectedSeats, and when to show/hide checkout wound up adding many lines of code, and required additional elements in the html page.  

In the end, it was probably simpler to rebuild the seats with each change.
 
*/

// movies and their prices in an object
const movies = {
    "The Godfather": {
        price: 8,
        seats: [],
    },
    "Finding Nemo": {
        price: 9,
        seats: [],
    },
    "Citizen Kane": {
        price: 10,
        seats: [],
    },
    "Raging Bull": {
        price: 11,
        seats: [],
    },
};
let selectedMovie;
let numSelectedSeats = 0;

const movieSelector = document.getElementById("movie-selector");
const seatsInterface = document.getElementById("seating-interface");
const buyInterface = document.getElementById("buy-tickets");
const screen = document.getElementById("screen");

let options = "<option>select movie</option>";

for (const [key, value] of Object.entries(movies)) {
    options += `<option value="${key}">${key} ($${value.price})</option>`;
}
movieSelector.innerHTML = options;

movieSelector.addEventListener("change", (event) => {
    selectedMovie = event.currentTarget.value;
    try {
        updateSeats();
    } catch (error) {
        console.log("caught error: ", error);
        document.getElementById("seats").innerHTML = "";
        screen.style.display = seatsInterface.style.display = "none";
    }
});

const generateSeats = () => {
    // create seat objects for movie object
    for (const movie of Object.values(movies)) {
        for (let row = 0; row < 8; row++) {
            // add a row
            let newRow = [];
            for (let col = 0; col < 8; col++) {
                // make a seat
                newRow.push({ occupied: Math.random() < 0.5, selected: false, row, col });
            }
            movie.seats.push(newRow);
        }
    }
};

const updateSeats = () => {
    // Generate the on-screen seat elements
    numSelectedSeats = 0;
    let seatsHTML = "";
    for (const [rowIndex, row] of movies[selectedMovie].seats.entries()) {
        seatsHTML += "<div class='row'>";
        for (const [colIndex, col] of row.entries()) {
            seatsHTML += `<span data-rowIndex="${rowIndex}" data-colIndex="${colIndex}" onclick="seatClicked(event)" class="material-symbols-outlined seat ${
                col.occupied ? "occupied" : ""
            } ${col.selected ? "selected" : ""}">chair</span>`;
            if (col.selected) numSelectedSeats++;
        }
        seatsHTML += "</div>";
    }
    seatsHTML += `<div id="screen">screen</div>`;
    document.getElementById("seats").innerHTML = seatsHTML;
    screen.style.display = "inline-block";
    seatsInterface.style.display = "flex";
    showCheckout();
};

const seatClicked = (event) => {
    const row = event.target.getAttribute("data-rowIndex");
    const col = event.target.getAttribute("data-colIndex");
    const seat = movies[selectedMovie].seats[row][col];
    if (!seat.occupied) {
        seat.selected = !seat.selected;
        event.target.classList.toggle("selected");
        if (seat.selected) {
            numSelectedSeats++;
        } else {
            numSelectedSeats--;
        }
    }
    showCheckout();
};

const showCheckout = () => {
    // shows or hides checkout
    if (numSelectedSeats > 0) {
        document.getElementById(
            "message"
        ).innerHTML = `You have <span class="checkout-variables">${numSelectedSeats}</span> seat${
            numSelectedSeats > 1 ? "s" : ""
        } selected for a total of <span class="checkout-variables">$${
            numSelectedSeats * movies[selectedMovie].price
        }</span>`;
    }
    buyInterface.style.visibility = numSelectedSeats > 0 ? "visible" : "hidden";
}

const checkout = () => {
    // set selected seats as occupied
	for (const row of movies[selectedMovie].seats) {
		for (const seat of row) {
			if (seat.selected) {
				seat.occupied = true;
				seat.selected = false;
                const seatEl = document.querySelector(`[data-rowIndex="${seat.row}"][data-colIndex="${seat.col}"]`);
                seatEl.classList.add("occupied");
                seatEl.classList.remove("selected");
                numSelectedSeats--;
			}
		}
	}
    // updateSeats();
    showCheckout();
};

generateSeats();
