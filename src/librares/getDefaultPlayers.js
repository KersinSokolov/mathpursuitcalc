import { PlayerObject } from './player';
import { globalGeometryTypes } from './geometrytypes';
import { players } from '../models';

export default {
    players: players.map((player, index) => (
        new PlayerObject({
            isPursuer: player.pursuer,
            position: globalGeometryTypes.Point(player.coordsX, player.coordsY),
            strategyName: player.strategy,
            strategyOptions: { angle: player.angle, step: player.step }
        })
    ))
}
