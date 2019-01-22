import React from 'react';
import { UserSearch } from "../components/UserSearch"

import './Home.scss';

export default () => (
    <div className="App">
        <header className="App-header jumbotron">
            <div className="container">
                <h1 className="text-light">Github Portfolio</h1>
            </div>
        </header>
        <UserSearch />
    </div>
);
