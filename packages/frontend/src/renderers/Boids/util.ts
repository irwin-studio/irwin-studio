export function createGroupedBuffer(
    groups: number,
    groupSize: number,
    populate: (index: number) => number[],
): Float32Array {
    if (groups < 0) {
        groups = 0;
    }

    const buffer = new Float32Array(groups * groupSize);

    // Use populate function to fill buffer values
    for (let groupIndex = 0; groupIndex < groups; groupIndex++) {
        const values = populate(groupIndex);
        for (
            let memberIndex = 0;
            memberIndex < groupSize && memberIndex < values.length;
            memberIndex++
        ) {
            buffer[groupIndex * groupSize + memberIndex] = values[memberIndex];
        }
    }

    return buffer;
}
