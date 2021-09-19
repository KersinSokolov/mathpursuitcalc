import initialState from '../librares/getDefaultPlayers';
import getPlayerData from '../librares/getPlayer';
import { globalGeometryTypes } from '../librares/geometrytypes';
import { dictStrategies } from '../models';

export default function(state = initialState, action){
    if (reducers[action.type]){
        return reducers[action.type](state, action);
    }else{
        return state;
    }
}

const reducers = {
    'ADD_PLAYER' : (state, action) => {
        let players = state.players.concat(getPlayerData(action.playerType));
        return {players};
    },
    'REMOVE_PLAYER' : (state, action) =>{
        let initialPlayers = state.players;
        initialPlayers.forEach((p)=>{
            if (Array.isArray(p.strategyOptions)){
                if (p.strategyOptions.includes(action.index)){
                    p.strategyName = dictStrategies.manual;
                    p.strategyOptions = {angle:0, step: 0};
                }else{
                    let newOptions = p.strategyOptions.map((index)=>{return index>action.index ? index-1 : index });
                    p.strategyOptions = newOptions;
                }
            }
        });
        let players = initialPlayers.filter((p, index)=>(index !== action.index));
        return {players};
    },
    'CHANGE_COORDINATES_PLAYER' : (state, action) =>{
        let players = state.players.concat([]); //repalce to spread operator
        const newPoint = globalGeometryTypes.Point(action.x || players[action.index].position.x, action.y || players[action.index].position.y);
        players[action.index].position = newPoint;
        return {players};
        //TODO: also need update available strategies, now not required
    },
    'CHANGE_STRATEGY_PLAYER' : (state, action) =>{
        let players = state.players.concat([]);
        let pl = players[action.index];
        pl.strategyName = action.strategyName;
        pl.strategyOptions = action.strategyOptions;
        if (pl.strategyName === dictStrategies.manual && !pl.strategyOptions){
            pl.strategyOptions = {angle: 0, step: 0};
        }
        return {players};
    },
    'NEXT_COORDINATES_ALLPLAYERS' : (state, action) =>{
        let players = state.players.map((elem,index,arr)=>{
            const ctrl = elem.getControl(arr);
            elem.position = globalGeometryTypes.nextPoint(elem.position, ctrl.angle, ctrl.step);
            return elem;
        });
        return {players};
    },
    'SET_PLAYERS': (state, action)=>{
        return action.players ? {players: action.players} : state;
    }
}