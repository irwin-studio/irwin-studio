/**
 * Returns a sub-matrix of a given matrix based on starting point and width/height values.
 * @param matrix The matrix to extract the sub matrix from
 * @param originX The column where the submatrix will start
 * @param originY The row where the submatrix will start
 * @param width The width of the submatrix
 * @param height The height of the submatrix
 * @returns A matrix that is a subset of values of the given base matrix
 */
export function getSubMatrix<T = any>(
    matrix: T[][],
    originX: number,
    originY: number,
    width: number,
    height?: number,
): T[][] {
    if (height === undefined) height = width;

    // calculate end index (this will also handle negative starting positions)
    const destinationX = originX + width;
    const destinationY = originY + height;

    // return empty array if no rows to clip
    if (destinationY < 0) return [];

    // bring starting points to earliest possible index
    originX = originX < 0 ? 0 : originX;
    originY = originY < 0 ? 0 : originY;

    const rows = matrix.slice(originY, destinationY);
    if (destinationX < 0) return rows.map(() => []);
    return rows.map(row => row.slice(originX, destinationX));
}

/**
 * Flattens a matrix into an array of arrays containing the value, the column index and the row index
 * @param matrix The matrix to be flattened
 * @returns An array of arrays containing [cell value, column index, row index]
 */
 export function flattenMatrix<T = any>(matrix: T[][]) {
    const flatmap: [T, number, number][] = [];

    matrix.forEach((row, yIndex) => {
        row.forEach((value, xIndex) => {
            flatmap.push([value, xIndex, yIndex]);
        });
    });

    return flatmap;
}
