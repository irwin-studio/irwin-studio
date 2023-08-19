import React from 'react';
import styled from 'styled-components';
import {Parameter, Type} from '../../../helpers/parameters';

interface Props {
    name: string;
    control: Parameter[Type];
    onUpdate: (value: Parameter[Type]['value']) => void;
}

const ParameterController = function Parameter({name, control, onUpdate}: Props) {
    return (
        <Wrap>
            <h4>{name}</h4>:{' '}
            <input
                type="number"
                value={control.value.toString()}
                step={control.step}
                min={control.min}
                max={control.max}
                onChange={event => onUpdate(event.currentTarget.valueAsNumber)}
            />
        </Wrap>
    );
};

export default ParameterController;

const Wrap = styled.div`
    display: flex;
    margin: 0.5rem;
    flex-direction: row;
    align-items: center;

    h4 {
        margin: 0;
        padding: 0;
        display: inline;
    }

    input {
        margin-left: 0.25rem;
        width: 100%;
    }
`;
