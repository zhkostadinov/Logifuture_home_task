import { Logger } from 'log4js';


export class WalletApi {
  logger: Logger;
  request: any


  constructor(logger: Logger, request: any) {
    this.logger = logger;
    this.request = request;
  }

  public async geWallet(url: string, walletId: string, headers: JSON): Promise<JSON> {
    this.logger.info(`Get wallet by id:${walletId}`);
    const response = await this.request.get(`${url}/wallet/${walletId}`, {
      headers: headers,
    });

    return await response.json();
  }

  public async addTransactionToWallet(
    url: string,
    walletId: string,
    body: JSON,
    headers: JSON
  ): Promise<JSON> {
    this.logger.info(`Add transaction tp wallet id:${walletId}`);
    const response = await this.request.post(`${url}/wallet/${walletId}`, {
      headers: headers,
      data: body,
    });

    return await response.json();
  }

  public async getTransactionFromWallet(
    url: string,
    walletId: string,
    transactionId: string,
    headers: JSON
  ): Promise<JSON> {
    this.logger.info(`Get transaction from wallet id:${walletId} and transaction id: ${transactionId}`);
    const response = await this.request.get(`${url}/wallet/${walletId}/transaction/${transactionId}`, {
      headers: headers,
    });

    return await response.json();
  }

  public async getAllTransactionFromWallet(url: string, walletId: string, headers: JSON): Promise<JSON> {
    this.logger.info(`Get all transaction from wallet id:${walletId}`);
    const response = await this.request.get(`${url}/wallet/${walletId}/transactions`, {
      headers: headers,
    });

    return await response.json();
  }
}
