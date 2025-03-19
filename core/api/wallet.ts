import { Logger } from 'log4js';

export class WalletApi {
  logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public async geWallet(request: any, url: string, walletId: string, headers: JSON): Promise<JSON> {
    this.logger.info(`Get wallet by id:${walletId}`);
    const response = await request.get(`${url}/wallet/${walletId}`, {
      headers: headers,
    });

    return await response.json();
  }

  public async addTransactionToWallet(
    request: any,
    url: string,
    walletId: string,
    body: JSON,
    headers: JSON
  ): Promise<JSON> {
    this.logger.info(`Add transaction tp wallet id:${walletId}`);
    const response = await request.post(`${url}/wallet/${walletId}`, {
      headers: headers,
      data: body,
    });

    return await response.json();
  }

  public async getTransactionFromWallet(
    request: any,
    url: string,
    walletId: string,
    transactionId: string,
    headers: JSON
  ): Promise<JSON> {
    this.logger.info(`Get transaction from wallet id:${walletId} and transaction id: ${transactionId}`);
    const response = await request.get(`${url}/wallet/${walletId}/transaction/${transactionId}`, {
      headers: headers,
    });

    return await response.json();
  }

  public async getAllTransactionFromWallet(request: any, url: string, walletId: string, headers: JSON): Promise<JSON> {
    this.logger.info(`Get all transaction from wallet id:${walletId}`);
    const response = await request.get(`${url}/wallet/${walletId}/transactions`, {
      headers: headers,
    });

    return await response.json();
  }
}
