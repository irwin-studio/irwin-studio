import React from 'react';
import GoogleIcon from 'mdi-react/GoogleIcon';
import {LOGIN_PROVIDER} from '../../services/Auth';

interface Provider {
    provider: LOGIN_PROVIDER;
    icon: React.ReactElement;
    title: string;
}

const ICON_SIZE = 30;
export const providers: Record<LOGIN_PROVIDER, Provider> = {
    GOOGLE: {
        provider: 'GOOGLE',
        icon: <GoogleIcon size={ICON_SIZE} color="rgb(var(--secondary))" />,
        title: 'Google',
    },
};
