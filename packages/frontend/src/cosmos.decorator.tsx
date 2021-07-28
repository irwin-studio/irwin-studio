import React from 'react';
import {AuthContext} from './services/Auth';
import {FirebaseContext} from './services/Firebase';
import BaseStyle from './styles';

const Wrap: React.FC = ({children}) => {
    return (
        <FirebaseContext>
            <AuthContext>
                <BaseStyle />
                {children}
            </AuthContext>
        </FirebaseContext>
    );
};

export default Wrap;
