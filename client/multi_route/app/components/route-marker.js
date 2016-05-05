import Ember from 'ember';

const RouteMarker = Ember.Component.extend({
	photon: Ember.inject.service(),
	loadingIndicator: 'loading...',
	street: '',
	housenumber: '',
	postcode: '',
	city: '',

	init() {
		this._super(...arguments);
		const that = this;
		this.get('photon').getStreetName(this.get('lat'), this.get('lng'))
			.then(function(data) {
				Ember.Logger.info(data);
				that.set('street', data.street);
				that.set('housenumber', data.housenumber);
				that.set('postcode', data.postcode);
				that.set('city', data.city);
				that.set('loadingIndicator', '');
			})
			.catch(function(error) {
				Ember.LOgger.error(error);
			});
	}
});

RouteMarker.reopenClass({
	positionalParams: ['lat', 'lng']
});

export default RouteMarker;


