import Ember from 'ember';

export default Ember.Component.extend({
	photon: Ember.inject.service(),
	pois: null,
	filter: null,
	actions: {
		autoComplete() {
			const that = this;
			const searchTerm = this.get('filter');
			if (searchTerm.length < 3)
				return;

			this.get('photon').findPois(searchTerm)
				.then(function(data) {
					that.set('pois', data);
					Ember.Logger.info(data);
				})
				.catch(function(error) {
					Ember.Logger.error(error);
				});
		}
	}
});
