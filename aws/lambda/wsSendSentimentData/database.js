const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.getConnections = async () => (
    documentClient.scan({
        TableName: 'connections'
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
