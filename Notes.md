# BusBoard

- Postcode entry to get 2 closest bus stops.
- Then get next buses at those locations.
- Using TfL (London transport)

# Topics

- Internet & API

# Links

- StopPoint API
    - https://api-portal.tfl.gov.uk/api-details#api=StopPoint&operation=Forward_Proxy

## API Calls

- Bus Stop Disruptions:
    - https://api.tfl.gov.uk/StopPoint/Mode/bus/Disruption
- Live BusStop Predicitons:
    - https://api.tfl.gov.uk/StopPoint/{stopID}/Arrivals
    - Example London Stop ID: 490008660N

- Location data from postcode:
    - http://api.postcodes.io/postcodes/{postcode}