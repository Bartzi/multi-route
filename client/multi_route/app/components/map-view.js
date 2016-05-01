import Ember from 'ember';

export default Ember.Component.extend({
  lat: 52.3879,
  lng: 13.0582,
  zoom: 10,
  markers: [],
  actions: {
    addMarker(e) {
      console.log(e);
      this.get('markers').pushObject({lat: e.latlng.lat, lng: e.latlng.lng});
      console.log(this.get('markers'));
    }
  }
});
