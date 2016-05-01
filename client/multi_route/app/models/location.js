import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  lat: attr('number'),
  lng: attr('number')
});
