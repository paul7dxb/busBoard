// Packages
const readline = require("readline-sync");

// Fetching Data
async function fetchData(url) {
	try {
		const dataResponse = await fetch(url);
		if (!dataResponse.ok) {
			throw new Error(
				`Error occured in request. Status code ${dataResponse.status}`
			);
		} else {
			const returnData = await dataResponse.json();
			// console.log(url);
			return returnData;
		}
	} catch (err) {
		console.error(`Error in ${url}.`, err);
	}
}

async function getArrivals(id) {
	const arrivalsData = await fetchData(
		`https://api.tfl.gov.uk/StopPoint/${id}/Arrivals`
	);
	// console.log(arrivalsData);
	return arrivalsData;
}

function getUserInput() {
	console.log("Please enter your location (stopid):");
	return readline.prompt();
}

async function postcodeToLatLng(postcode) {
	const locationData = await fetchData(
		`http://api.postcodes.io/postcodes/${postcode}`
	);
	const latitude = locationData.result.latitude;
	const longitude = locationData.result.longitude;
	return { latitude, longitude };
}

async function displayArrivals(arrivals, stopName) {
	const numOfArrivalsToDisplay = Math.min(arrivals.length, 5);
	console.log(`Bus stops for a ${stopName}`);
	for (let i = 0; i < numOfArrivalsToDisplay; i++) {
		const arrival = arrivals[i];
		console.log(
			`  Bus ${arrival.lineId} arriving in ${arrival.timeToStation} seconds`
		);
	}
}

async function getNearestBusStops(latitude, longitude) {
	// API call using lat,lng & radius
	const radius = 1000;
	const stopPointsData = await fetchData(
		`https://api.tfl.gov.uk/StopPoint/?lat=${latitude}&lon=${longitude}&stopTypes=NaptanPublicBusCoachTram&radius=${radius}`
	);

	// Sorted the data array
	const stopPoints = stopPointsData.stopPoints;
	stopPoints.sort(
		(stopPointA, stopPointB) => stopPointA.distance - stopPointB.distance
	);

	// Filtered the array for relevant information
	return stopPoints.map((stopPoint) => {
		return {
			id: stopPoint.naptanId,
			distance: stopPoint.distance,
			stopName: stopPoint.commonName
		};
	});
}

async function busBoard() {
	// User postcode conversion
	const userPostcode = getUserInput();
	const userLocation = await postcodeToLatLng(userPostcode);
	console.log(
		`\nuser location:\nlat: ${userLocation.latitude} , long: ${userLocation.longitude}\n`
	);

	// Find Neaerst StopPoints
	const nearestBusStops = await getNearestBusStops(
		userLocation.latitude,
		userLocation.longitude
	);

	// When no StopPoints

	if (nearestBusStops.length === 0) {
		console.log("No buses found near you. Start walking");
		return;
	}

	// Show the busBoard

	for (let i = 0; i < 2 && i < nearestBusStops.length; i++) {
		const arrivalsData = await getArrivals(nearestBusStops[i].id);
		displayArrivals(arrivalsData, nearestBusStops[i].stopName);
	}
}

busBoard();
