import React, { useEffect } from 'react';
import { getSubMatrix, flattenMatrix } from '../../../helpers/matrix';
import useMatrixRenderer from '../../../hooks/matrixRenderer';

const GameOfLife: React.FC = () => {
    // single-direction distance to check for other cells
    const neighbourhood = 1;
    const perimeter = (neighbourhood * 2) + 1;

    const renderer = useMatrixRenderer<boolean>({ height: window.innerHeight, width: window.innerWidth });

    const matrix = Array.from({ length: 40 })
        .map(() => Array.from({ length: 40 })
            .map(() => Math.random() < 0.13)
        );

    useEffect(() => {
        matrix[1][1] = true;
        renderer.setCellRenderMethod(isAlive => [0,0,0, isAlive ? 255 : 0]);
        renderer.render(matrix);

        let timeout: NodeJS.Timeout;

        const render = () => {
            matrix.forEach((row, yIndex) => {
                row.forEach((isAlive, xIndex) => {
                    const surroundingCells = getSubMatrix(matrix, xIndex - 1, yIndex - 1, perimeter);
                    let count = flattenMatrix(surroundingCells)
                        .reduce((total, [isAlive]) => total += isAlive ? 1 : 0, 0);
    
                    if (isAlive) count -= 1; // exclude itself from the count

                    if (count < 2) isAlive = false
                    else if (isAlive && count > 3) isAlive = false
                    else if (!isAlive && count === 3) isAlive = true
                    matrix[yIndex][xIndex] = isAlive;
                });
            })

            renderer.render(matrix);
            timeout = setTimeout(() => render(), 100);
        }

        render();
        return () => clearInterval(timeout);
    }, []);

    return <>
        {renderer.canvas}
    </>
}

export default GameOfLife
