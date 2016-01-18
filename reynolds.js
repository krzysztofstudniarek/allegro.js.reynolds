
var boidSprite;
var predatorSprite;

var boids;
var obstacles;

var score = 0;

var font1;

function draw()
{
	boids.forEach(function(boid){
		if(!boid.isPredator){
			circlefill(canvas, boid.x, boid.y, 5, makecol(0,0,0));
		}else{
			//rotate_sprite(canvas,predatorSprite,boid.x,boid.y,DEG(Math.atan2(boid.vy,boid.vx)));
			circlefill(canvas, boid.x, boid.y, 5, makecol(255,0,0));
		}
	});
	
	obstacles.forEach(function(obstacle){
		circlefill(canvas,obstacle.x,obstacle.y,obstacle.radius,makecol(0,0,255));
	});
	
	textout(canvas,font1,score,50,50,40,makecol(255,255,255));
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
		
			separation(boid, predators);
			normalize_velocity(boid);
			
			var tmp = frand();
			
			//Alignment
			if(tmp <= 0.1)
				alignment(boid, neighbors);
			
			//Cohesion
			if(tmp <= 0.01)
				cohesion(boid, neighbors);
			
			//Separation
			if(tmp <= 0.03)
				separation(boid, neighbors);
		
			
			//Velocity normalization
			
		}else{
			
			boids.forEach(function(vict){
				var d = distance(boid.x, boid.y, vict.x, vict.y)
				if(d<= 10 && vict != boid){
					boids.delete(vict);
					score += 1;
				}
			});
			
			seek(boid);
			normalize_velocity(boid);
		
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
	font1 = load_font("./antilles.ttf");
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
	
	boids = new Set();
	for(var i = 0; i<200; i++){
		
		var angle = Math.asin(2*frand()-1);
		
		boids.add({
			x : rand()%SCREEN_W,
			y : rand()%SCREEN_H,
			vx : sgn(2*frand()-1)*Math.cos(angle),
			vy : sgn(2*frand()-1)*Math.sin(angle),
			isPredator : false
		});
	}

	boids.add({
			x : SCREEN_W/2,
			y: SCREEN_H/2,
			vx: 1,
			vy: 1,
			isPredator : true
	});
	
	obstacles = new Set();
	
	for(var i = 160 ; i<SCREEN_W-150; i += 150){
		for(var j = 135; j < SCREEN_H-75; j += 150){
			obstacles.add({
				x : i,
				y : j,
				radius : 25
			});
		}
		
	}
	
}
