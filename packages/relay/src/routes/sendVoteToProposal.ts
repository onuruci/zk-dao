import { ethers } from 'ethers'
import { Express } from 'express'
import { DB } from 'anondb/node'
import { Synchronizer } from '@unirep/core'
import { EpochKeyProof, ReputationProof } from '@unirep/circuits'
import { APP_ADDRESS } from '../config'
import TransactionManager from '../singletons/TransactionManager'
import UNIREP_APP from '@unirep-app/contracts/artifacts/contracts/UnirepApp.sol/ZKComm.json'

export default (app: Express, db: DB, synchronizer: Synchronizer) => {
    app.post('/api/sendVoteToProposal', async (req, res) => {
        try {
            const { index, voteValue, repSignals, repProof } = req.body

            const appContract = new ethers.Contract(APP_ADDRESS, UNIREP_APP.abi)

            console.log('App contract in vote send proposal')

            let calldata: any

            const reputationProof = new ReputationProof(
                repSignals,
                repProof,
                synchronizer.prover
            )

            console.log(reputationProof.publicSignals, reputationProof.proof)

            console.log('1')

            calldata = appContract.interface.encodeFunctionData(
                'voteProposal',
                [
                    index,
                    voteValue,
                    reputationProof.publicSignals,
                    reputationProof.proof,
                ]
            )
            console.log('2')

            const hash = await TransactionManager.queueTransaction(
                APP_ADDRESS,
                calldata
            )
            console.log('3')

            console.log(hash)
            res.json({ hash })
        } catch (error: any) {
            res.status(500).json({ error })
        }
    })
}
