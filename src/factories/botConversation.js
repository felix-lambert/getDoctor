const initConversation = require('../formatServices/initConversation')

const botConversation = (message, replyContent) => {
  const msg = message
  const reply = replyContent
  return {
    initConversation: () => initConversation(msg, reply)
  }
}

module.exports = botConversation