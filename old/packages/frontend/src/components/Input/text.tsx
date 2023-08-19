import React, {useState} from 'react';
import styled, {CSSProperties} from 'styled-components';
import classNames from 'classnames';
import OpenedEyeIcon from 'mdi-react/EyeOutlineIcon';
import ClosedEyeIcon from 'mdi-react/EyeOffOutlineIcon';

export type Visibility = 'hidden' | 'visible' | 'toggleable';
export type Size = 'small' | 'medium' | 'large' | number;
type PopupType = 'info' | 'warn' | 'error';

interface Props {
    onChange?: (change: string) => void;
    size?: Size;
    value?: string;
    popupType?: PopupType;
    popupMessage?: string;
    visibility?: Visibility;
    placeholder?: string;
}

const DEFAULTS: Props = {
    size: 'medium',
    popupType: 'info',
    visibility: 'visible',
};

const Text: React.FC<Props> = props => {
    props = {...DEFAULTS, ...props};
    const {onChange, size, value, popupType, popupMessage, visibility, placeholder}: Props = props;

    const [charactersVisible, setCharactersVisible] = useState<boolean>(visibility === 'visible');

    const classes: (string | Record<string, any>)[] = [];
    if (popupType) classes.push(popupType);
    if (!!popupMessage) classes.push('popup');

    const style: CSSProperties = {};
    if (typeof size === 'number') {
        (style as any)['--scale'] = size;
    } else {
        if (size) classes.push(size);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target.value);
    };

    return (
        <Wrap>
            <InputWrap>
                <Input
                    type={charactersVisible ? 'text' : 'password'}
                    value={value}
                    style={style}
                    onChange={handleChange}
                    className={classNames(...classes)}
                    placeholder={placeholder}
                />
                {visibility === 'toggleable' && (
                    <>
                        {charactersVisible ? (
                            <OpenedEyeIcon
                                style={style}
                                className={classNames(...classes)}
                                onClick={() => setCharactersVisible(false)}
                            />
                        ) : (
                            <ClosedEyeIcon
                                style={style}
                                className={classNames(...classes)}
                                onClick={() => setCharactersVisible(true)}
                            />
                        )}
                    </>
                )}
            </InputWrap>
            <Hint style={style} className={classNames(...classes)}>
                {popupMessage}
            </Hint>
        </Wrap>
    );
};

const colors = `
    --popupColor: rgb(var(--info));

    &.warn {
        --popupColor: rgb(var(--warning));
    }

    &.error {
        --popupColor: rgb(var(--error));
    }
`;

const sizing = `
    &.small {
        --scale: 1;
    }

    &.medium {
        --scale: 1.25;
    }

    &.large {
        --scale: 1.5;
    }

    padding: calc(0.625rem * var(--scale));
`;

const Wrap = styled.div`
    max-width: min-content;
    overflow: hidden;
`;

const InputWrap = styled.div`
    position: relative;
    width: fit-content;
    align-items: middle;

    > svg {
        ${sizing}
        padding-top: 0;
        padding-bottom: 0;

        opacity: 0.6;
        &:hover {
            opacity: 0.9;
        }

        right: 0;
        top: 50%;
        position: absolute;
        transform: translateY(-50%) scale(calc(var(--scale) * 0.8));

        z-index: 2;
        cursor: pointer;
    }
`;

const Input = styled.input`
    ${sizing}
    ${colors}

    height: calc(var(--scale) * 1rem);
    width: calc(var(--scale) * 16rem);

    z-index: 1;
    position: relative;
    transition: border 1s ease-out, border-radius 0.2s ease-in-out;

    &.popup {
        border: 1px solid var(--popupColor);
        border-bottom-left-radius: 0px;
    }

    font-size: calc(1rem * var(--scale));
    &[type='password'] {
        font: small-caption;
        font-size: calc(1rem * var(--scale));
        letter-spacing: calc(3px * var(--scale));
    }
`;

const Hint = styled.p`
    ${sizing}
    ${colors}

    margin: 0;
    border-radius: 0px 0px 0.2rem 0.2rem;

    bottom: 0;
    background: var(--popupColor);

    transition: transform 0.2s ease-in-out;
    transform: translateY(-100%);
    &.popup {
        transform: translateY(0%);
    }
`;

export {Text};
