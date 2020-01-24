const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();
const comprehend = new AWS.Comprehend();

exports.handler = (event) => {
    const records = event.Records;
    const tweets = records.map(({ dynamodb: { NewImage } }) => (
        AWS.DynamoDB.Converter.unmarshall(NewImage)
    ));

    const getSentiment = (tweet, callback) => {
        comprehend.detectSentiment({
            LanguageCode: 'en',
            Text: tweet.text
        }, (error, data) => {
            if (error) {
                console.log("\nError with call to Comprehend:\n" + JSON.stringify(error));
            }
            else {
                callback(data);
            }
        });
    }

    // Store sentiment for each tweet
    tweets.forEach((tweet) => {
        getSentiment(tweet, ({ Sentiment }) => {
            const sentimentData = {
                ...tweet,
                sentiment: Sentiment,
            };

            documentClient.put({
                TableName: 'sentiments',
                Item: sentimentData
            }, (error) => {
                if (error) {
                    console.log('Could not add item. Reason: ', JSON.stringify(error));
                }
            });
        });
    });
}
