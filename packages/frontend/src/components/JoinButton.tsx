import React from "react";
import { observer } from 'mobx-react-lite'
import ok from "../img/OK.svg"
import "./joinbutton.css"

type props = {
    text: string
  };

  const JoinButton: React.FC<props> = observer(({text}) => {


    return(
        <div className="join-custom-button">
            {text}
            <img src={ok}/>
        </div>
    )
})

export default JoinButton;