import React, { useCallback, useEffect, useRef, useState } from 'react';

type Color = [number, number, number, number];
type RenderMethod<T> = (cellData: T, row: number, column: number) => (Color | undefined);

interface RendererAPI<T> {
    setCellRenderMethod: (callback: RenderMethod<T>) => void;
    render: (matrix: T[][]) => void;
    canvas: JSX.Element;
    context: CanvasRenderingContext2D;
}

export interface MatrixRendererConfiguration {
    height: number;
    width: number;
}

const useMatrixRenderer = function <TCell>(
    config: MatrixRendererConfiguration
): RendererAPI<TCell> {
    let renderCell: RenderMethod<TCell> = () => undefined;
    let context: CanvasRenderingContext2D = undefined;
    let matrix: TCell[][] = [];
    let cellSize = 0;

    const canvasRef = useRef<HTMLCanvasElement>();
    const canvas = <canvas ref={canvasRef} height={config.height} width={config.width} ></canvas>;

    const render = (matrix: TCell[][]) => {
        const xCellSize = config.width / (matrix[0]?.length || 1);
        const yCellSize = config.height / matrix.length;
        cellSize = xCellSize < yCellSize ? xCellSize : yCellSize;

        if (!renderCell) return console.log('no renderCell method');

        const size = Math.ceil(cellSize);
        matrix.forEach((row, yIndex) => {
            row.forEach((cellData, xIndex) => {
                const color = renderCell(cellData, yIndex, xIndex);
                const imageData = context.createImageData(size, size);

                imageData.data.set(imageData.data.map((_, index) => color[index % 4]));
                context.putImageData(imageData, Math.floor(yIndex * cellSize), Math.floor(xIndex * cellSize));
            })
        });
    };

    useEffect(() => {
        if (canvasRef.current)
            context = canvasRef.current.getContext('2d');
    }, [canvasRef.current]);

    return {
        setCellRenderMethod: (callback: RenderMethod<TCell>) => (renderCell = callback),
        render,
        canvas,
        context,
    }
}

export default useMatrixRenderer;
