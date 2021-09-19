export const dictStrategies = {
    simpleCatch: 'Параллельное сближение',
    manual: 'Вручную',
    ortogonal: 'Ортогонально к отрезку',
    mimic: 'Аналогичное управление'
};

export const players = [
    {
        pursuer: true,
        coordsX: 100,
        coordsY: 55,
        strategy: dictStrategies.manual,
        angle: 14,
        step: 1
    },
    {
        pursuer: true,
        coordsX: 256,
        coordsY: 144,
        strategy: dictStrategies.manual,
        angle: 90,
        step: 1
    },
    {
        pursuer: false,
        coordsX: 150,
        coordsY: 150,
        strategy: dictStrategies.manual,
        angle: 111,
        step: 1
    },
    {
        pursuer: true,
        coordsX: 300,
        coordsY: 250,
        strategy: dictStrategies.manual,
        angle: 0,
        step: 1
    },
    {
        pursuer: false,
        coordsX: 400,
        coordsY: 150,
        strategy: dictStrategies.manual,
        angle: 45,
        step: 1
    },
];

export const playerType = {
    pursuer: 'pursuer',
    evader: 'evader'
}
