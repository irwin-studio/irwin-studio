import React from 'react';
import styled from 'styled-components';

interface ProviderProps {
    icon: React.ReactElement;
    title: string;
    login: () => void;
}

const Provider: React.FC<ProviderProps> = ({login, icon, title}) => {
    return (
        <Wrap onClick={login}>
            <IconWrap>{icon}</IconWrap>
            <p>Sign in via {title}</p>
        </Wrap>
    );
};

export default Provider;

const Wrap = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: border-bottom ease-in-out 0.2s;
    border-bottom: 1px solid rgba(var(--secondary), 0.1);

    --spacing: 0.5rem;
    padding: var(--spacing);
    > *:not(last-child) {
        margin-right: var(--spacing);
    }

    &:hover {
        border-bottom: 1px solid rgba(var(--secondary), 0.4);
    }

    p {
        font-weight: 500;
        margin: auto;
        text-align: center;
    }
`;

const IconWrap = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;
