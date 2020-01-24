const AWS = require('aws-sdk');
const database = require('./database');
const utils = require('./utils');

require('aws-sdk/clients/apigatewaymanagementapi');

const createPromises = async (id, api, chunks) => {
    return chunks.map((chunk) => {
        try {
            // Return message promise
            return api.postToConnection({
                ConnectionId: id,
                Data: JSON.stringify({
                    action: 'getNumericalData',
                    data: chunk
                })
            }).promise();
        }
        catch(error) {
            // Delete connection when it no longer exists
            if (error.statusCode === 410) {
                return database.deleteConnection(id);
            }
        }
    })
}

module.exports.getMessagePromises = async (id, data, endpoint) => {
    const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint
    });

    // Create chunks of data
    const chunks = utils.createChunks(data, 250);

    // Return message promises
    return await createPromises(id, apiGatewayManagementApi, chunks);
}
