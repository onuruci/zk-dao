import React, { useState, useEffect, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import './Governance.css'
import Proposals from '../components/Proposals'
import { ethers } from 'ethers'
import { APP_ADDRESS, ETH_PROVIDER_URL } from './constants'
import UNIREP_APP from '@unirep-app/contracts/artifacts/contracts/UnirepApp.sol/ZKComm.json'
import User from '../contexts/User'
import { I_PROPOSAL } from './types'
import Button from '../components/Button'
import { ProposalCard } from '../components/ProposalCard'
import Tooltip from '../components/Tooltip'
import Timer from '../components/Timer'
import { Link } from 'react-router-dom'

const APP_CONTRACT = new ethers.Contract(
    APP_ADDRESS,
    UNIREP_APP.abi,
    new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL)
)

export default observer(() => {
    const userContext = useContext(User)

    const [newProposal, setNewProposal] = useState<I_PROPOSAL>({
        title: '',
        description: '',
        minRepToVote: 0,
        provedReputation: 0,
    })

    async function updateProposals() {
        const proposals: I_PROPOSAL[] = await APP_CONTRACT.getAllProposals()
        console.log(proposals)
        setProposals(proposals)
    }

    const handleCreateProposal = async () => {
        const proof = await userContext.newProposal(0, newProposal)
        updateProposals()
    }

    const [proposals, setProposals] = useState<I_PROPOSAL[]>([])

    useEffect(() => {
        // Fetch your posts from your backend or blockchain here
        // For this example, I'm using a hardcoded list
        updateProposals()
    }, [])

    return (
        <div className="governance-wrapper">
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
            <div>
                <Button
                    styles={{
                        padding: '12px 0',
                        'font-size': '16px',
                        width: '100%',
                        'background-color': 'white',
                        border: '1px solid black',
                        'border-radius': '12px',
                    }}
                    onClick={() => userContext.spendTokens(0, 10000000000, "0xD44F27657fc2F9A967F485a64B5cf13BFcb6Bd35")}
                    loadingText="Updating epoch..."
                >
                    Send Tokens
                </Button>
            </div>

            <div className="governance-info-wrapper">
                <form className="create-post">
                    <div>
                        <input
                            className="create-post-title"
                            type="text"
                            placeholder="Title..."
                            id="title"
                            name="title"
                            onChange={(e) =>
                                setNewProposal({
                                    ...newProposal,
                                    title: e.target.value,
                                })
                            }
                        />
                        <div className="number-inputs">
                            <input
                                className="reputation-count"
                                type="number"
                                placeholder="With Karma..."
                                id="reputation"
                                name="reputation"
                                onChange={(e) =>
                                    setNewProposal({
                                        ...newProposal,
                                        provedReputation: parseInt(
                                            e.target.value
                                        ),
                                    })
                                }
                            />
                            <input
                                className="reputation-count"
                                type="number"
                                placeholder="Select Min Rep to Vote"
                                id="minReptoVote"
                                name="minReptoVote"
                                onChange={(e) =>
                                    setNewProposal({
                                        ...newProposal,
                                        minRepToVote: parseInt(e.target.value),
                                    })
                                }
                            />
                        </div>
                    </div>
                    <textarea
                        className="create-post-context"
                        placeholder="What do you think?"
                        id="description"
                        name="description"
                        onChange={(e) =>
                            setNewProposal({
                                ...newProposal,
                                description: e.target.value,
                            })
                        }
                    />

                    <Button
                        styles={{ 'margin-left': 'auto' }}
                        onClick={handleCreateProposal}
                        loadingText="Posting..."
                    >
                        Post
                    </Button>
                </form>
                <div className="info-container">
                    <Timer />

                    <hr />

                    <div className="info-item">
                        <h3>Latest Data</h3>
                        <Tooltip text="This is all the data the user has received. The user cannot prove data from the current epoch." />
                    </div>
                    {userContext.data.slice(0, 2).map((data, i) => {
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
                    {userContext.provableData.slice(0, 2).map((data, i) => {
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
            <section className="proposal-section">
                <h2>Proposals</h2>
                <div className="proposal-list">
                    {proposals
                        .slice()
                        .reverse()
                        .map((proposal, index) => (
                            <Link
                                to={`proposal/${proposals.length - index - 1}`}
                            >
                                <ProposalCard
                                    key={index}
                                    proposalInfo={proposal}
                                />
                            </Link>
                        ))}
                </div>
            </section>
        </div>
    )
})
