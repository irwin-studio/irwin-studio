import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import TreeGraph from '../TreeGraph';
import {ComingSoon} from '../Splash';
import Login from '../Login';
import Renderer from '../Renderer';

const App: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={ComingSoon} />
                <Route path="/graph/tree" exact component={TreeGraph} />
                <Route path="/login" exact component={Login} />
                <Route path="/experimental/webgpu/:rendererName" exact component={Renderer} />
                <Route>
                    <Redirect to="/" />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
