const request = require('request-promise-native')
const getDoctorUrl = 'https://api.betterdoctor.com/2016-03-01/doctors?location=37.773%2C-122.413%2C100&user_location=37.773%2C-122.413&skip=0&limit=10&user_key=7baf69fc85c0921fed80769738523d10'

const getDoctor = {
  all: () => request.get(getDoctorUrl)
}

module.exports = getDoctor
