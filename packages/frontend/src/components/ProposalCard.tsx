import React from 'react'
import { I_PROPOSAL } from '../pages/types'
import './ProposalCard.css'
import { Link } from 'react-router-dom'

type Props = {
    proposalInfo: I_PROPOSAL
}

export const ProposalCard = ({ proposalInfo }: Props) => {
    console.log('proposal info: ', proposalInfo)

    const {
        id,
        title,
        description,
        minRepToVote,
        abstein,
        approvals,
        rejects,
        currEpoch,
        publicSignals,
    } = proposalInfo
    return (
        <div className="proposal-container">
            <div className="proposal-banner">
                <div className="proposal-title">{title}</div>
            </div>

            <div className="proposal-state-wrapper">
                <div className="proposal-status">Active</div>
                <div className="karma-wrapper">
                    <div>at epoch {currEpoch?.toString()}...</div>
                    <div>{publicSignals![1].toString()} karma</div>
                </div>
            </div>
            <div>{description}</div>
        </div>
    )
}
