const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { connectionId } = event.requestContext;
    console.log('Client connected with ID: ', connectionId);

    // Store connection id in connections table
    await documentClient.put({
        TableName: 'connections',
        Item: {
            id: connectionId
        }
    }).promise();

    console.log('Connection ID stored');

    return {
        statusCode: 200,
        body: 'Client connected with ID: ' + connectionId
    };
};
