import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import './header.css'

export default () => {
    const navigate = useNavigate()

    return (
        <>
            <div className="header">
                <Link to="forum">
                    <img
                        src={require('../../public/logo.svg')}
                        alt="UniRep logo"
                    />
                </Link>
                <div className="links">
                    <Link to="/forum" className="navigateButtons">
                        Forum
                    </Link>
                    <Link to="/governance" className="navigateButtons">
                        Governance
                    </Link>
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
