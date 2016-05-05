from flask import Flask, request
from flask.ext.cors import CORS

import json
import requests

app = Flask(__name__)
CORS(app)


def decode_line(encoded):

    """Decodes a polyline that was encoded using the Google Maps method.

    See http://code.google.com/apis/maps/documentation/polylinealgorithm.html

    This is a straightforward Python port of Mark McClure's JavaScript polyline decoder
    (http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/decode.js)
    and Peter Chng's PHP polyline decode
    (http://unitstep.net/blog/2008/08/02/decoding-google-maps-encoded-polylines-using-php/)
    """

    encoded_len = len(encoded)
    index = 0
    array = []
    lat = 0
    lng = 0

    while index < encoded_len:

        b = 0
        shift = 0
        result = 0

        while True:
            b = ord(encoded[index]) - 63
            index = index + 1
            result |= (b & 0x1f) << shift
            shift += 5
            if b < 0x20:
                break

        dlat = ~(result >> 1) if result & 1 else result >> 1
        lat += dlat

        shift = 0
        result = 0

        while True:
            b = ord(encoded[index]) - 63
            index = index + 1
            result |= (b & 0x1f) << shift
            shift += 5
            if b < 0x20:
                break

        dlng = ~(result >> 1) if result & 1 else result >> 1
        lng += dlng

        array.append((lat * 1e-5, lng * 1e-5))

    return array


@app.route('/route')
def route():
    data = request.args.get('path')

    url = "https://www.komoot.de/api/routing/route"

    params = {
        "sport": "hike",
        "constitution": "3",
        "path": data,
        "format": "encoded_polyline",
    }
    params_str = "&".join("{key}={value}".format(key=key, value=value) for key, value in params.items())

    r = requests.get(url, params=params_str)
    # print(r.json())

    data = r.json()
    return json.dumps({'route': data["latlngs"]})

@app.route('/reverse')
def reverse():
    lat = request.args.get('lat')
    lng = request.args.get('lng')

    reverse_endpoint = 'https://photon.komoot.de/reverse'

    params = {
        'lon': lng,
        'lat': lat,
    }

    r = requests.get(reverse_endpoint, params=params)
    data = r.json()
    location_properties = data['features'][0]['properties']
    return json.dumps({
        'housenumber': location_properties.get('housenumber', ''),
        'city': location_properties.get('city', ''),
        'street': location_properties.get('street', ''),
        'postcode': location_properties.get('postcode', ''),
    })


if __name__ == '__main__':
    app.run(debug=True)
