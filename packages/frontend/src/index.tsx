import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './pages/Header'
import Start from './pages/Start'
import Dashboard from './pages/Dashboard'
import Forum from './pages/Forum'
import Governance from './pages/Governance'
import './index.css'
import PostCardDetailed from './components/PostCardDetailed'
import { ProposalDetailed } from './pages/ProposalDetailed'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Header />}>
                    <Route index element={<Start />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="forum" element={<Forum />} />
                    <Route path="governance" element={<Governance />} />
                    <Route
                        path="governance/:proposalId"
                        element={<ProposalDetailed />}
                    />
                    <Route
                        path="forum/post/:postId"
                        element={<PostCardDetailed />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

const rootElement = document.getElementById('root')
if (rootElement) {
    const root = createRoot(rootElement)
    root.render(<App />)
}
