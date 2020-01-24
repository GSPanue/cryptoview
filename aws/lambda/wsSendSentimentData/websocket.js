const AWS = require('aws-sdk');
const database = require('./database');

require('aws-sdk/clients/apigatewaymanagementapi');

const createPromises = async (ids, api, data) => {
    return ids.map((id) => {
        try {
            // Return message promise
            return api.postToConnection({
                ConnectionId: id,
                Data: JSON.stringify({
                    action: 'sendSentimentData',
                    data
                })
            }).promise()
        }
        catch(error) {
            // Delete connectin when it no longer exists
            if (error.statusCode === 410) {
                return database.deleteConnection(id);
            }
        }
    });
}

module.exports.getMessagePromises = async (ids, data, endpoint) => {
    const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint
    });

    return await createPromises(ids, apiGatewayManagementApi, data);
}
