import React, {useState} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

interface Props {
    icon?: string;
    href?: string;
    className?: string;
}

const Link: React.FC<Props> = ({icon, href, className}) => {
    const [hover, setHover] = useState(false);

    return (
        <Wrap className={className || ''}>
            {!!icon && (
                <>
                    <a
                        href={href}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        <i className={icon} />
                    </a>
                    <Underline className={classnames({hover})} />
                </>
            )}
        </Wrap>
    );
};

const Underline = styled.span`
    line-height: 1;
    background-color: var(--secondary);
    bottom: 0;
    position: absolute;
    display: block;

    opacity: 0;
    transform: translateY(150%);
    transition: opacity ease-in 0.2s, transform ease-in 0.15s;

    transform: translateY(50%);
    height: 0.15rem;
    width: 100%;
    border-radius: 99999px;

    &.hover {
        opacity: 1;
        transform: translateY(50%);
    }
`;

const Wrap = styled.div`
    position: relative;
    width: 10rem;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: end;

    a {
        padding: 20px 15px;

        i {
            font-size: 1.5rem;
        }
    }
`;

export default Link;
