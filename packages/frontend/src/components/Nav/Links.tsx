import React from 'react';
import styled from 'styled-components';
import Link from './Link';

interface Props {
    className?: string;
}

const LINKS = [
    {href: '/', icon: 'icon-at-symbol'},
    {href: '/', icon: 'icon-github'},
    {href: '/', icon: 'icon-linkedIn'},
];

const Links: React.FC<Props> = ({className}) => {
    return (
        <Wrap className={className}>
            <Link />

            {LINKS.map(({href, icon}, index) => (
                <Link key={index} href={href} icon={icon} />
            ))}

            <Link />
        </Wrap>
    );
};

const Wrap = styled.div`
    width: min-content;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`;

export default Links;
