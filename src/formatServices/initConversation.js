
const initConversation = (message, replyContent) => {
  message.addReply({ type: 'text', content: replyContent })
  return message.reply()
}

module.exports = initConversation
