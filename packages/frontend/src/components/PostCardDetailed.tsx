import React, { useState, useEffect } from "react";
import avatar from "../img/ObtLogo.png";
import postButton from "../img/svg.svg";
import { useLocation } from "react-router-dom";
import upArrow from "../img/upvoteIcon.png";
import downArrow from "../img/downvoteIcon.png";
import CommentCard from "./CommentCard";
import { observer } from 'mobx-react-lite';
import clock from "../img/clockIcon.png"
import './postcarddetailed.css';


export default observer(() => { 

    const { state } = useLocation()
    const { postId, title, description } = state;
    
    interface Comment {
        id: number;
        text: string;
      }
      
      const [comments, setComments] = useState<Array<Comment>>([]);
      
      useEffect(() => {
        const fetchCommentsForPost = async (postId: number): Promise<Comment[]> => {
            const allComments: { [key: number]: Comment[] } = {
              0: [
                { id: 0, text: "ODTÜ Blockchain" },
                { id: 1, text: "Zerology is the best!" },
              ],
              1: [
                { id: 0, text: "It is not about hiding, it is about freedom" },
                { id: 1, text: "Zerology is still the best!" },
              ],
            };
          
            return allComments[postId] || [];
          };
          
      
        fetchCommentsForPost(postId).then((fetchedComments) => {
          setComments(fetchedComments);
        });
      }, [postId]);
      

    const [comment, setComment] = useState("")

    const handleChange = (event: any) => {
        setComment(event.target.value);
    }

    return(
        <div className="details-wrapper">
            <h3 className="title-positioner">{title}</h3>
            <div className="details-container">
                <div className="info-positioner">
                    <img className="avatar" src={avatar} alt="Avatar" />
                    <div className="epochKey">0xe00E6b5BEe15a0995f3391179CdaA4c098D94586</div>
                </div>
                <div className="description-container">
                    {description}
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
            <div className="comment-container">
                <form>
                    <input className="create-post-context" type="text" placeholder="What do you think?" id="comment" name="comment" value={comment} onChange={handleChange} />
                    <br/>
                    <div className="submit-button" onClick={() => {}}>
                        <img className="submit-button-image" src={postButton} alt="Post button" />
                    </div>
                </form>
            </div>
            {comments.map((comment) => 
            <CommentCard key={comment.id} text={comment.text} />)}
        </div>
    )
});
