import { globalGeometryTypes } from './geometrytypes';
import { colors } from '../cssParams';

export default (players) => {
    let objForDraw = [],
		pursuers = players.filter(player => (player || {}).isPursuer);

	if (window.renderSettings.pursuersLinksEnabled){
		for (let i = 0; i < pursuers.length - 1; i++) {
			for (let j = i + 1; j < pursuers.length; j++) {
				objForDraw.push({ geometry: globalGeometryTypes.Line(pursuers[i].position, pursuers[j].position), options: { color: colors.line } })
			}
		}
	}

	players.forEach( (player, index) => {
		if (player) {
			objForDraw.push({ geometry: player.position, options: { color: (player.isPursuer ? colors.purser : colors.evader) } });
			let ang = player.getControl(players);
			let prefixIndex = (player.isPursuer ? 'P' : 'E') + index;
			objForDraw.push({ geometry: globalGeometryTypes.Line(player.position, globalGeometryTypes.nextPoint(player.position, ang.angle, 1000 * ang.step)), options: { color: (player.isPursuer ? colors.purser : colors.evader) } });
			objForDraw.push({ geometry: globalGeometryTypes.Text(prefixIndex, player.position.x, player.position.y) });
			if (window.renderSettings.settingsfeasibleset) {objForDraw.push({
				geometry: globalGeometryTypes.Circle(player.position.x,player.position.y, window.renderSettings.settingsfeasibleset), 
				options:{color: (player.isPursuer?'rgba(64,64,255,0.2)':'rgba(255,64,64,0.2)')}}) }
		}
	});

	return objForDraw;
}