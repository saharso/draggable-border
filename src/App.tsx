import React from 'react';
import './App.scss';
import AppContext from './models/context';
import Demo from './components/Demo/Demo';

function App() {
    

    return (
        <AppContext.Provider value={{}}>
            <Demo/>
        </AppContext.Provider>
    );
}

export default App;
