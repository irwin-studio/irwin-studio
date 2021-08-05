import React, {useState} from 'react';
import {useValue} from 'react-cosmos/fixture';
import styled from 'styled-components';
import {Text} from './index';

const TextFixture: React.FC = () => {
    const [size] = useValue('size', {defaultValue: 1.8});

    const [value, setValue] = useState<string>('Irwin Studio');
    const [popup, setPopup] = useState<string>('Popup Message');

    return (
        <Group>
            <Group>
                <h1>Sizing</h1>
                <PrimaryGroup>
                    <Group>
                        <Header>Small</Header>
                        <Text value={value} size="small" onChange={setValue} />
                    </Group>
                    <Group>
                        <Header>Medium</Header>
                        <Text value={value} size="medium" onChange={setValue} />
                    </Group>
                    <Group>
                        <Header>Large</Header>
                        <Text value={value} size="large" onChange={setValue} />
                    </Group>
                    <Group>
                        <Header>Number based size (see props panel)</Header>
                        <Text value={value} size={size} onChange={setValue} />
                    </Group>
                </PrimaryGroup>
            </Group>
            <Group>
                <h1>Popups / Hints</h1>
                <PrimaryGroup>
                    <Group>
                        <Header>Info Message</Header>
                        <Text
                            popupType="info"
                            popupMessage={popup}
                            value={popup}
                            size="medium"
                            onChange={setPopup}
                        />
                    </Group>
                    <Group>
                        <Header>Warning Message</Header>
                        <Text
                            popupType="warn"
                            popupMessage={popup}
                            value={popup}
                            size="medium"
                            onChange={setPopup}
                        />
                    </Group>
                    <Group>
                        <Header>Error Message</Header>
                        <Text
                            popupType="error"
                            popupMessage={popup}
                            value={popup}
                            size="medium"
                            onChange={setPopup}
                        />
                    </Group>
                </PrimaryGroup>
            </Group>
            <Group>
                <h1>Visibility</h1>
                <PrimaryGroup>
                    <Group>
                        <Header>Visible</Header>
                        <Text value={value} size="medium" onChange={setValue} />
                    </Group>
                    <Group>
                        <Header>Hidden</Header>
                        <Text visibility="hidden" value={value} size="medium" onChange={setValue} />
                    </Group>
                    <Group>
                        <Header>Toggleable</Header>
                        <Text
                            visibility="toggleable"
                            value={value}
                            size="medium"
                            onChange={setValue}
                        />
                    </Group>
                </PrimaryGroup>
            </Group>
        </Group>
    );
};

export default {
    Text: TextFixture,
};

const Group = styled.div`
    margin: 1rem;
    display: flex;
    flex-direction: column;

    h1 {
    }
`;

const PrimaryGroup = styled.div`
    display: flex;
`;

const Header = styled.p`
    font-size: 1.6rem;
    margin: 0;
    margin-bottom: 1rem;
`;
