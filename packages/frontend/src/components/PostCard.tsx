import React from "react";
import {useNavigate} from "react-router-dom";
import avatar from "../img/ObtLogo.png";
import clock from "../img/clockIcon.png"

import { observer } from 'mobx-react-lite'
import './PostCard.css'

type PostCardProps = {
    key: number;
    postId: number;
    title: string;
    description: string;
  };

const PostCard: React.FC<PostCardProps> = observer(({ key, postId, title, description }) => {

    console.log(postId)

    const navigate = useNavigate()
    
    const handleNavigation = () => {
        navigate(`post/${postId}`, {state:{postId,title,description}})
    }

    return(
        <div className="forum-container">
            <div className="avatar-title-wrapper">
                <div className="avatar">
                    <img className="avatar__image" src={avatar} />
                </div>
                    <h3 onClick={handleNavigation}>{title}</h3>
                    <div className="post-time-positioner">
                        <img className="post-time" src={clock} />
                        <p className="time-posted">18:50</p>
                    </div>
                </div>
                    <div className="overview">{description}</div>
            
        </div>
    )
})

export default PostCard;