import React from 'react'
import { observer } from 'mobx-react-lite'
import './dashboard.css'
import Button from '../components/Button'
import Tooltip from '../components/Tooltip'
import Post from '../components/Post'
import UNIREP_APP from '@unirep-app/contracts/artifacts/contracts/UnirepApp.sol/UnirepApp.json'
import { ethers } from 'ethers'
import { I_POST, I_COMMENT } from './types'

import User from '../contexts/User'

const APP_ADDRESS = '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0'
const ETH_PROVIDER_URL = 'http://127.0.0.1:8545/'

const appContract = new ethers.Contract(
    APP_ADDRESS,
    UNIREP_APP.abi,
    new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL)
)

type ReqInfo = {
    nonce: number
}

type ProofInfo = {
    publicSignals: string[]
    proof: string[]
    valid: boolean
}

export default observer(() => {
    const userContext = React.useContext(User)
    const [remainingTime, setRemainingTime] = React.useState<number | string>(0)
    const [reqData, setReqData] = React.useState<{
        [key: number]: number | string
    }>({})

    const [proveData, setProveData] = React.useState<{
        [key: number]: number | string
    }>({})
    const [repProof, setRepProof] = React.useState<ProofInfo>({
        publicSignals: [],
        proof: [],
        valid: false,
    })

    const [posts, setPosts] = React.useState<any>()

    const consoleLogPostCount = async () => {
        const postCount: any = await appContract.postCount()

        console.log(postCount)
    }

    const updateTimer = () => {
        if (!userContext.userState) {
            setRemainingTime('Loading...')
            return
        }
        const time = userContext.userState.sync.calcEpochRemainingTime()
        setRemainingTime(time)
    }

    const fieldType = (i: number) => {
        if (i < userContext.sumFieldCount) {
            return 'sum'
        } else return 'replace'
    }

    const getPosts = async () => {
        const posts: [] = await appContract.getAllPosts()
        let arr = posts.slice().reverse()
        setPosts([...arr])
    }

    React.useEffect(() => {
        setInterval(() => {
            updateTimer()
        }, 1000)
    }, [])

    React.useEffect(() => {
        getPosts()
    }, [])

    const [post, setPost] = React.useState<I_POST>({
        description: '',
        provedReputation: 0,
        title: '',
    })

    if (!userContext.userState) {
        return <div className="container">Loading...</div>
    }

    return (
        <div>
            <h1>Dashboard</h1>

            <div className="container">
                <div className="info-container">
                    <div className="info-item">
                        <h3>Epoch</h3>
                        <Tooltip
                            text={`An epoch is a unit of time, defined by the attester, with a state tree and epoch tree. User epoch keys are valid for 1 epoch before they change.`}
                        />
                    </div>
                    <div className="info-item">
                        <div>Current epoch #</div>
                        <div className="stat">
                            {userContext.userState?.sync.calcCurrentEpoch()}
                        </div>
                    </div>
                    <div className="info-item">
                        <div>Remaining time</div>
                        <div className="stat">{remainingTime}</div>
                    </div>
                    <div className="info-item">
                        <div>Latest transition epoch</div>
                        <div className="stat">
                            {userContext.latestTransitionedEpoch}
                        </div>
                    </div>

                    <hr />

                    <div className="info-item">
                        <h3>Latest Data</h3>
                        <Tooltip text="This is all the data the user has received. The user cannot prove data from the current epoch." />
                    </div>
                    {userContext.data.map((data, i) => {
                        if (i < userContext.sumFieldCount) {
                            return (
                                <div key={i} className="info-item">
                                    <div>Data {i}</div>
                                    <div className="stat">
                                        {(data || 0).toString()}
                                    </div>
                                </div>
                            )
                        } else {
                            return (
                                <div key={i} className="info-item">
                                    <div>Data {i}</div>
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
                    {userContext.provableData.map((data, i) => {
                        if (i < userContext.sumFieldCount) {
                            return (
                                <div key={i} className="info-item">
                                    <div>Data {i}</div>
                                    <div className="stat">
                                        {(data || 0).toString()}
                                    </div>
                                </div>
                            )
                        } else {
                            return (
                                <div key={i} className="info-item">
                                    <div>Data {i}</div>
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
                <div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <form className="post-form">
                            {Object.keys(post).map((key, index) => (
                                <div
                                    className={`post-field-container ${
                                        index === 1
                                            ? 'last-post-field'
                                            : 'not-last'
                                    }`}
                                >
                                    <label htmlFor={key}>{key}</label>
                                    <input
                                        onChange={(e) =>
                                            setPost({
                                                ...post,
                                                [key]: e.target.value,
                                            })
                                        }
                                        id={key}
                                        name={key}
                                        type="text"
                                    />
                                </div>
                            ))}

                            <Button
                                onClick={async () => {
                                    const proof = await userContext.newPost(
                                        0,
                                        post
                                    )
                                    getPosts()
                                }}
                            >
                                New Post
                            </Button>
                        </form>
                        <div className="action-container transition">
                            <div className="icon">
                                <h2>User State Transition</h2>
                                <Tooltip
                                    text={`The user state transition allows a user to insert a state tree leaf into the latest epoch. The user sums all the data they've received in the past and proves it in ZK.`}
                                />
                            </div>
                            <Button
                                onClick={() => userContext.stateTransition()}
                            >
                                Transition
                            </Button>
                        </div>

                        {repProof.proof.length ? (
                            <>
                                <div>
                                    Is proof valid?{' '}
                                    <span style={{ fontWeight: '600' }}>
                                        {' '}
                                        {repProof.proof.length === 0
                                            ? ''
                                            : repProof.valid.toString()}
                                    </span>
                                </div>
                                {repProof.proof.length}
                                Public Signals
                                {repProof.publicSignals.length}
                                <textarea
                                    readOnly
                                    value={JSON.stringify(repProof, null, 2)}
                                />
                            </>
                        ) : null}
                    </div>

                    <div className="posts-container">
                        {posts?.length > 0 &&
                            posts.map((p: any, i: number) => {
                                console.log(p)
                                return (
                                    <Post
                                        epochKey={p.epochKey}
                                        minRep={p.publicSignals[1].toString()}
                                        publicSignals={p.publicSignals}
                                        proof={p.proof}
                                        context={p.context}
                                        currEpoch={userContext.userState?.sync.calcCurrentEpoch()}
                                        postEpoch={p.postEpoch}
                                        index={i}
                                    />
                                )
                            })}
                    </div>
                </div>
            </div>
        </div>
    )
})
