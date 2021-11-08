require('dotenv').config();

const Airtable = require('airtable');

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appWT4nZ9YG4uDKqD');

module.exports = base;
