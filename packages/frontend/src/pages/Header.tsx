import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import './header.css'

export default () => {
    const navigate = useNavigate()

    const goToForum = () => {
        navigate('/forum')
    }

    return (
        <>
            <div className="header">
                <img src={require('../../public/logo.svg')} alt="UniRep logo" />
                <div className="links">
                    <div className='navigateButtons' onClick={goToForum}>
                        Forum
                    </div>
                    <div className='navigateButtons' onClick={() => {
                        navigate('/governance')
                    }}>
                        Governance
                    </div>
                    <a
                        href="https://discord.com/invite/VzMMDJmYc5"
                        target="blank"
                    >
                        Discord
                    </a>
                </div>
            </div>

            <Outlet />
        </>
    )
}
