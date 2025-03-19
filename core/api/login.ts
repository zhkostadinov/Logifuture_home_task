import { Logger } from 'log4js';

export class LoginApi {
  logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public async login(request: any, url: string, data: JSON, headers: JSON): Promise<JSON> {
    this.logger.info(`Attempt to login with data:${data} `);
    const response = await request.post(`${url}/user/login`, {
      headers: headers,
      data: data,
    });

    return await response.json();
  }

  public async getUserData(request: any, url: string, userId: string, headers: JSON): Promise<JSON> {
    this.logger.info(`Get user by id: ${userId}`);
    const response = await request.get(`${url}/user/info/${userId}`, {
      headers: headers,
    });

    return await response.json();
  }
}
