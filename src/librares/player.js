import { globalGeometryTypes } from './geometrytypes.js';
import { dictStrategies } from '../models';
export class PlayerObject{
    constructor(args){
        this.isPursuer = args.isPursuer;
        this.position = args.position;
        this.strategyName =  args.strategyName;
        this.strategyOptions = args.strategyOptions;
    }
    getControl(players){
        if (this.strategyName === dictStrategies.manual){
            return this.strategyOptions;
        }
        if (this.strategyName === dictStrategies.simpleCatch){
            if (!this.strategyOptions || (this.strategyOptions[0]===undefined)){
                return {angle:0, step:0};
            }
            let p = players[this.strategyOptions[0]],
                ctrl2 = p.getControl(players),
                nextPos = PlayerObject._updateCoord(p.position, ctrl2.angle),
                a = angleInRadsInTriangle(this.position, p.position, nextPos);
            if ((a>Math.PI*0.5)&&(ctrl2.step >= 1)){
                return {angle:ctrl2.angle, step: 1}
            }
            let maxPoint = pointCrossPlayers(this, p, ctrl2,a),
                rightP = globalGeometryTypes.Point(this.position.x+100, this.position.y),
                angle  = angleInRadsInTriangle(rightP,this.position,maxPoint) * 180 / Math.PI;
            if (this.position.y > maxPoint.y) angle = 360 - angle;
            return {angle:angle, step:1};
        }
        if (this.strategyName === dictStrategies.ortogonal){
            if (!this.strategyOptions || (this.strategyOptions[0]===undefined) || (this.strategyOptions[1]===undefined)){
                return {angle:0, step:0};
            }
            let p1 = players[this.strategyOptions[0]].position,
                p2 = players[this.strategyOptions[1]].position;
            let dx = p1.x-p2.x,
                dy = p1.y-p2.y;
            if (dy===0) return {angle: (dx>0 ?90:-90), step:1};
            let r = Math.sqrt(dx*dx + dy*dy),
                x = Math.abs(dy)/r,
                y = (-x)*dx/dy,
                angle = Math.asin(y)*180/Math.PI;
                if (dx < 0){
                    angle+=180;
                }
            return {angle:angle, step:1};
        }
        if (this.strategyName === dictStrategies.mimic){
            if (!this.strategyOptions || (this.strategyOptions[0]===undefined)){
                return {angle:0, step:0};
            }
            let p = players[this.strategyOptions[0]],
                ctrl2 = p.getControl(players);
            return ctrl2;
        }
    }

    isLoopedPlayerInMimicStrategy(players, indexComparable, indexPlayerForBuildAvavilableOptions){
        if (indexComparable === indexPlayerForBuildAvavilableOptions) return true;
        let linkedPlayerIndex = (players[indexComparable].strategyName === dictStrategies.mimic && players[indexComparable].strategyOptions) ? players[indexComparable].strategyOptions[0] : undefined;
        if (isNaN(linkedPlayerIndex)) return false;
        return players[linkedPlayerIndex].isLoopedPlayerInMimicStrategy(players, linkedPlayerIndex, indexPlayerForBuildAvavilableOptions);
    }

    static _updateCoord(p, angle){
        let rads = angle * Math.PI / 180,
            x = p.x + Math.cos(rads)*100,
            y = p.y + Math.sin(rads)*100;
        return globalGeometryTypes.Point(x,y);
    }
}

function angleInRadsInTriangle(p1, p2, p3){
	let b = p1.rangeToPoint(p2),
	    c = p2.rangeToPoint(p3),
	    a =  p1.rangeToPoint(p3),
	    cosa = (b*b + c*c - a*a)/(2*b*c);//TODO: b, c === 0 ?
	return Math.acos(cosa);
}

function pointCrossPlayers(pur, pri, pc, radAngle){
	if (pc.step === 0) return pri.position;
    let c = pur.position.rangeToPoint(pri.position),
        cosA = Math.cos(radAngle),
	    sinA = Math.sin(radAngle),
	    sinB = sinA * pc.step,
        cosB = Math.sqrt(1 - sinB*sinB),
	    l = c * pc.step/ (pc.step*cosA+cosB),
        controlRad  = pc.angle*Math.PI / 180,
	    x = pri.position.x + Math.cos(controlRad)*l,
	    y = pri.position.y + Math.sin(controlRad)*l;
	return  globalGeometryTypes.Point(x,y);
}
