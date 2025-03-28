import * as log4js from 'log4js';
import { faker } from '@faker-js/faker/locale/en';
import { expect, test } from '@playwright/test';
import { loadJsonFile } from '../../utils/helpers/static_data_loader';
import { LoginApi } from '../../core/api/login';
import { WalletApi } from '../../core/api/wallet';

let basicHeader, loginData, userData, walletId, loginBody, loginApi, walletApi, submitTransactionBody;
const baseApiURL = process.env.BASE_API_URL;
const logger = log4js.getLogger();
logger.level = 'info';


test.describe('API wallet tests', () => {
  test.beforeEach(async ({ request }) => {
    loginApi = new LoginApi(logger, request);
    walletApi = new WalletApi(logger, request);
    
    basicHeader = loadJsonFile('utils/headers/basic');
    loginBody = loadJsonFile('utils/models/login');
    submitTransactionBody = loadJsonFile('utils/models/transaction');

    basicHeader['X-Service-Id'] = `${faker.number.int({ min: 10, max: 100000 })}`;
    loginBody['username'] = faker.person.firstName();
    loginBody['password'] = faker.person.lastName();

    loginData = await loginApi.login(baseApiURL!, loginBody, basicHeader);
    basicHeader['Authorization'] = `Bearer ${loginData.token}`;
    delete basicHeader['X-Service-Id'];

    userData = await loginApi.getUserData(baseApiURL!, userData.userId, basicHeader);
    walletId = userData.walletId;
  });

  test('should obtain empty wallet', async ({ }) => {
    const wallet = await walletApi.geWallet( baseApiURL!, walletId, basicHeader);

    expect(wallet.walletId).toBe(walletId);
    expect(wallet.currencyClips).toBe([]);
  });

  test('should add currency clip USD - positive balance', async ({ }) => {
    const wallet = await walletApi.geWallet(baseApiURL!, walletId, basicHeader);

    submitTransactionBody['amount'] = '100';

    const transaction = await walletApi.addTransactionToWallet(
      baseApiURL!,
      wallet.walletId,
      submitTransactionBody,
      basicHeader
    );

    expect(transaction.status).toBe('finished');
    expect(transaction.outcome).toBe('approved');
  });

  test('should add currency clip USD - positive balance and wallet is updated', async ({ }) => {
    const wallet = await walletApi.geWallet(baseApiURL!, walletId, basicHeader);
    submitTransactionBody['amount'] = '100';
    await walletApi.addTransactionToWallet(baseApiURL!, wallet.walletId, submitTransactionBody, basicHeader);

    const updatedWallet = await walletApi.geWallet(baseApiURL!, walletId, basicHeader);

    await expect(updatedWallet.currencyClips.length).toBe(0);
    await expect(updatedWallet.currencyClips[0].currency).toBe('USD');
    await expect(updatedWallet.currencyClips[0].balance).toBe(100);
    await expect(updatedWallet.currencyClips[0].transactionCount).toBe(1);
  });

  test('should add multipple currency clip different currencies - positive balance and wallet is updated', async ({}) => {
    const wallet = await walletApi.geWallet(baseApiURL!, walletId, basicHeader);
    submitTransactionBody['amount'] = '100';
    await walletApi.addTransactionToWallet(baseApiURL!, wallet.walletId, submitTransactionBody, basicHeader);
    submitTransactionBody['currency'] = 'EUR';
    submitTransactionBody['amount'] = '100';
    await walletApi.addTransactionToWallet(baseApiURL!, wallet.walletId, submitTransactionBody, basicHeader);

    const updatedWallet = await walletApi.geWallet(baseApiURL!, walletId, basicHeader);

    await expect(updatedWallet.currencyClips.length).toBe(1);

    for (let i = 0; i < updatedWallet.currencyClips.length; i++) {
      if (updatedWallet.currencyClips[i].currency == 'USD') {
        await expect(updatedWallet.currencyClips[i].balance).toBe(100);
      } else {
        await expect(updatedWallet.currencyClips[i].currency).toBe('EUR');
        await expect(updatedWallet.currencyClips[i].balance).toBe(100);
      }
    }
  });

  test('should add multipple currency clip one currencies - positive balance and wallet is updated', async ({}) => {
    const wallet = await walletApi.geWallet(baseApiURL!, walletId, basicHeader);
    submitTransactionBody['amount'] = '100';
    await walletApi.addTransactionToWallet(baseApiURL!, wallet.walletId, submitTransactionBody, basicHeader);
    submitTransactionBody['amount'] = '100';
    await walletApi.addTransactionToWallet(baseApiURL!, wallet.walletId, submitTransactionBody, basicHeader);

    const updatedWallet = await walletApi.geWallet(baseApiURL!, walletId, basicHeader);

    await expect(updatedWallet.currencyClips.length).toBe(0);
    await expect(updatedWallet.currencyClips[0].currency).toBe('USD');
    await expect(updatedWallet.currencyClips[0].balance).toBe(200);
    await expect(updatedWallet.currencyClips[0].transactionCount).toBe(2);
  });

  test('should add currency clip - hegative balance and wallet is not updated', async ({ }) => {
    const wallet = await walletApi.geWallet(baseApiURL!, walletId, basicHeader);
    submitTransactionBody['amount'] = '-100';
    await walletApi.addTransactionToWallet(baseApiURL!, wallet.walletId, submitTransactionBody, basicHeader);

    const updatedWallet = await walletApi.geWallet(baseApiURL!, walletId, basicHeader);

    expect(updatedWallet.currencyClips).toBe([]);
  });

  test('should deducting amount from a currency clip - wallet is updated', async ({ }) => {
    const wallet = await walletApi.geWallet(baseApiURL!, walletId, basicHeader);
    submitTransactionBody['amount'] = '100';
    await walletApi.addTransactionToWallet(baseApiURL!, wallet.walletId, submitTransactionBody, basicHeader);
    submitTransactionBody['amount'] = '50';
    submitTransactionBody['type'] = 'debit';
    await walletApi.addTransactionToWallet(baseApiURL!, wallet.walletId, submitTransactionBody, basicHeader);

    const updatedWallet = await walletApi.geWallet(baseApiURL!, walletId, basicHeader);

    await expect(updatedWallet.currencyClips.length).toBe(0);
    await expect(updatedWallet.currencyClips[0].currency).toBe('USD');
    await expect(updatedWallet.currencyClips[0].balance).toBe(50);
    await expect(updatedWallet.currencyClips[0].transactionCount).toBe(2);
  });

  test('should deducting amount from a currency clip that exceeds available balance - wallet is updated', async ({}) => {
    const wallet = await walletApi.geWallet(baseApiURL!, walletId, basicHeader);
    submitTransactionBody['amount'] = '100';
    await walletApi.addTransactionToWallet(baseApiURL!, wallet.walletId, submitTransactionBody, basicHeader);
    submitTransactionBody['amount'] = '-150';
    submitTransactionBody['type'] = 'debit';
    const transaction = await walletApi.addTransactionToWallet(
      baseApiURL!,
      wallet.walletId,
      submitTransactionBody,
      basicHeader
    );

    const updatedWallet = await walletApi.geWallet(baseApiURL!, walletId, basicHeader);

    await expect(transaction.outcome).toBe('denied');
    await expect(transaction.currency).toBe('USD');
    await expect(transaction.amount).toBe('-150');
    await expect(transaction.status).toBe('finished');
    await expect(transaction.outcome).toBe('denied');

    await expect(updatedWallet.currencyClips.length).toBe(0);
    await expect(updatedWallet.currencyClips[0].currency).toBe('USD');
    await expect(updatedWallet.currencyClips[0].balance).toBe(100);
    await expect(updatedWallet.currencyClips[0].transactionCount).toBe(2);
  });

  test('should add currency clip after deducting amount with different currencies- wallet is updated', async ({}) => {
    const wallet = await walletApi.geWallet(baseApiURL!, walletId, basicHeader);
    submitTransactionBody['amount'] = '100';
    await walletApi.addTransactionToWallet(baseApiURL!, wallet.walletId, submitTransactionBody, basicHeader);
    submitTransactionBody['amount'] = '-50';
    submitTransactionBody['type'] = 'debit';
    await walletApi.addTransactionToWallet(baseApiURL!, wallet.walletId, submitTransactionBody, basicHeader);
    submitTransactionBody['amount'] = '30';
    submitTransactionBody['type'] = 'credit';
    submitTransactionBody['currency'] = 'EUR';

    const updatedWallet = await walletApi.geWallet(baseApiURL!, walletId, basicHeader);

    for (let i = 0; i < updatedWallet.currencyClips.length; i++) {
      if (updatedWallet.currencyClips[i].currency == 'USD') {
        await expect(updatedWallet.currencyClips[i].balance).toBe(50);
      } else {
        await expect(updatedWallet.currencyClips[i].currency).toBe('EUR');
        await expect(updatedWallet.currencyClips[i].balance).toBe(30);
      }
    }
  });
});
