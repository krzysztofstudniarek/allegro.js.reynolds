
var boidSprite;

var boids;

function draw()
{
	boids.forEach(function(boid){
		rotate_sprite(canvas,boidSprite,boid.x,boid.y,DEG(Math.atan2(boid.vy,boid.vx)));
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

function main()
{
    enable_debug('debug');
    allegro_init_all("game_canvas", 640, 480);
    hide_mouse();
	load_elements();
    ready(function(){
        loop(function(){
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
	boids.add(
		{
			x : 100,
			y : 100,
			vx : 3,
			vy : 3
		}
	);
}