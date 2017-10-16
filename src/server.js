const express = require('express')
const bodyParser = require('body-parser')

require('./config')
const bot = require('./bot')

const app = express()
app.set('port', process.env.PORT || 5000)
app.use(bodyParser.json())

// It's important to put at the end
app.use((err, req, res, next) => {
  console.log('it is goind inside app.use')
  if (!res.headersSent) {
    res.sendStatus(400)
  }
  return next()
})

app.use('/', (request, response, next) => {

  bot(request.body, response, (error, success) => {
    if (error) {
      next(response.sendStatus(400))
    } else if (success) {
      if (!response.headersSent) { response.status(200).json(success) }
    }
  })
})

if (!process.env.REQUEST_TOKEN.length) {
  console.log('ERROR: process.env.REQUEST_TOKEN variable in src/config.js file is empty ! You must fill this field with the request_token of your bot before launching your bot locally')

  process.exit(0)
} else {
  // Run Express server, on right port
  app.listen(app.get('port'), () => {
    console.log('Our bot is running on port', app.get('port'))
  })
}
