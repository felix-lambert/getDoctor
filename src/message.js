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
    let getDoctorPromise
    const replyContent = result.action.reply
    
    const conversation = Object.assign({}, result, result.action, message)
    const call = botConversation(conversation)

    if (conversation.action) {
      if (conversation.slug === 'get-doctor' || conversation.slug === 'yes') {
        if (conversation.done) {
          promise = call('What type of doctor do you want?').quickReply()
        } else {
          promise = call(replyContent, 'text').defaultReply()
        }
        // Send all replies
      } else if (conversation.slug === 'laught') {
        promise = call('http://www.reactiongifs.com/r/tumblr_n254pmd7R81qfo87uo2_250.gif', 'picture').defaultReply()
      } else if (conversation.slug === 'naughty') {
        promise = call('http://www.reactiongifs.com/r/lolof1.gif', 'picture').defaultReply()
      } else if (conversation.slug === 'ask-joke') {
        // Let's add a funny gif after telling a joke
        promise = call('http://www.reactiongifs.com/r/bml.gif', 'picture').defaultReply()
      }  else if (conversation.slug === 'doctor_type') {

        const jobType = conversation.getMemory('jobs')

        const getAllDoctorNames = (res) => {
          const doctors = JSON.parse(res)
          console.log(doctors)
          call('Here are the doctors', 'text').addReply()
          const result = doctors.data.map((doctor) => {
            return {
              name: `${doctor.profile.first_name} ${doctor.profile.last_name}: ${doctor.profile.bio ? doctor.profile.bio: 'no bio'}`,
              image: doctor.profile.image_url
            }
          })
          // result.map((name) => {
          //   call(name.image, 'picture').addReply()
          //   call(name.name, 'text').addReply()
          // })
          const carouselle = [
            { type: 'text', content: result[0].name },
            { type: 'carouselle', content: result },
            {
              type: 'quickReplies',
              content: {
                title: 'You can change your criterias if you want to!',
                buttons: [{ title: 'Start over', value: 'Start over' }]
              }
            }
          ]
          conversation.reply(carouselle)
          .then()
          .catch(errorHandler)
          // conversation.reply()
          // .then(resetAll)
          // .catch(errorHandler)
        }
        if (jobType.value === 'dentist') {
          getDoctorPromise = getDoctor.dentists()
        } else {
          getDoctorPromise = getDoctor.all()
        }
        getDoctorPromise
        .then(getAllDoctorNames)
        .catch(errorHandler)
      } else {
        promise = call(replyContent,'text').defaultReply()
      }
      if (!promise && !getDoctorPromise) {
        promise = call('I don\'t have the reply to this yet :(', 'text').defaultReply()
      }
      if (promise) {
        promise.then(() => {
          // Do some code after sending messages
          console.log('Send message')
        })
        .catch(errorHandler)
      }
    }
  })
  .catch(errorHandler)
}

module.exports = replyMessage
