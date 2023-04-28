import React from 'react'
import './button.css'

import User from '../contexts/User'

import Button from './Button'

type Props = {
    epochKey: any
    postEpoch?: any
    currEpoch?: any
    minRep: any
    publicSignals: any
    proof: any
    index?: any
    context: string
}

export default ({
    epochKey,
    postEpoch,
    currEpoch,
    minRep,
    publicSignals,
    proof,
    index,
    context,
}: Props) => {
    const userContext = React.useContext(User)
    const [valid, setValid] = React.useState<Boolean>(false)
    const [active, setActive] = React.useState<Boolean>(false)

    React.useEffect(() => {
        const checkProof = async () => {
            const resProof = await userContext.proveOutput(publicSignals, proof)
            setValid(resProof.valid)
        }

        if (currEpoch === postEpoch) {
            setActive(true)
        }

        checkProof()
    }, [])

    return (
        <div>
            <div>{context}</div>
            <div>Epoch Key: {epochKey.toString()}</div>
            <div>Min Rep: {minRep.toString()}</div>
            <div>Post Epoch: {postEpoch}</div>
            {active && (
                <Button
                    onClick={async () => {
                        await userContext.upVote(index)
                    }}
                >
                    Upvote
                </Button>
            )}
        </div>
    )
}
