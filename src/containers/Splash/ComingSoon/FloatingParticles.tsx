import React from 'react';
import Particles from 'react-particles-js';
import styled from 'styled-components';

interface Props {
    style?: React.CSSProperties;
    height?: string;
    width?: string;
}

const FloatingParticles: React.FC<Props> = ({style}) => (
    <Blurred>
        <Particles
            canvasClassName="blurred"
            style={style || {}}
            params={{
                autoPlay: true,
                fpsLimit: 60,
                particles: {
                    number: {
                        value: 90,
                    },
                    move: {
                        speed: 0.9,
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
                        value: '#373A43',
                    },
                    life: {
                        duration: {
                            value: 25,
                        }
                    }
                },
            }}
        />
    </Blurred>
)

const Blurred = styled.div`
    .blurred {
        filter: blur(2px);
    }
`;

export default FloatingParticles;
