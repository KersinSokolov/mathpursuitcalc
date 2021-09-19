import { dictStrategies } from '../models';

export default (index, players) => {
    if (!players[index]) return [];
    let strategies = [{ name: dictStrategies.manual }];
    let all = players.map((player, index) => index );
	strategies.push({ name: dictStrategies.ortogonal, value: { availablenumbers: all, count: 2 } });
	
	let availableInMovingAsStrategy = [];
	players.forEach((player, indexC)=>{
		if (!players[index].isPursuer && player.isPursuer) return;
		if  (indexC === index){
			return;
		}
		if ((player.strategyName !== dictStrategies.mimic) || !players[index].isLoopedPlayerInMimicStrategy(players, indexC, index)){
			availableInMovingAsStrategy.push(indexC);
		}
	});
	strategies.push({ name: dictStrategies.mimic, value: { availablenumbers: availableInMovingAsStrategy, count: 1 } });

	if (players[index].isPursuer) {
		let evaders = players
			.map((player, index) => (player && player.isPursuer ? -1 : index))
			.filter(evader => evader >= 0);
		strategies.push({ name: dictStrategies.simpleCatch, value: { availablenumbers: evaders, count: 1 } });
    }

	return strategies;
}