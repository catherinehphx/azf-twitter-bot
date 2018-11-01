const Twit = require('twit')
const config = require('./config')
const helpers = require('./helpers')

const Twitter = new Twit(config)

const users = ["10025982", "4196983835"];

const stream = T.stream('statuses/filter', {follow: users});

stream.on('tweet', function (tweet) {
    if (users.indexOf(tweet.user.id_str) > -1) {
        console.log(tweet.user.name + ": " + tweet.text);
        T.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {
            console.log(data)
        })
    }
})

const postReporterRetweet = function () {
  const params = {
    q: '#azfamily, -filter:retweets',
    result_type: 'recent',
    lang: 'en'
  }
  Twitter.get('search/tweets', params, function (err, data) {
    if (!err) {
      let content = `== New report (from ${helpers.getCurrentTime()} (${data.statuses.length} tweets)) ==\n`

      data.statuses.forEach((status) => {
        content += `--- New Tweet:\n
              Status text: ${status.text} \n
              By: ${status.user.name}\n\n`
      })


        if (response) {
          response.ids.forEach((id) => {
            Twitter.post('direct_messages/events/new', {
              event: {
                'type': 'message_create',
                'message_create': {
                  'target': {
                    'recipient_id': id
                  },
                  'message_data': {
                    'text': content,
                  }
                }
              }
            }, function (err, response) {
              if (response) {
                console.log('Message sent. Response: ', response)
              }
              if (err) {
                console.log('Something went wrong while sending message. Error: ', err)
              }
            })
          })
        }
      })


    } else {
      console.log('Something went wrong while searching.')
    }
  })
}

postReporterRetweet()
