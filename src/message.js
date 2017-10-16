const recastai = require('recastai')

const botConversation = require('./factories/botConversation')
const getDoctor = require('./formatServices/externalAPI/getDoctor')

const errorHandler = (err) => {
  console.error('Error while sending message to channel', err)
}

// This function is the core of the bot behaviour
const replyMessage = (message) => {
  // Instantiate Recast.AI SDK, just for request service
  const request = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE)
  // Get text from message received
  const text = message.content

  console.log('I receive: ', text)

  // Get senderId to catch unique conversation_token
  const senderId = message.senderId

  // Call Recast.AI SDK, through /converse route
  request.converseText(text, { conversationToken: senderId })
  .then(result => {
    
    const resetAll = () => {
      result.resetMemory()
      promise = result.resetConversation()
    }
    
    let promise
    const replyContent = result.action.reply
    
    const conversation = Object.assign({}, result, result.action, message)
    const call = botConversation(conversation)

    console.log('////////////////////////////////////////')
    console.log(conversation)
    console.log('/////////////////////////////////////////')
    if (result.action) {
      if (conversation.slug === 'get-doctor' || conversation.slug === 'yes') {
        if (conversation.done) {
          promise = call.quickReply('What type of doctor do you want?')
        } else {
          promise = call.defaultReply('text', replyContent)
        }
        // Send all replies
      } else if (conversation.slug === 'laught') {
        promise = call.defaultReply('picture', 'http://www.reactiongifs.com/r/tumblr_n254pmd7R81qfo87uo2_250.gif')
      } else if (conversation.slug === 'naughty') {
        promise = call.defaultReply('picture', 'http://www.reactiongifs.com/r/lolof1.gif')
      } else if (conversation.slug === 'ask-joke') {
        // Let's add a funny gif after telling a joke
        promise = call.defaultReply('picture', 'http://www.reactiongifs.com/r/bml.gif')
      }  else if (conversation.slug === 'doctor_type') {
        console.log('.///////////////////////////////////.')
        console.log(conversation)
        const test = conversation.getMemory('jobs')
        console.log('................................................')
        console.log(test)
        console.log('...............................................') 
        const getAllDoctorNames = (res) => {
          const doctors = JSON.parse(res)
          call.addReply('text', 'Here are the doctors name')
          const result = doctors.data.map((doctor) => `${doctor.profile.first_name} ${doctor.profile.last_name}`)
          result.map((name) => call.addReply('text', name))
          conversation.reply()
          .then(resetAll)
          .catch(errorHandler)
        }

        promise = getDoctor.all()
        .then(getAllDoctorNames)
        .catch(errorHandler)
      } else {
        promise = call.defaultReply('text', replyContent)
      }
      if (!promise) {
        promise = call.defaultReply('text', 'I don\'t have the reply to this yet :(')
      }
      promise.then(() => {
        // Do some code after sending messages
        console.log('Send message')
      })
      .catch(errorHandler)
    }
  })
  .catch(errorHandler)
}

module.exports = replyMessage
