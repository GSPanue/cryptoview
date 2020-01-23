import * as AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  sessionToken: process.env.aws_session_token
})

/**
 * @name Database
 * @description Database class for performing database operations.
 */
class Database {
  private documentClient: AWS.DynamoDB.DocumentClient;

  constructor() {
    this.documentClient = new AWS.DynamoDB.DocumentClient();
  }

  public getDocumentClient(): AWS.DynamoDB.DocumentClient {
    return this.documentClient;
  }

  public setDocumentClient(newDocumentClient: AWS.DynamoDB.DocumentClient) {
    this.documentClient = newDocumentClient;
  }

  public async store(data: StoreObject, table: string): Promise<any> {
    const promise = new Promise<string> ((resolve, reject) => {
      const params = {
        TableName: table,
        Item: data
      }

      this.documentClient.put(params, (error) => {
        if (error) {
          reject(`Could not add item. Reason: ${JSON.stringify(error)}`);
        }
        else {
          resolve(`Item added to table: \`${table}\` with id: \`${data.id}\``);
        }
      });
    });

    return promise;
  }

  public async isEmpty(table: string) {
    const response = await this.documentClient.scan({
      TableName: table,
      Limit: 1
    }).promise();

    return response.Count === 0;
  }

  public async findLatestTimestamp(ticker: string) {
    const response = this.documentClient.query({
      TableName: 'prices',
      IndexName: 'ticker-timestamp-index',
      ProjectionExpression: '#ts',
      KeyConditionExpression: 'ticker = :tckr and #ts < :ts',
      ExpressionAttributeNames: {
        '#ts': 'timestamp'
      },
      ExpressionAttributeValues: {
        ':tckr': ticker,
        ':ts': + new Date()
      },
      ScanIndexForward: false,
      Limit: 1
    }).promise();

    return (await response).Items[0].timestamp;
  }

  public async priceExists(data: StoreObject) {
    const { ticker, data: { timestamp } } = data;

    const response = this.documentClient.query({
      TableName: 'prices',
      IndexName: 'ticker-timestamp-index',
      ProjectionExpression: '#ts',
      KeyConditionExpression: 'ticker = :tckr and #ts = :ts',
      ExpressionAttributeNames: {
        '#ts': 'timestamp'
      },
      ExpressionAttributeValues: {
        ':tckr': ticker,
        ':ts': + timestamp
      },
      Limit: 1
    }).promise();

    return (await response).Count > 0;
  }

  public async tweetExists(data: StoreObject) {
    const { ticker, timestamp } = data;

    const response = this.documentClient.query({
      TableName: 'tweets',
      IndexName: 'ticker-timestamp-index',
      ProjectionExpression: '#ts',
      KeyConditionExpression: 'ticker = :tckr and #ts = :ts',
      ExpressionAttributeNames: {
        '#ts': 'timestamp'
      },
      ExpressionAttributeValues: {
        ':tckr': ticker,
        ':ts': + timestamp
      },
      Limit: 1
    }).promise();

    return (await response).Count > 0;
  }
}

export default Database;
