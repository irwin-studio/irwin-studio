import React from 'react';
import Particles from 'react-particles-js';
import styled from 'styled-components';

interface Props {
    count: number;
    speed: number;
    color: string;
    blur: number;
    fpsLimit: number;
    style: React.CSSProperties;
    height?: string;
    width?: string;
}

const DEFAULTS: Props = {
    count: 90,
    speed: 0.9,
    color: '#373A43',
    blur: 2,
    fpsLimit: 30,
    style: {},
};

const Embers: React.FC<Partial<Props>> = props => {
    const {style, count, speed, color, fpsLimit, blur} = {...DEFAULTS, ...props};

    return (
        <Blurred blur={`${blur}px`}>
            <Particles
                canvasClassName="blurred"
                style={style}
                params={{
                    autoPlay: true,
                    fpsLimit: fpsLimit,
                    particles: {
                        number: {
                            value: count,
                        },
                        move: {
                            speed: speed,
                        },
                        links: {
                            enable: false,
                        },
                        size: {
                            random: {
                                enable: true,
                                minimumValue: 5,
                            },
                        },
                        color: {
                            value: color,
                        },
                        life: {
                            duration: {
                                value: 25,
                            },
                        },
                    },
                }}
            />
        </Blurred>
    );
};

const Blurred = styled.div<{blur: string}>`
    .blurred {
        filter: blur(${props => props.blur});
    }
`;

export default Embers;
