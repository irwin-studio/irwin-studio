import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import GameOfLife from '../Applets/GameOfLife';
import {ComingSoon} from '../Splash';

const App: React.FC = () => {
    return <Router>
        <Switch>
            <Route exact path="/">
                <ComingSoon />
            </Route>
            <Route exact path="/game-of-life">
                <GameOfLife />
            </Route>
        </Switch>
    </Router>;
};

export default App;
