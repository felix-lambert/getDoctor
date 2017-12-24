const botConversation = conversation => (replyContent, type, url) => {
  return {
    defaultReply: () => conversation.reply({ 
      type: type, 
      content: replyContent 
    }),
    addReply: () => conversation.addReply({
      type: type,
      content: replyContent
    }),
    quickReply: () => conversation.reply([{
      type: 'quickReplies',
      content: {
        title: replyContent,
        buttons: [
          { title: 'Any', value: 'any' },
          { title: 'Dentist', value: 'dentist' }
        ]
      }
    }])
  }
}

module.exports = botConversation
