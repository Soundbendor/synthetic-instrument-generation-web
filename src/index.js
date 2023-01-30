import React from 'react';
import ReactDOM from 'react-dom/client';
import {NavLink} from 'react-router-dom';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {AnimatePresence} from 'framer-motion/dist/framer-motion'

import './index.css';
import Home from "./Home";
import Sig from "./Sig";
import About from "./About";

function Header() 
{
    return (
            <div className = "navbar vertical-center">
                <NavLink className = "navitem" to="/">Home</NavLink>
                <NavLink className = "navitem" to="/Sig">SIG</NavLink>
                <NavLink className = "navitem" to="/About">About</NavLink>
            </div>
);
}

function App () 
{
    return (
        <AnimatePresence>
            <Router>
                <div className = "App">
                    <Header />
                    <Routes>
                        <Route exact path = "/" element = {<Home/>} />
                        <Route path = "/About" element = {<About/>} />
                        <Route path = "/Sig" element = {<Sig/>} />
                    </Routes>
                </div>
            </Router>
        </AnimatePresence>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)