/**
 * @name DBInterface
 * @description Database utility class for performing database operations.
 */
class DBInterface {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  connect() {
    /**
     * @todo Connect to AWS
     */
  }

  disconnect() {
    /**
     * @todo Disconnect from AWS
     */
  }

  store(data: object) {
    /**
     * @todo Store data
     * @todo Output data stored
     */
  }
}

export default DBInterface;
