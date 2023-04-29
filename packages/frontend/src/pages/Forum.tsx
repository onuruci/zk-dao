import React, { useState, useEffect, useContext } from 'react'
import avatar from '../img/ObtLogo.png'
import postButton from '../img/svg.svg'
import PostCard from '../components/PostCard'
import User from '../contexts/User'
import { I_POST } from './types'
import { ethers } from 'ethers'
import { observer } from 'mobx-react-lite'
import { APP_ADDRESS, ETH_PROVIDER_URL } from './constants'
import UNIREP_APP from '@unirep-app/contracts/artifacts/contracts/UnirepApp.sol/UnirepApp.json'

import './forum.css'
import Button from '../components/Button'

const APP_CONTRACT = new ethers.Contract(
    APP_ADDRESS,
    UNIREP_APP.abi,
    new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL)
)

export default observer(() => {
    const userContext = React.useContext(User)

    const [post, setPost] = useState<I_POST>({
        description: '',
        title: '',
        provedReputation: 10,
    })

    const [posts, setPosts] = useState<I_POST[]>([])

    useEffect(() => {
        updatePosts()
    }, [])

    const updatePosts = async () => {
        const posts: [] = await APP_CONTRACT.getAllPosts()

        console.log(posts)
        setPosts([...posts])
    }

    async function handleCreatePost() {
        try {
            const proof = await userContext.newPost(0, post)
            updatePosts()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="forum-wrapper">
            <div className="forum-upper-side">
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
                        onClick={() => userContext.stateTransition()}
                        loadingText="Updating epoch..."
                    >
                        Update Epoch
                    </Button>
                    <form className="create-post">
                        <input
                            className="create-post-title"
                            type="text"
                            placeholder="Title..."
                            id="title"
                            name="title"
                            onChange={(e) =>
                                setPost({ ...post, title: e.target.value })
                            }
                        />
                        <textarea
                            className="create-post-context"
                            placeholder="What do you think?"
                            id="description"
                            name="description"
                            onChange={(e) =>
                                setPost({
                                    ...post,
                                    description: e.target.value,
                                })
                            }
                        />

                        <Button
                            styles={{ 'margin-left': 'auto' }}
                            onClick={handleCreatePost}
                            loadingText="Posting..."
                        >
                            Post
                        </Button>
                    </form>
                </div>
                <div className="details-wrapper">hello world</div>
            </div>
            <div className="post-list">
                {posts
                    .slice(0)
                    .reverse()
                    .map((p, i) => (
                        <PostCard
                            postInfo={p}
                            currEpoch={userContext.userState?.sync.calcCurrentEpoch()}
                            index={posts.length - i - 1}
                        />
                    ))}
            </div>
        </div>
    )
})
