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
    app.post('/api/newProposal', async (req, res) => {
        try {
            const { publicSignals, proof, repSignals, repProof, proposal } =
                req.body
            console.log('proposal Entered')

            const epochKeyProof = new EpochKeyProof(
                publicSignals,
                proof,
                synchronizer.prover
            )
            const valid = await epochKeyProof.verify()
            console.log('Valid: ', valid)
            if (!valid) {
                res.status(400).json({ error: 'Invalid proof' })
                return
            }
            const epoch = await synchronizer.loadCurrentEpoch()

            console.log('After epoch: ', epoch)

            const reputatitionProof = new ReputationProof(
                repSignals,
                repProof,
                synchronizer.prover
            )

            const repValid = await epochKeyProof.verify()
            console.log('REP Valid: ', repValid)
            if (!repValid) {
                res.status(400).json({ error: 'Invalid proof' })
                return
            }

            const calldata = appContract.interface.encodeFunctionData(
                'newProposal',
                [
                    proposal.title,
                    proposal.description,
                    proposal.minRepToVote,
                    epochKeyProof.epochKey,
                    epoch,
                    repSignals,
                    repProof,
                ]
            )
            console.log('Hash entered')
            console.log(synchronizer.unirepContract.address)
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
