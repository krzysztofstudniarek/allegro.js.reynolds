
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
			vx : 5,
			vy : 5
		}
	);
}