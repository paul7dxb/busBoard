// Packages
const readline = require("readline-sync");

// Fetching Data

const postcodeApiUrl = "http://api.postcodes.io/postcodes/";
async function getArrivals(id) {
	try {
		const arrivalsResponse = await fetch(
			`https://api.tfl.gov.uk/StopPoint/${id}/Arrivals`
		);
		if (!arrivalsResponse.ok) {
			console.log(
				`Error occured in request. Status code ${arrivalsResponse.status}`
			);
			return [];
		} else {
			const arrivalsData = await arrivalsResponse.json();
			return arrivalsData;
		}
	} catch (error) {
		console.error(
			"There has been a problem with the fetch operation getting data for a TFL stop:",
			error
		);
	}
}

async function postcodeToLatLng(postcode) {
	try {
		const locationConverterResponse = await fetch(
			postcodeApiUrl + postcode
		);
		if (!locationConverterResponse.ok) {
			console.log(
				`Error occured in request. Status code ${locationConverterResponse.status}`
			);
			return {};
		} else {
			const locationData = await locationConverterResponse.json();
			const latitude = locationData.result.latitude;
			const longitude = locationData.result.longitude;
			return { latitude, longitude };
		}
	} catch (error) {
		console.error(
			"There has been a problem with the fetch operation for postcode to Lat Lng:",
			error
		);
	}
}

async function displayArrivals(arrivals) {
	const numOfArrivalsToDisplay = Math.min(arrivals.length, 5);

	for (let i = 0; i < numOfArrivalsToDisplay; i++) {
        const arrival = arrivals[i]
		console.log(
			`Bus ${arrival.lineId} arriving in ${arrival.timeToStation} seconds`
		);
	}
}

function getUserInput() {
	console.log("Please enter your location (stopid):");
	return readline.prompt();
}



async function getLocalArrivals() {

    // User postcode conversion
	const userPostcode = getUserInput();
	const userLocation = await postcodeToLatLng(userPostcode);
	console.log(
		`\nuser location:\nlat: ${userLocation.latitude} , long: ${userLocation.longitude}\n`
	);

    // Find StopPoints


	const stopID = "490008660N";
	const arrivalsData = await getArrivals(stopID);
	displayArrivals(arrivalsData);
}

getLocalArrivals();
