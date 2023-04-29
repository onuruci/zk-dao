import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { ethers } from 'ethers'
import { APP_ADDRESS, ETH_PROVIDER_URL } from './constants'
import UNIREP_APP from '@unirep-app/contracts/artifacts/contracts/UnirepApp.sol/ZKComm.json'
import { I_PROPOSAL } from './types'
import './ProposalDetailed.css'
import Tooltip from '../components/Tooltip'
import Timer from '../components/Timer'
import User from '../contexts/User'
import Button from '../components/Button'

const APP_CONTRACT = new ethers.Contract(
    APP_ADDRESS,
    UNIREP_APP.abi,
    new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL)
)

export const ProposalDetailed = () => {
    const { proposalId } = useParams()
    const userContext = useContext(User)

    const [proposalInfo, setProposalInfo] = useState<I_PROPOSAL>()

    async function getProposalInfo() {
        const proposals = await APP_CONTRACT.getAllProposals()

        setProposalInfo(proposals[parseInt(proposalId!)])
    }

    useEffect(() => {
        getProposalInfo()
    }, [])

    return (
        <div className="detailed-proposal-outer-wrapper">
            <Button
                styles={{
                    padding: '12px 0',
                    'font-size': '16px',
                    width: '100%',
                    'background-color': 'white',
                    border: '1px solid black',
                    'border-radius': '12px',
                }}
                onClick={() => userContext.stateTransition()}
                loadingText="Updating epoch..."
            >
                Update Epoch
            </Button>
            <div className="proposal-detailed-wrapper">
                <div>
                    <div className="proposal-title">{proposalInfo?.title}</div>
                    <div className="proposal-state-wrapper detailed-version">
                        <div className="proposal-status">Active</div>
                        <div className="karma-wrapper">
                            <div>
                                at epoch {proposalInfo?.currEpoch?.toString()}
                                ...
                            </div>
                            <div>
                                {proposalInfo?.publicSignals![1].toString()}{' '}
                                karma
                            </div>
                        </div>
                    </div>
                    <div className="detailed-proposal-description">
                        {proposalInfo?.description}
                    </div>
                    <section className="voting-section">
                        <div className="voting-section-title">Vote</div>
                        <div className="voting-option-list">
                            <button className="vote-selection vote-yes">
                                Yes
                            </button>
                            <button className="vote-selection vote-no">
                                No
                            </button>
                            <button className="vote-selection vote-abstain">
                                Abstain
                            </button>
                            <button className='vote-submit-button'>Submit Your Vote</button>
                        </div>
                    </section>
                </div>
                <div>
                    <div className="info-container">
                        <Timer />

                        <hr />

                        <div className="info-item">
                            <h3>Latest Data</h3>
                            <Tooltip text="This is all the data the user has received. The user cannot prove data from the current epoch." />
                        </div>
                        {userContext.data.slice(0, 1).map((data, i) => {
                            if (i < userContext.sumFieldCount) {
                                return (
                                    <div key={i} className="info-item">
                                        <div>Latest Reputation</div>
                                        <div className="stat">
                                            {(data || 0).toString()}
                                        </div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={i} className="info-item">
                                        <div>Provable Reputation</div>
                                        <div className="stat">
                                            {(
                                                data % BigInt(2 ** 206) || 0
                                            ).toString()}
                                        </div>
                                    </div>
                                )
                            }
                        })}

                        <br />

                        <div className="info-item">
                            <h3>Provable Data</h3>
                            <Tooltip text="This is the data the user has received up until their last transitioned epoch. This data can be proven in ZK." />
                        </div>
                        {userContext.provableData.slice(0, 1).map((data, i) => {
                            if (i < userContext.sumFieldCount) {
                                return (
                                    <div key={i} className="info-item">
                                        <div>Provable Reputation</div>
                                        <div className="stat">
                                            {(data || 0).toString()}
                                        </div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={i} className="info-item">
                                        <div>Provable Reputation</div>
                                        <div className="stat">
                                            {(
                                                data % BigInt(2 ** 206) || 0
                                            ).toString()}
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
