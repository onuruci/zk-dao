import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import avatar from '../img/ObtLogo.png'
import clock from '../img/clockIcon.png'

import { observer } from 'mobx-react-lite'
import './PostCard.css'
import likeIcon from '../utils/images/like.png'
import dislikeIcon from '../utils/images/dislike.png'
import { I_POST } from '../pages/types'
import User from '../contexts/User'
import upvoteIcon from '../utils/images/upvotesvg.svg'
import downvoteIcon from '../utils/images/downvoteThin.svg'

// description: string
// title: string
// epochKey: any
// postEpoch ?: any
// minRep: any
//     publicSignals: any
//     proof: any

type Props = {
    currEpoch?: number
    index?: number
    postInfo: I_POST
}

const PostCard: React.FC<Props> = observer(({ currEpoch, index, postInfo }) => {
    const navigate = useNavigate()

    const handleNavigation = () => {
        navigate(`post/${index}`, {
            state: { index },
        })
     }

    console.log('post info: ', postInfo)

    const userContext = useContext(User)

    const {
        proof,
        epochKey,
        description,
        title,
        publicSignals,
        upVotes,
        downVotes,
        postEpoch,
    } = postInfo

    console.log(upVotes?.toString())

    return (
        <div className="forum-container">
            <div className="avatar-title-wrapper">

                <img className="avatar__image" src={avatar} />
                <div className="post-title">
                    <div>{title}</div>
                    <div className="karma-wrapper">
                        <div>at epoch {postEpoch?.toString()}...</div>
                        <div>{publicSignals![1].toString()} karma</div>
                    </div>
                </div>
                <div className="post-time-positioner">
                    <div className="vote-info-container">
                        <img
                            onClick={() => userContext.upVote(index)}
                            className="vote-icon"
                            src={upvoteIcon}
                        />
                        <div>{upVotes?.toString()}</div>
                        <img className="vote-icon" src={downvoteIcon} />
                    </div>
                    <div>
                        <img className="post-time" src={clock} />
                        <p className="time-posted">18:50</p>
                    </div>
                </div>
            </div>
            <div className="overview">{description}</div>
        </div>
    )
})

export default PostCard
