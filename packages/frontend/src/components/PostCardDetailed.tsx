import React, {useState} from "react";
import avatar from "../img/ObtLogo.png";
import postButton from "../img/svg.svg"
import PostCard from "../components/PostCard";
import { useLocation } from "react-router-dom";

import { observer } from 'mobx-react-lite'
import './postcarddetailed.css'

export default observer(() => {

    const location = useLocation()
    
    return(
        <div>
            Hi!
        </div>
    )
})
