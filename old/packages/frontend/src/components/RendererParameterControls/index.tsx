import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {IParameters, RendererParameterAPI} from '../../renderers';
import ParameterController from './Parameter';

interface Props<Parameters extends IParameters> {
    parameters: RendererParameterAPI<Parameters>;
}

const RendererParameterControls = function RendererParameterControls<
    Parameters extends IParameters
>({parameters}: Props<Parameters>) {
    (window as any).parameters = parameters;
    const [currentParameters, setCurrentParameters] = useState<Parameters>(parameters.current);

    useEffect(() => {
        const stopListening = parameters.onUpdated(newParameters => {
            setCurrentParameters(newParameters);
        });

        return () => stopListening();
    }, []);

    const renderParameters = (parameterDomain: keyof Parameters) => {
        return Object.entries(currentParameters[parameterDomain]).map(([name, control], index) => (
            <ParameterController
                key={index}
                name={name}
                control={control}
                onUpdate={value => {
                    console.log(`updating ${name} to ${value}`);
                    //@ts-ignore
                    parameters.update({[parameterDomain]: {[name]: {...control, value}}});
                }}
            />
        ));
    };

    return (
        <Wrap>
            <h1>Parameters</h1>
            <div>
                {renderParameters('compute')}
                {renderParameters('render')}
            </div>
        </Wrap>
    );
};

const Wrap = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    background-color: white;
    padding: 0.5rem;
    opacity: 0.2;
    transition: opacity 0.3s ease-in-out;
    &:hover {
        opacity: 1;
    }

    color: white;

    & > h1 {
        margin-left: 0.5rem;
        padding: 0;
    }

    & > div {
        width: max-content;
    }
`;

export default RendererParameterControls;
