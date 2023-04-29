import React, { useState, useEffect } from "react";
import avatar from "../img/ObtLogo.png";
import postButton from "../img/svg.svg";
import { useLocation } from "react-router-dom";
import upArrow from "../img/upvoteIcon.png";
import downArrow from "../img/downvoteIcon.png";
import CommentCard from "./CommentCard";
import { observer } from 'mobx-react-lite';
import clock from "../img/clockIcon.png"
import './governencedetailed.css';

export default observer(() => { 

    const {state} = useLocation()

    return(
        <div>
            {state.title}<br/>
            {state.description}
        </div>
    )

})