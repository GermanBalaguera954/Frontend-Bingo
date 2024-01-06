// bingoLogic.js

export const isBingo = (markedCells) => {
    // Comprobar cartón pleno
    if (markedCells.size === 24) {
        return true;
    }

    // Comprobar diagonales, verticales, horizontales y esquinas
    const lines = [
        // Horizontales (5 filas)
        ['0-0', '0-1', '0-2', '0-3', '0-4'],
        ['1-0', '1-1', '1-2', '1-3', '1-4'],
        ['2-0', '2-1', '2-2', '2-3', '2-4'],
        ['3-0', '3-1', '3-2', '3-3', '3-4'],
        ['4-0', '4-1', '4-2', '4-3', '4-4'],

        // Verticales (5 columnas)
        ['0-0', '1-0', '2-0', '3-0', '4-0'],
        ['0-1', '1-1', '2-1', '3-1', '4-1'],
        ['0-2', '1-2', '2-2', '3-2', '4-2'],
        ['0-3', '1-3', '2-3', '3-3', '4-3'],
        ['0-4', '1-4', '2-4', '3-4', '4-4'],

        // Diagonales
        ['0-0', '1-1', '2-2', '3-3', '4-4'],
        ['0-4', '1-3', '2-2', '3-1', '4-0'],

        // Esquinas
        ['0-0', '0-4', '4-0', '4-4']
    ];

    return lines.some(line => line.every(cellId => markedCells.has(cellId)));
};

