import { Logger } from 'log4js';

export class LoginApi {
  logger: Logger;
  request: any

  constructor(logger: Logger, request: any) {
    this.logger = logger;
    this.request = request;
  }

  public async login(url: string, data: JSON, headers: JSON): Promise<JSON> {
    this.logger.info(`Attempt to login with data:${data} `);
    const response = await this.request.post(`${url}/user/login`, {
      headers: headers,
      data: data,
    });

    return await response.json();
  }

  public async getUserData(url: string, userId: string, headers: JSON): Promise<JSON> {
    this.logger.info(`Get user data by id: ${userId}`);
    const response = await this.request.get(`${url}/user/info/${userId}`, {
      headers: headers,
    });

    return await response.json();
  }
}
