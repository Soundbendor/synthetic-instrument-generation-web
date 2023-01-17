import React from 'react';
import ReactDOM from 'react-dom/client';
import { Link } from 'react-router-dom';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './index.css';
import Home from "./Home";
import Sig from "./Sig";
import About from "./About";


function Header() 
{
    return (
        <nav>
            <div className = "navbar vertical-center">
                <Link className = "navitem" to="/">Home</Link>
                <Link className = "navitem" to="/Sig">Synthetic Instrument Generation</Link>
                <Link className = "navitem" to="/About">About</Link>
            </div>
        </nav>
);
}

function App () 
{
    return (
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
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)