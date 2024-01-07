export const isBingo = (markedCells, gameType, drawnNumbers) => {
    const drawnSet = new Set(drawnNumbers);

    const allMarkedAreDrawn = [...markedCells].every(cell => drawnSet.has(cell));

    if (!allMarkedAreDrawn) return false;

    switch (gameType) {
        case 'fullHouse':
            return markedCells.size === 24;
        case 'horizontalLine':
            return checkHorizontalLines(markedCells);
        case 'verticalLine':
            return checkVerticalLines(markedCells);
        case 'diagonal':
            return checkDiagonals(markedCells);
        case 'corners':
            return checkCorners(markedCells);
        default:
            return false;
    }
};

const checkHorizontalLines = (markedCells) => {
    for (let i = 0; i < 5; i++) {
        const row = [`${i}-0`, `${i}-1`, `${i}-2`, `${i}-3`, `${i}-4`];
        if (row.every(id => markedCells.has(id))) {
        }
    }
};

const checkVerticalLines = (markedCells) => {
    for (let i = 0; i < 5; i++) {
        const column = [`0-${i}`, `1-${i}`, `2-${i}`, `3-${i}`, `4-${i}`];
        if (column.every(id => markedCells.has(id))) {
        }
    }
};

const checkDiagonals = (markedCells) => {
    const diagonal1 = ['0-0', '1-1', '2-2', '3-3', '4-4'];
    const diagonal2 = ['0-4', '1-3', '2-2', '3-1', '4-0'];
    return diagonal1.every(id => markedCells.has(id)) || diagonal2.every(id => markedCells.has(id));
};

const checkCorners = (markedCells) => {
    const corners = ['0-0', '0-4', '4-0', '4-4'];
    return corners.every(id => markedCells.has(id));
};
