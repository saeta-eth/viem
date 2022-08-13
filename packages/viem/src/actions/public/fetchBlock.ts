import { BaseProvider } from '../../providers'
import { Block, BlockTime, Data } from '../../types/ethereum-provider'
import { BaseError, numberToHex } from '../../utils'

export type FetchBlockArgs = {
  includeTransactions?: boolean
} & (
  | {
      blockHash?: Data
      blockNumber?: never
      blockTime?: never
    }
  | {
      blockHash?: never
      blockNumber?: number
      blockTime?: never
    }
  | {
      blockHash?: never
      blockNumber?: never
      blockTime?: BlockTime
    }
)

export type FetchBlockResponse = Block

export async function fetchBlock<TProvider extends BaseProvider>(
  provider: TProvider,
  {
    blockHash,
    blockNumber,
    blockTime = 'latest',
    includeTransactions = false,
  }: FetchBlockArgs = {},
): Promise<FetchBlockResponse> {
  const blockNumberHex =
    blockNumber !== undefined ? numberToHex(blockNumber) : undefined

  let block: Block | null = null
  if (blockHash) {
    block = await provider.request({
      method: 'eth_getBlockByHash',
      params: [blockHash, includeTransactions],
    })
  } else {
    block = await provider.request({
      method: 'eth_getBlockByNumber',
      params: [blockNumberHex || blockTime, includeTransactions],
    })
  }

  if (!block) throw new BlockNotFoundError({ blockHash, blockNumber })
  // TODO: prettify response
  return block
}

///////////////////////////////////////////////////////

export class BlockNotFoundError extends BaseError {
  name = 'BlockNotFoundError'
  constructor({
    blockHash,
    blockNumber,
  }: {
    blockHash?: Data
    blockNumber?: number
  }) {
    let identifier = 'Block'
    if (blockHash) identifier = `Block at hash "${blockHash}"`
    if (blockNumber) identifier = `Block at number "${blockNumber}"`
    super({
      humanMessage: `${identifier} could not be found.`,
      details: 'block not found at given hash or number',
    })
  }
}
