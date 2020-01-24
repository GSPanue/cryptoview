const database = require('./database');
const websocket = require('./websocket');

exports.handler = async (event) => {
    const { connectionId, domainName, stage } = event.requestContext;

    // Get sentiment data
    const sentimentData = (await database.getSentimentData()).Items;

    // Construct endpoint
    const endpoint = `${domainName}/${stage}`;

    // Get message promises for the client
    const messagePromises = await websocket.getMessagePromises(connectionId, sentimentData, endpoint);

    // Resolve message promises
    await Promise.all(messagePromises);

    return {
        statusCode: 200
    };
};
