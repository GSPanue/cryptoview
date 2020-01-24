const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.getNumericalData = async () => (
    documentClient.scan({
        TableName: 'prices'
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
