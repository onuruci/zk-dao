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
import UNIREP_APP from '@unirep-app/contracts/artifacts/contracts/UnirepApp.sol/UnirepApp.json'

const appContract = new ethers.Contract(APP_ADDRESS, UNIREP_APP.abi)

export default (app: Express, db: DB, synchronizer: Synchronizer) => {
    app.post('/api/newPost', async (req, res) => {
        try {
            const { publicSignals, proof, repSignals, repProof, post } =
                req.body
            console.log(post)

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

            // Fix and check reputationProof

            const repValid = await epochKeyProof.verify()
            console.log('REP Valid: ', repValid)
            if (!repValid) {
                res.status(400).json({ error: 'Invalid proof' })
                return
            }

            const calldata = appContract.interface.encodeFunctionData(
                'newPost',
                //[epochKeyProof.epochKey, epoch, publicSignals, proof, context]
                [
                    epochKeyProof.epochKey,
                    epoch,
                    repSignals,
                    repProof,
                    post.title,
                    post.description,
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
