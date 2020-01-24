const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { connectionId } = event.requestContext;
    console.log('Client disconnected with ID: ', connectionId);

    // Delete id from connections table
    await documentClient.delete({
        TableName: 'connections',
        Key: {
            id: connectionId
        }
    }).promise();

    console.log('Connection ID deleted');

    return {
        statusCode: 200,
        body: 'Client disconnected with ID: ' + connectionId
    };
};
