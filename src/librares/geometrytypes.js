function Point(x, y){
	let obj = {x, y};
	obj.rangeToPoint = function(p){
		return Math.sqrt((p.x-this.x)*(p.x-this.x) + (p.y-this.y)*(p.y-this.y));
	};
	obj.type = 'point';
	return obj;
}

function Line(p1,p2){
	let obj = {p1, p2};
	obj.type = 'line';
	return obj;
}

function Text(str, x, y){
    let obj = {x, y, text:str};
    obj.type = 'text';
    return obj;
}

function Circle(x, y, r){
    let obj = {x, y, radius : r};
	obj.type = 'circle';
	return obj;
}

function nextPoint(p, angle, step){
	let deltaStep = 0.1,
		rads = angle * Math.PI / 180,
		x = p.x + Math.cos(rads) * deltaStep * step,
		y = p.y + Math.sin(rads) * deltaStep * step;
	return Point(x, y);
}

export const globalGeometryTypes = {
	Point,
	Line,
	Text,
	Circle,
	nextPoint
}
