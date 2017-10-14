

const defaultReply = (message) => {
  message.addReply({ type: 'text', content: 'I don\'t have the reply to this yet :)' })
  message.reply()
}

module.exports = defaultReply