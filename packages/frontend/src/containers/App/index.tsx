import React from 'react';
import {Redirect, Switch} from 'react-router';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import TreeGraph from '../TreeGraph';
import {ComingSoon} from '../Splash';

const App: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={ComingSoon} />
                <Route path="/graph/tree" exact component={TreeGraph} />
                <Route>
                    <Redirect to="/" />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
