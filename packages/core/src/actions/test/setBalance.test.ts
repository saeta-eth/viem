import { expect, test } from 'vitest'

import { accounts, networkClient, testClient } from '../../../../test/src/utils'
import { etherToValue } from '../../utils'
import { fetchBalance } from '../account'
import { setBalance } from '../test/setBalance'

const targetAccount = accounts[0]

test('sets balance', async () => {
  await setBalance(testClient, {
    address: targetAccount.address,
    value: etherToValue('420'),
  })
  expect(
    await fetchBalance(networkClient, {
      address: targetAccount.address,
    }),
  ).toMatchInlineSnapshot('420000000000000000000n')
  await setBalance(testClient, {
    address: targetAccount.address,
    value: etherToValue('69'),
  })
  expect(
    await fetchBalance(networkClient, {
      address: targetAccount.address,
    }),
  ).toMatchInlineSnapshot('69000000000000000000n')
})
