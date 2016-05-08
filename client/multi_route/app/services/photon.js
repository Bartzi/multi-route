import Ember from 'ember';
import config from '../config/environment';

export default Ember.Service.extend({
	ajax: Ember.inject.service(),
	apiEndpoint: null,

	init() {
		this._super(...arguments);
		this.set('apiEndpoint', config.photonApiEndpoint);
	},
	getStreetName(lat, lng) {
		return this.get('ajax').request(
			'reverse',
			{data: {lng: lng, lat: lat}}
		);
	},
	findPois(name) {
		return this.get('ajax').request(
			'find',
			{data: {location: name}}
		);
	}
});
