
var boidSprite;

var boids;
var obstacles;

function draw()
{
	boids.forEach(function(boid){
		rotate_sprite(canvas,boidSprite,boid.x,boid.y,DEG(Math.atan2(boid.vy,boid.vx)));
	});
	
	obstacles.forEach(function(obstacle){
		circlefill(canvas,obstacle.x,obstacle.y,obstacle.radius,makecol(0,0,255, 125));
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
		
		obstacles.forEach(function(obstacle){
			d = distance(boid.x, boid.y, obstacle.x, obstacle.y);
			alpha = Math.asin((obstacle.radius)/d);
			
			d1 = distance(0, 0, boid.vx, boid.vy);
			betha = Math.acos(((boid.vx*(obstacle.x-boid.x))+(boid.vy*(obstacle.y-boid.y)))/(d*d1));
			//log(alpha > betha);
			if(alpha > betha && d <obstacle.radius + 100){
				gamma = (Math.asin((obstacle.y - boid.y)/d));
				if(gamma > 0){
					boid.vx = 3*Math.cos(gamma-alpha);
					boid.vy = 3*Math.sin(gamma-alpha);
				}else{
					boid.vx = 3*Math.cos(gamma+alpha);
					boid.vy = 3*Math.sin(gamma+alpha);
				}
			}
		});
		
	});
	
}

function ai(){
	
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
            draw();
        },BPS_TO_TIMER(60));
    });
    return 0;
}
END_OF_MAIN();

function load_elements(){
	
	boidSprite = load_bitmap("boid.png");
	
	boids = new Set();
	for(var i = 0; i<10; i++){
		boids.add({
			x : SCREEN_W-1 + rand()%50 - 100,
			y : SCREEN_H-1 + rand()%50 - 100,
			vx : frand()*6- 3,
			vy : frand()*6- 3
		});
	}
	
	obstacles = new Set();
	
	obstacles.add({
		x : 150,
		y : 150,
		radius : 100
	});
	
	
}