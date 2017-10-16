const botConversation = (conversation) => (
  {
    defaultReply: (type, replyContent) => conversation.reply({ 
      type: type, 
      content: replyContent 
    }),
    quickReply: (replyContent) => conversation.reply([{
      type: 'quickReplies',
      content: {
        title: replyContent,
        buttons: [
          { title: 'Any', value: 'any' },
          { title: 'Dentist', value: 'dentist' },
          { title: 'Surgeon', value: 'surgeon' },
          { title: 'Psychologist', value: 'psychologist' },
          { title: 'Neurologist', value: 'neurologist' },
          { title: 'General practitioner', value: 'general practitioner' }
        ]
      }
    }]),
    addReply: (type, replyContent) => conversation.addReply({
      type: type,
      content: replyContent
    })
  }
)

module.exports = botConversation