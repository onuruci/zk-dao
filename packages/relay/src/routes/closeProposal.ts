import { ethers } from 'ethers'
import { Express } from 'express'
import { DB } from 'anondb/node'
import { Synchronizer } from '@unirep/core'
import { EpochKeyProof } from '@unirep/circuits'
import { APP_ADDRESS } from '../config'
import TransactionManager from '../singletons/TransactionManager'
import UNIREP_APP from '@unirep-app/contracts/artifacts/contracts/UnirepApp.sol/ZKComm.json'

export default (app: Express, db: DB, synchronizer: Synchronizer) => {
  app.post('/api/closeProposal', async (req, res) => {
    try {
      console.log("Upvote entered");
      const { index } = req.body

      const appContract = new ethers.Contract(APP_ADDRESS, UNIREP_APP.abi)

      console.log("App contract");

      let calldata: any

      calldata = appContract.interface.encodeFunctionData(
        'closeProposal',
        [index]
      )

      console.log("Caldata");

      const hash = await TransactionManager.queueTransaction(
        APP_ADDRESS,
        calldata
      )

      console.log(hash);
      res.json({ hash })
    } catch (error: any) {
      res.status(500).json({ error })
    }
  })
}
