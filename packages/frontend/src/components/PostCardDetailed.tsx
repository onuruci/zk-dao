import React, { useState, useEffect, useContext } from "react";
import avatar from "../img/ObtLogo.png";
import postButton from "../img/svg.svg";
import { useLocation } from "react-router-dom";
import upArrow from "../img/upvoteIcon.png";
import downArrow from "../img/downvoteIcon.png";
import CommentCard from "./CommentCard";
import { observer } from 'mobx-react-lite';
import clock from "../img/clockIcon.png"
import './postcarddetailed.css';
import User from '../contexts/User'
import { I_POST } from '../pages/types'
import UNIREP_APP from '@unirep-app/contracts/artifacts/contracts/UnirepApp.sol/ZKComm.json'
import { APP_ADDRESS, ETH_PROVIDER_URL } from '../pages/constants'
import { ethers } from 'ethers'


export default observer(() => {

  const APP_CONTRACT = new ethers.Contract(
    APP_ADDRESS,
    UNIREP_APP.abi,
    new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL)
  )

  const { state } = useLocation()
  const { index } = state;

  const userContext = useContext(User)


  const [comment, setComment] = useState("")

  const handleChange = (event: any) => {
    setComment(event.target.value);
  }

  interface Comment {
    id: number;
    text: string;
  }

  const [comments, setComments] = useState<Array<Comment>>([]);

  useEffect(() => {
    const fetchCommentsForPost = async (index: number): Promise<Comment[]> => {
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

      return allComments[index] || [];
    };


    fetchCommentsForPost(index).then((fetchedComments) => {
      setComments(fetchedComments);
    });
  }, [index]);

  const [post, setPost] = useState<I_POST>()

  useEffect(() => {
    updatePosts()
  }, [])

  const updatePosts = async () => {
    const fetchedPosts = await APP_CONTRACT.getAllPosts();
    setPost(fetchedPosts[index]);
  }

  console.log(post)

  return (
    <div className="details-wrapper">
      <h3 className="title-positioner">{post?.title.toString()}</h3>
      <div className="details-container">
        <div className="info-positioner">
          <img className="avatar" src={avatar} alt="Avatar" />
          <div className="epochKey">{post?.epochKey?.toString()}</div>
        </div>
        <div className="description-container">
          {post?.description.toString()}
        </div>
        <div className="vote-counts">
          <div className="post-time-positioner">
            <img className="post-time" src={clock} />
            <p className="time-posted">18:50</p>
          </div>
          <img
            onClick={() => userContext.upVote(index)}
            className="arrow-down"
            src={upArrow}
            alt="Up arrow" />

          {post?.upVotes?.toString()}


          <img
            className="arrow-up"
            src={downArrow}
            alt="Down arrow" />
        </div>
      </div>
      <div className="comment-container">
        <form>
          <input className="create-post-context" type="text" placeholder="What do you think?" id="comment" name="comment" value={comment} onChange={handleChange} />
          <br />
          <div className="submit-button" onClick={() => { }}>
            <img className="submit-button-image" src={postButton} alt="Post button" />
          </div>
        </form>
      </div>
      {comments.map((comment) =>
        <CommentCard key={comment.id} text={comment.text} />)}
    </div>
  )
});
