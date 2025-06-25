/**
 * Этот файл сгенерирован автоматически (скриптом generateAbisTs.js).
 * Не редактируйте его вручную — при изменении ABI запустите скрипт заново.
 *
 * ABI контракта: PoolLogic
 */

export const PoolLogicAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalDebt',
        type: 'uint256'
      }
    ],
    name: 'IsolationModeTotalDebtUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'reserve',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountMinted',
        type: 'uint256'
      }
    ],
    name: 'MintedToTreasury',
    type: 'event'
  }
] as const;
