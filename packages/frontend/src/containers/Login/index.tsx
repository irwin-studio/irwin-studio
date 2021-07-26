import React from 'react';
import styled from 'styled-components';
import Embers from '../../components/Embers';
import Splash from '../../components/Splash';
import {providers} from './providers';
import Provider from './provider';
import {useAuth} from '../../services/Auth';
import LoadingIcon from 'mdi-react/LoadingIcon';

const Background = (
    <Embers style={{position: 'absolute'}} color={'#186b18'} height="100vh" width="100vw" />
);

const Login: React.FC = () => {
    const auth = useAuth();

    return (
        <Splash background={Background}>
            <Container>
                {auth.user === undefined && (
                    <LoadingIcon className="spinning" color="rgb(var(--secondary))" size={50} />
                )}

                {auth.user === null && (
                    <LoginProviders>
                        {...Object.values(providers).map(({provider, title, icon}, index) => (
                            <Provider
                                key={index}
                                title={title}
                                icon={icon}
                                login={() => auth.login(provider)}
                            />
                        ))}
                    </LoginProviders>
                )}

                {!!auth.user && (
                    <SignedIn>
                        <h2>Welcome {auth.user.displayName}</h2>
                        <p onClick={() => auth.logout()}>signout</p>
                    </SignedIn>
                )}
            </Container>
        </Splash>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-color: rgba(var(--primary), 1);
    padding: 6rem 8rem;

    box-shadow: 0px 0px 8px 3px rgba(var(--secondary), 0.2);

    p {
        font-weight: 600;
    }
`;

const LoginProviders = styled.div`
    display: flex;
    flex-direction: column;

    > *:not(last-child) {
        margin-bottom: 1.125rem;
    }
`;

const SignedIn = styled.div`
    h2 {
        letter-spacing: 1px;
    }

    p {
        font-weight: 400;
        cursor: pointer;
    }

    > *:not(last-child) {
        margin-bottom: 1rem;
    }
`;

export default Login;
