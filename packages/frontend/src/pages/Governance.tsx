import React from "react";
import { observer } from 'mobx-react-lite'
import './Governance.css'
import Proposals from "../components/Proposals";

export default observer(() => {
    return(
        <div className="governance-wrapper">
            <Proposals />
        </div>
    )
 })