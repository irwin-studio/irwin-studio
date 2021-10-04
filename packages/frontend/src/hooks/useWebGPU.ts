import {useEffect, useState} from 'react';

interface WebGPUAPI {
    device?: GPUDevice;
    adapter?: GPUAdapter;
}

const useWebGPU: () => WebGPUAPI = () => {
    const [adapter, setAdapter] = useState<GPUAdapter>();
    const [device, setDevice] = useState<GPUDevice>();

    useEffect(() => {
        navigator.gpu.requestAdapter().then(requestedAdapter => {
            if (!requestedAdapter) return;
            setAdapter(requestedAdapter);

            requestedAdapter.requestDevice().then(requestedDevice => {
                setDevice(requestedDevice);
            });
        });
    }, []);

    return {
        adapter,
        device,
    };
};

export {useWebGPU};
