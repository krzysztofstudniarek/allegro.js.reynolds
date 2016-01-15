
var boidSprite;

var boids;
var obstacles;

var score = 0;

function draw()
{
	boids.forEach(function(boid){
		if(!boid.isPredator){
			rotate_sprite(canvas,boidSprite,boid.x,boid.y,DEG(Math.atan2(boid.vy,boid.vx)));
		}else{
			circlefill(canvas,boid.x,boid.y,7,makecol(255,0,0));
		}
	});
	
	obstacles.forEach(function(obstacle){
		circlefill(canvas,obstacle.x,obstacle.y,obstacle.radius,makecol(0,0,255));
	});
}

function update()
{
	boids.forEach(function(boid){
		boid.x += boid.vx;
		boid.y += boid.vy;
		
		if(boid.x >= SCREEN_W){
			boid.x = 0;
		}else if(boid.x <= 0){
			boid.x = SCREEN_W;
		}
		
		if(boid.y >= SCREEN_H){
			boid.y = 0;
		}else if(boid.y <= 0){
			boid.y = SCREEN_H;
		}
		
		
		
	});
	
}

function ai(){
	boids.forEach(function(boid){
		
		//Reynolds rules
		
		var neighbors = new Set();
		var predators = new Set();
		
		if(!boid.isPredator){
			
			boids.forEach(function(neighbor){
				if(neighbor != boid && distance(boid.x, boid.y, neighbor.x, neighbor.y)<50){
					neighbors.add(neighbor);
					if(neighbor.isPredator){
						predators.add(neighbor);
					}
				}
			});
			
			//if(	findMostThreateningObstacle == undefined){
			separation(boid, predators);
			normalize_velocity(boid);
			//}
			
			var tmp = frand();
			
			//Alignment
			if(tmp <= 0.1)
				alignment(boid, neighbors);
			
			//Cohesion
			if(tmp <= 0.03)
				cohesion(boid, neighbors);
			
			//Separation
			if(tmp <= 0.03)
				separation(boid, neighbors);
		
			
			//Velocity normalization
			
		}else{
			
			var victim;
			
			boids.forEach(function(vict){
				var d = distance(boid.x, boid.y, vict.x, vict.y)
				if(vict != boid && victim == undefined && d< 100 && !vict.isPredator){
					victim = vict;
				}else if(victim != undefined && vict != boid && d < 100 && d < distance(victim.x, victim.y, boid.x, boid.y)&& !vict.isPredator){
					victim = vict;
				}
			});
			
			if(victim != undefined){
				if(distance(boid.x, boid.y, victim.x, victim.y)<5){
					boids.delete(victim);
				}else{					
					boid.vx += 0.5*(victim.x - boid.x);
					boid.vy += 0.5*(victim.y - boid.y);
				}
			}
		
		}
		
		collisionAvoidance(boid);
		normalize_velocity(boid);
	});
}

function main()
{
    enable_debug('debug');
    allegro_init_all("game_canvas", 800, 600);
	load_elements();
    ready(function(){
        loop(function(){
			wipe_log();
            clear_to_color(canvas,makecol(0,255,0));
            update();
			ai();
            draw();
        },BPS_TO_TIMER(60));
    });
    return 0;
}
END_OF_MAIN();

function load_elements(){
	
	boidSprite = load_bitmap("boid.png");
	
	boids = new Set();
	for(var i = 0; i<200; i++){
		
		var angle = Math.asin(2*frand()-1);
		
		boids.add({
			x : rand()%SCREEN_W,
			y : rand()%SCREEN_H,
			vx : sgn(2*frand()-1)*Math.cos(angle),
			vy : sgn(2*frand()-1)*Math.sin(angle),
			isPredator : frand()<=0.01
		});
	}
	
	obstacles = new Set();
	
	for(var i = 0 ; i<rand()%3+3; i++){
		obstacles.add({
			x : 75 + rand()%(SCREEN_W-250),
			y : 75 + rand()%(SCREEN_H-250),
			radius : rand()%50 + 25
		});
	}
	
}

function normalize_velocity(boid){
	var n = Math.sqrt(boid.vx*boid.vx + boid.vy*boid.vy);	
	boid.vx = boid.vx/n;
	boid.vy = boid.vy/n;
}


function alignment(boid, neighbors){
	var ang = 0;
	var avgVx = 0;
	var avgVy = 0;
	neighbors.forEach(function(neighbor){
		//ang += Math.atan(neighbor.vy/neighbor.vx);
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
		//ang += Math.atan(neighbor.vy/neighbor.vx);
		avgVx += neighbor.x;
		avgVy += neighbor.y;
	});
	
	if(neighbors.size != 0){
		ang =  Math.atan(avgVy/avgVx);
		boid.vx += avgVx/neighbors.size - boid.x;
		boid.vy += avgVy/neighbors.size - boid.y;
	}
}

function separation(boid, neighbors){
	var ang = 0;
	var avgVx = 0;
	var avgVy = 0;
	neighbors.forEach(function(neighbor){
		//ang += Math.atan(neighbor.vy/neighbor.vx);
		avgVx += neighbor.x - boid.x;
		avgVy += neighbor.y - boid.y;
	});
	
	if(neighbors.size != 0){
		ang =  Math.atan(avgVy/avgVx);
		boid.vx += -1*avgVx/neighbors.size;
		boid.vy += -1*avgVy/neighbors.size;
	}
}

function boidFacesObstacle(boid, obstacle){
	//return distance(obstacle.x, obstacle.y, boid.x, boid.y) <= obstacle.radius + 10 || distance(obstacle.x, obstacle.y, boid.x+boid.vx*maxSee, boid.y+boid.vy*maxSee) <= obstacle.radius + 10 || distance(obstacle.x, obstacle.y, boid.x+boid.vx*maxSee*0.5, boid.y+boid.vy*maxSee*0.5) <= obstacle.radius + 10;
	
	d = distance(obstacle.x, obstacle.y, boid.x, boid.y);
	alpha = Math.asin((obstacle.radius+10)/d);
	
	d1 = distance(0, 0, boid.vx, boid.vy);
	betha = Math.acos(((boid.vx*(obstacle.x-boid.x))+(boid.vy*(obstacle.y-boid.y)))/(d*d1));
	
	return alpha > betha && d < obstacle.radius + 50;
	
}

function findMostThreateningObstacle(boid){
	var mostThreatening;

	obstacles.forEach(function(value){
		//console.log((mostThreating == undefined || (mostThreating != undefined && distance(boid.x,boid.y, value.x, value.y) < distance(boid.x, boid.y, mostThreating.x, mostThreating.y))));
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
		
		//normalize_velocity(boid);
	
	
}