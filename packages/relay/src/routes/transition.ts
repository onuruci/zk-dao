import { Express } from 'express'
import { DB } from 'anondb/node'
import { Synchronizer } from '@unirep/core'
import { UserStateTransitionProof } from '@unirep/circuits'
import TransactionManager from '../singletons/TransactionManager'

export default (app: Express, db: DB, synchronizer: Synchronizer) => {
    app.post('/api/transition', async (req, res) => {
        try {
            console.log("Transition Entered");
            const { publicSignals, proof } = req.body
            const transitionProof = new UserStateTransitionProof(
                publicSignals,
                proof,
                synchronizer.prover
            )
            const valid = await transitionProof.verify()
            console.log("Valid:     ", valid);
            if (!valid) {
                res.status(400).json({ error: 'Invalid proof' })
                return
            }

            const calldata =
                synchronizer.unirepContract.interface.encodeFunctionData(
                    'userStateTransition',
                    [transitionProof.publicSignals, transitionProof.proof]
                )
            console.log("Hash entered");
            console.log(synchronizer.unirepContract.address);
            // console.log(calldata);
            // console.log(transitionProof.publicSignals);
            // console.log(transitionProof.proof);
            const hash = await TransactionManager.queueTransaction(
                synchronizer.unirepContract.address,
                calldata
            )
            console.log("Hash:  ", hash);
            res.json({ hash })
        } catch (error: any) {
            console.log("Error entered");
            //console.log(error);
            res.status(500).json({ error })
        }
    })
}
