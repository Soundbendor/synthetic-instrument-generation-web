import React from 'react';
import ReactDOM from 'react-dom/client';
import {CookiesProvider } from 'react-cookie';

import './styles/index.css';
import Sig from "./pages/Sig";


function App () 
{
    return (
        <CookiesProvider>
                    <div className = "App">
                        <Sig/>
                    </div>
        </CookiesProvider>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)