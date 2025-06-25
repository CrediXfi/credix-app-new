/**
 * Этот файл сгенерирован автоматически (скриптом generateAbisTs.js).
 * Не редактируйте его вручную — при изменении ABI запустите скрипт заново.
 *
 * ABI контракта: BridgeLogic
 */

export const BridgeLogicAbi = [
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
        indexed: true,
        internalType: 'address',
        name: 'backer',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256'
      }
    ],
    name: 'BackUnbacked',
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
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'onBehalfOf',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'uint16',
        name: 'referralCode',
        type: 'uint16'
      }
    ],
    name: 'MintUnbacked',
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
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      }
    ],
    name: 'ReserveUsedAsCollateralEnabled',
    type: 'event'
  }
] as const;
