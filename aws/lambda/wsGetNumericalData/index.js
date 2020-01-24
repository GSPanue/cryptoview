const database = require('./database');
const websocket = require('./websocket');

exports.handler = async (event) => {
    const { connectionId, domainName, stage } = event.requestContext;

    // Get numerical data
    const numericalData = (await database.getNumericalData()).Items;

    // Construct endpoint
    const endpoint = `${domainName}/${stage}`;

    // Get message promises for the client
    const messagePromises = await websocket.getMessagePromises(connectionId, numericalData, endpoint);

    // Resolve message promises
    await Promise.all(messagePromises);

    return {
        statusCode: 200
    };
};
