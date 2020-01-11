import * as AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  sessionToken: process.env.aws_session_token
})

/**
 * @name DBInterface
 * @description Database utility class for performing database operations.
 */
class DBInterface {
  documentClient: AWS.DynamoDB.DocumentClient;

  constructor() {
    this.documentClient = new AWS.DynamoDB.DocumentClient();
  }

  async store(table: string, data: Array<object>): Promise<any> {
    const promises = data.map((datum: DatumObject) => {
      return new Promise<string> ((resolve, reject) => {
        const params = {
          TableName: table,
          Item: datum
        }

        this.documentClient.put(params, (error) => {
          if (error) {
            reject(`Could not add item. Reason: ${JSON.stringify(error)}`);
          }
          else {
            resolve(`Item added to table: \`${table}\` with id: \`${datum.id}\``);
          }
        });
      });
    });

    return Promise.all(promises);
  }
}

export default DBInterface;
