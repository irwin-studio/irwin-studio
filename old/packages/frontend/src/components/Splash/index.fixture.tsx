import React from 'react';
import Splash from '.';
import Embers from '../Embers';

export default {
    default: (
        <Splash>
            <p>I&apos;m a &lt;p&gt; tag</p>
            <h4>
                Fill this component with anything
                <br />
                and it will be automatically centered.
            </h4>
        </Splash>
    ),
    'with background': (
        <Splash background={<Embers />}>
            <p>I&apos;m a &lt;p&gt; tag</p>
            <h4>
                Fill this component with anything
                <br />
                and it will be automatically centered.
            </h4>
        </Splash>
    ),
};
