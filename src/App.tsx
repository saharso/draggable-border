import React from 'react';
import './App.scss';
import AppContext from './models/context';
import Panel from './components/Panel/Panel';

function App() {
    

    return (
        <AppContext.Provider value={{}}>
            <Panel/>
        </AppContext.Provider>
    );
}

export default App;
