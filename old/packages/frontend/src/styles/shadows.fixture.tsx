import React from 'react';
import styled from 'styled-components';

const shadows = ['sm', 'md', 'lg'];

const Fixture: React.FC<void> = () => {
    return (
        <Group>
            <h1>Box Shadows</h1>
            {shadows.map((size, key) => (
                <Group key={key}>
                    <Header>box-shadow: var(--shadow-{size});</Header>
                    <Box style={{boxShadow: `var(--shadow-${size})`}} />
                </Group>
            ))}
        </Group>
    );
};

export default Fixture;

const Group = styled.div`
    margin: 0 2rem;
    margin-top: 2rem;

    display: flex;
    flex-direction: column;

    * {
        margin-bottom: 1.5rem;
    }
`;

const Header = styled.p`
    font-size: 1.6rem;
    margin-bottom: 1rem;
`;

const Box = styled.div`
    height: 16rem;
    width: 16rem;
`;
