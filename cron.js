const schedule = require('node-schedule')
const store = require('./boombot/store')
const search = require('./commands/search')


schedule.scheduleJob('15 42 6 * * 6', () => {
  store.getSubscribers(reply => {
    console.log(reply)
    
    reply.forEach(id => {
      store.getLocation(id, (location) => {
        console.log(location)

        if (location) {
          search.sendSubscribedMessage(id)
          search.sendEvents(id, JSON.parse(location))
        } 
        // else { this.getLocation(id) }  
      }) 
    })
  }) 	
});

