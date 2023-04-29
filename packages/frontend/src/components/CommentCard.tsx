import React, {useState} from "react";
import avatar from "../img/ObtLogo.png";
import upArrow from "../img/upvoteIcon.png";
import downArrow from "../img/downvoteIcon.png";
import clock from "../img/clockIcon.png"

import { observer } from 'mobx-react-lite'
import './commentcard.css'

type Comment = {
    key: number;
    text: string
  };

  const CommentCard: React.FC<Comment> = observer(({ key, text}) => {

    return(
        <div className="comment-container">
            <div className="info-positioner">
                <img className="avatar" src={avatar} />
                <div className="epochKey">0xe00E6b5BEe15a0995f3391179CdaA4c098D94586</div>
            </div>
            <div className="text-container">
                {text}
            </div>
            <div className="vote-counts">
                    <div className="post-time-positioner">
                        <img className="post-time" src={clock} />
                        <p className="time-posted">18:50</p>
                    </div>
                    <img className="arrow-down" src={upArrow} alt="Up arrow" />
                    140
                    <img className="arrow-up" src={downArrow} alt="Down arrow" />
                </div>
            </div>
    )
})

export default CommentCard;