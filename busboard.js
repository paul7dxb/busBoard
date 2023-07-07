// Packages
const readline = require("readline-sync");

// Fetching Data
async function fetchData (url) {
	try {
		const dataResponse = await fetch (url);
		if (!dataResponse.ok) {
			throw new Error (`Error occured in request. Status code ${dataResponse.status}`);
		} else {
			const returnData = await dataResponse.json();
			console.log(url);
			return returnData;

		}
	} catch (err) {
		console.error(`Error in ${url}.`, err);
	}

}

 
async function getArrivals(id) {

	const arrivalsData = await fetchData (`https://api.tfl.gov.uk/StopPoint/${id}/Arrivals`);
//	console.log(arrivalsData);
	return arrivalsData;
		
}

const postcodeApiUrl = "http://api.postcodes.io/postcodes/";
async function postcodeToLatLng(postcode) {
	const locationData = await fetchData (`http://api.postcodes.io/postcodes/${postcode}`)
	const latitude = locationData.result.latitude;
	const longitude = locationData.result.longitude;
	return { latitude, longitude };
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


	//const stopID = "490008660N";
	const stopID2 = "490008660S";
	const arrivalsData = await getArrivals(stopID2);
	displayArrivals(arrivalsData);
}

getLocalArrivals();
