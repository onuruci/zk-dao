import { I_POST } from './../../../frontend/src/pages/types'
import { Express } from 'express'
import { ethers } from 'ethers'
import { DB } from 'anondb/node'
import { Synchronizer } from '@unirep/core'
import { UserStateTransitionProof } from '@unirep/circuits'
import { EpochKeyProof } from '@unirep/circuits'
import { ReputationProof } from '@unirep/circuits'
import { APP_ADDRESS } from '../config'
import TransactionManager from '../singletons/TransactionManager'
import UNIREP_APP from '@unirep-app/contracts/artifacts/contracts/UnirepApp.sol/ZKComm.json'

const appContract = new ethers.Contract(APP_ADDRESS, UNIREP_APP.abi)

export default (app: Express, db: DB, synchronizer: Synchronizer) => {
  app.post('/api/newPost', async (req, res) => {
    try {
      const { repSignals, repProof, address } = req.body

      const reputationProof = new ReputationProof(
        repSignals,
        repProof,
        synchronizer.prover
      )

      console.log("PUBLIC SIGNALS:    ",
        reputationProof.publicSignals);

      // Fix and check reputationProof

      const repValid = await reputationProof.verify()
      console.log('REP Valid: ', repValid)
      if (!repValid) {
        res.status(400).json({ error: 'Invalid proof' })
        return
      }

      const calldata = appContract.interface.encodeFunctionData(
        'spendTokens',
        //[epochKeyProof.epochKey, epoch, publicSignals, proof, context]
        [
          repSignals,
          repProof,
          address
        ]
      )

      // console.log(calldata);
      // console.log(transitionProof.publicSignals);
      // console.log(transitionProof.proof);
      const hash = await TransactionManager.queueTransaction(
        APP_ADDRESS,
        calldata
      )
      console.log('Hash:  ', hash)
      res.json({ hash })
    } catch (error: any) {
      console.log('Error entered')
      //console.log(error);
      res.status(500).json({ error })
    }
  })
}
