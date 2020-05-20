const { readFileSync } = require('fs');
const { resolve } = require('path');
const { load } = require('js-yaml');
const { countries } = require('countries-list');
const Table = require('table-builder');

const encoding = 'utf-8'
const conferencesYaml = resolve(__dirname, '../conferences.yaml');
const { conferences } = load(readFileSync(conferencesYaml, { encoding }));

const someConferences = conferences
.filter(({tags}) => tags.includes('Full-stack'))
.filter(({scheduled}) => !!scheduled)
.map(({name, rating, tags, city, country}) => ({
  name,
  rating,
  topic: tags[0],
  location: `<img src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.1.0/flags/1x1/${country.toLowerCase()}.svg" width="13px" /> ${city}, ${countries[country].name}`
}))

const enoughConferencesForListings = someConferences.length >= 10
if (!enoughConferencesForListings) {
  throw `Cannot create dev.to and github.com listings. Not enough scheduled conferences. ${someConferences.length}/10`
}


console.log(
  new Table()
  .setHeaders({rating: 'Rating', topic: 'Topic', name: 'Name', location: 'Location'})
  .setData(someConferences)
  .render());

