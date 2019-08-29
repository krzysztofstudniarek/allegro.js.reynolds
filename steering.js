
var MAX_FORCE = 0.5;

function normalize_velocity(boid){
	var n = Math.sqrt(boid.vx*boid.vx + boid.vy*boid.vy);	
	boid.vx = boid.vx/n;
	boid.vy = boid.vy/n;
}

//3 Reynolds Rules
function alignment(boid, neighbors){
	var ang = 0;
	var avgVx = 0;
	var avgVy = 0;
	neighbors.forEach(function(neighbor){
		avgVx += neighbor.vx;
		avgVy += neighbor.vy;
	});
	
	if(neighbors.size != 0){
		ang =  Math.atan(avgVy/avgVx);
		boid.vx += avgVx/neighbors.size;
		boid.vy += avgVy/neighbors.size;	
	}
}

function cohesion(boid, neighbors){
	var ang = 0;
	var avgVx = 0;
	var avgVy = 0;
	neighbors.forEach(function(neighbor){
		avgVx += neighbor.x;
		avgVy += neighbor.y;
	});
	
	if(neighbors.size != 0){
		boid.vx += avgVx/neighbors.size - boid.x;
		boid.vy += avgVy/neighbors.size - boid.y;
	}
}

function separation(boid, neighbors){
	var ang = 0;
	var avgVx = 0;
	var avgVy = 0;
	neighbors.forEach(function(neighbor){
		avgVx += neighbor.x - boid.x;
		avgVy += neighbor.y - boid.y;
	});
	
	if(neighbors.size != 0){
		boid.vx += -1*avgVx/neighbors.size;
		boid.vy += -1*avgVy/neighbors.size;
	}
}

//Functions for obstacle avoidance
function boidFacesObstacle(boid, obstacle){
	d = distance(obstacle.x, obstacle.y, boid.x, boid.y);
	alpha = Math.asin((obstacle.radius+5)/d);
	
	d1 = distance(0, 0, boid.vx, boid.vy);
	betha = Math.acos(((boid.vx*(obstacle.x-boid.x))+(boid.vy*(obstacle.y-boid.y)))/(d*d1));
	
	return alpha > betha && d < obstacle.radius + 50;
	
}

function findMostThreateningObstacle(boid){
	var mostThreatening;

	obstacles.forEach(function(value){
		if(boidFacesObstacle(boid, value) && (mostThreatening == undefined || (mostThreatening != undefined && distance(boid.x,boid.y, value.x, value.y) < distance(boid.x, boid.y, mostThreatening.x, mostThreatening.y)))){
			mostThreatening = value;
		}
	});
	
	return mostThreatening;
	
}

function collisionAvoidance(boid){
	
	var mostThreatening = findMostThreateningObstacle(boid);
	
	if(mostThreatening != undefined){	
			d = distance(mostThreatening.x, mostThreatening.y, boid.x, boid.y);
	
			boid.vx += boid.x+boid.vx*d - mostThreatening.x; 
			boid.vy += boid.y+boid.vy*d - mostThreatening.y;
		}	
}


function seek(boid){
	var d = distance(mouse_x, mouse_y, boid.x, boid.y);
	if(d < 100){
		
		boid.vx = (mouse_x - boid.x)*MAX_FORCE;
		boid.vy = (mouse_y - boid.y)*MAX_FORCE;
	}else{
		boid.vx += (mouse_x - boid.x)*MAX_FORCE;
		boid.vy += (mouse_y - boid.y)*MAX_FORCE;
	}

}
