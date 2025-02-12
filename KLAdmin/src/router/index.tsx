import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from '../components/pages';

const RouterApp: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Admin />} />
            </Routes>
        </Router>
    );
};

export default RouterApp;

