import React from "react";
import { observer } from 'mobx-react-lite'
import { useNavigate } from "react-router-dom";
import './proposals.css'

type ProposalProps = { 
    key: number;
    proposalId: number;
    title: string;
    description: string;
  };

const Proposals: React.FC<ProposalProps> = observer(({ key, proposalId, title, description }) => {

    const navigate = useNavigate()
    
    const handleNavigation = () => {
        navigate(`governance/${proposalId}`, {state:{proposalId,title,description}})
    }

    return(
        <div onClick={handleNavigation} className="proposal-container">
            {title} <br/>
            {description}
        </div>
    )
 })

 export default Proposals;