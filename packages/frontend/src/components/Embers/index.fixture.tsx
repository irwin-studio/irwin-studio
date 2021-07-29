import React from 'react';
import Embers from '.';
import {useValue} from 'react-cosmos/fixture';
import {DEFAULTS} from './index';

const Fixture: React.FC = () => {
    const [blur] = useValue('blur', {defaultValue: DEFAULTS.blur});
    const [color] = useValue('color', {defaultValue: DEFAULTS.color});
    const [count] = useValue('count', {defaultValue: DEFAULTS.count});
    const [fpsLimit] = useValue('fpsLimit', {defaultValue: DEFAULTS.fpsLimit});
    const [speed] = useValue('speed', {defaultValue: DEFAULTS.speed});
    const [lifetime] = useValue('lifetime', {defaultValue: DEFAULTS.lifetime});

    return (
        <Embers
            blur={blur}
            color={color}
            count={count}
            fpsLimit={fpsLimit}
            speed={speed}
            lifetime={lifetime}
        />
    );
};

export default Fixture;
