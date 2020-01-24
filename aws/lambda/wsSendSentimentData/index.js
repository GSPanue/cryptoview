const AWS = require('aws-sdk');
const database = require('./database');
const websocket = require('./websocket');

const endpoint = '0q5q3whqhf.execute-api.us-east-1.amazonaws.com/dev';

exports.handler = async (event) => {
    const records = event.Records;

    const sentimentData = records.map(({ dynamodb: { NewImage } }) => (
        AWS.DynamoDB.Converter.unmarshall(NewImage)
    ));

    // Get all connection ids
    const connections = (await database.getConnections()).Items.map((connection) => (
        connection.id
    ));

    // Get message promise for each client
    const messagePromises = await websocket.getMessagePromises(connections, sentimentData, endpoint);

    // Resolve message promises
    await Promise.all(messagePromises);

    return {
        statusCode: 200
    }
}
