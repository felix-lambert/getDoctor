const recastai = require('recastai')

const botConversation = require('./factories/botConversation')
const getDoctor = require('./formatServices/getDoctor')
const defaultReply = require('./formatServices/defaultReply')

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
    console.log('The conversation action is: ', result.action.slug)
    const replyContent = result.action.reply

    if (!result.replies.length) {
      console.log('default reply')
      defaultReply(message)
    }
    console.log('error is here???')
    console.log(result)
    if (result.action && result.action.slug === 'greetings') {
      const conversation = botConversation(message, replyContent)

      conversation.initConversation()
      .then(() => {
        // Do some code after sending messages
      })
      .catch(err => {
        console.error('Error while sending message to channel', err)
      })
    } else if (result.action.slug === 'get-doctor') {
      // Send all replies
      getDoctor()
      .then((res) => {
        const data = JSON.parse(res)
        const result = data.data.map((doctor) => `${doctor.profile.first_name} ${doctor.profile.last_name}`)
        result.map((name) => message.addReply({ type: 'text', content: name }))
      })
      .catch(err => err).finally(() => {
        message.reply()
        .then(() => {
          console.log('reset memory')
          result.resetMemory()
          // Do some code after sending messages
          result.resetConversation()
          .then(() => {
            console.log('reset conversation')
          }).catch(err => {
            console.error('Error while resetting conversation', err)
          })
        })
        .catch(err => {
          console.error('Error while sending message to channel', err)
        })
      })
    }
  })
  .catch(err => {
    console.error('Error while sending message to Recast.AI', err)
  })
}

module.exports = replyMessage
