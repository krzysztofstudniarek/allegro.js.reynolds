
var boidSprite;

var boids;
var obstacles;

function draw()
{
	boids.forEach(function(boid){
		rotate_sprite(canvas,boidSprite,boid.x,boid.y,DEG(Math.atan2(boid.vy,boid.vx)));
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
		
		if(boid.x > SCREEN_W){
			boid.x = 0;
		}else if(boid.x < 0){
			boid.x = SCREEN_W;
		}
		
		if(boid.y > SCREEN_H){
			boid.y = 0;
		}else if(boid.y < 0){
			boid.y = SCREEN_H;
		}
		
		
		
	});
	
}

function ai(){
	boids.forEach(function(boid){
		
		//Reynolds rules
		
		var neighbors = new Set();
		
		boids.forEach(function(neighbor){
			if(neighbor != boid && distance(boid.x, boid.y, neighbor.x, neighbor.y)<50){
				neighbors.add(neighbor);
			}
		});
		
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
		normalize_velocity(boid);
	
	
	
		//Obstacle Avoidance
		obstacles.forEach(function(obstacle){
			d = distance(obstacle.x, obstacle.y, boid.x, boid.y);
			alpha = Math.asin((obstacle.radius+10)/d);
			
			d1 = distance(0, 0, boid.vx, boid.vy);
			betha = Math.acos(((boid.vx*(obstacle.x-boid.x))+(boid.vy*(obstacle.y-boid.y)))/(d*d1));
			//log(alpha > betha);
			if(alpha > betha && d < obstacle.radius + 300){
				gamma = (Math.asin((obstacle.y - boid.y)/d));
				console.log(gamma + " : "+ alpha);
				if(boid.x < obstacle.x){
					if(gamma > 0){
						boid.vx = Math.cos(gamma-alpha);
						boid.vy = Math.sin(gamma-alpha);
					}else{
						boid.vx = Math.cos(gamma+alpha);
						boid.vy = Math.sin(gamma+alpha);
					}
				}else{
					if(gamma > 0){
						boid.vx = -1*Math.cos(gamma-alpha);
						boid.vy = Math.sin(gamma-alpha);
					}else{
						boid.vx = -1*Math.cos(gamma+alpha);
						boid.vy = Math.sin(gamma+alpha);
					}

				}
			}
		});
	});
}

function main()
{
    enable_debug('debug');
    allegro_init_all("game_canvas", 640, 480);
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
	for(var i = 0; i<50; i++){
		
		var angle = Math.asin(2*frand()-1);
		boids.add({
			x : rand()%SCREEN_W,
			y : rand()%SCREEN_H,
			vx : sgn(2*frand()-1)*Math.cos(angle),
			vy : sgn(2*frand()-1)*Math.sin(angle)
		});
	}
	
	obstacles = new Set();
	
	/*obstacles.add({
		x : SCREEN_W/2-200,
		y : SCREEN_H/2-100,
		radius : 50
	});
	
	obstacles.add({
		x : SCREEN_W/2+50,
		y : SCREEN_H/2-50,
		radius : 50
	});
	
	obstacles.add({
		x : SCREEN_W/2+200,
		y : SCREEN_H/2+100,
		radius : 50
	});*/
	
	
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