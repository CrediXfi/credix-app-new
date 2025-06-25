/**
 * Этот файл сгенерирован автоматически (скриптом generateAbisTs.js).
 * Не редактируйте его вручную — при изменении ABI запустите скрипт заново.
 *
 * ABI контракта: EModeLogic
 */

export const EModeLogicAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'categoryId',
        type: 'uint8'
      }
    ],
    name: 'UserEModeSet',
    type: 'event'
  }
] as const;
