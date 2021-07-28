import React from 'react';
import ReactDOM from 'react-dom';
import BaseStyle from './styles';
import App from './containers/App';
import {FirebaseContext} from './services/Firebase';
import {AuthContext} from './services/Auth';

ReactDOM.render(
    <FirebaseContext>
        <AuthContext>
            <BaseStyle />
            <App />
        </AuthContext>
    </FirebaseContext>,
    document.getElementById('root'),
);
