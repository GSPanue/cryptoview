const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.getSentimentData = async () => (
    documentClient.scan({
        TableName: 'sentiments'
    }).promise()
);

module.exports.deleteConnection = async (id) => {
    console.log('Deleting connection id: ', id);

    return documentClient.delete({
        TableName: 'connections',
        Key: {
            id
        }
    }).promise();
}
