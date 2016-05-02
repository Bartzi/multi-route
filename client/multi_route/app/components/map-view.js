import Ember from 'ember';

function markerString(markers) {
  let markerPositions = [];
  for (let i = 0; i < markers.length; ++i) {
    const marker = markers[i];
    markerPositions.push(marker.lat + ',' + marker.lng);
  }
  return markerPositions.join('+');
}

export default Ember.Component.extend({
  ajax: Ember.inject.service(),
  lat: 52.3879,
  lng: 13.0582,
  zoom: 10,
  markers: [],
  route: [],
  actions: {
    addMarker(e) {
      let markers = this.get('markers');
      markers.pushObject({lat: e.latlng.lat, lng: e.latlng.lng});
      if (markers.length >= 2) {
        let that = this;
        this.get('ajax').request('route', {data: {path: markerString(markers)}})
          .then(function(data) {
            that.set('route', L.Polyline.fromEncoded(data.route)._latlngs);
          })
          .catch(function(error) {
            console.log(error);
          });
      }
      console.log(this.get('markers'));
    }
  }
});
