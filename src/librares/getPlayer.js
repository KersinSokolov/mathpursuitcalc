import { PlayerObject } from './player';
import { globalGeometryTypes } from './geometrytypes';
import { dictStrategies } from '../models';

export default (role) => (
    new PlayerObject({
        isPursuer: !!role,
        position: globalGeometryTypes.Point(100, 100),
        strategyName: dictStrategies.manual,
        strategyOptions: { angle: 10, step: 1 }
    })
)
