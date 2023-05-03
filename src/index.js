import React from 'react';
import ReactDOM from 'react-dom/client';
// import {NavLink} from 'react-router-dom';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {AnimatePresence} from 'framer-motion/dist/framer-motion'
import {CookiesProvider } from 'react-cookie';

import './styles/index.css';
// import Home from "./pages/Home";
import Sig from "./pages/Sig";
// import About from "./pages/About";

// function Header() 
// {
//     return (
//             <div className = "navbar vertical-center">
//                 <NavLink className = "navitem" to="/">Home</NavLink>
//                 <NavLink className = "navitem" to="/Sig">SIG</NavLink>
//                 <NavLink className = "navitem" to="/About">About</NavLink>
//             </div>
// );
// }

function App () 
{
    return (
        <CookiesProvider>
            <AnimatePresence>
                {/* <Router> */}
                    <div className = "App">
                        {/* <Header /> */}
                        {/* <Routes> */}
                            {/* <Route exact path = "/" element = {<Sig/>} /> */}
                            {/* <Route path = "/About" element = {<About/>} />
                            <Route path = "/Sig" element = {<Sig/>} /> */}
                        {/* </Routes> */}
                        <Sig/>
                    </div>
                {/* </Router> */}
            </AnimatePresence>
        </CookiesProvider>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)