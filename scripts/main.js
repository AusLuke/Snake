var canvas = document.getElementById('game');
			var context = canvas.getContext('2d');
			
			var grid = 16;
			var count = 0;
			
			// snake object
			var snake = {
				x: 160,
				y: 160,
				
				// moves one grid length every frame
				dx: grid,
				dy: 0,
				
				// keep track of all grids the snake body occupies
				cells: [],
				
				//initial length of the snake
				maxCells: 4
			};
			
			
			var food = {
				x:320,
				y:320
			};
			
			// function that returns a random whole number in specified range
			function getRandomInt(min, max) {
				return Math.floor(Math.random() * (max - min)) + min;
			}
			
			// main game loop
			function loop() {
				requestAnimationFrame(loop);
				
				// slow game loop to 15 fps instea of 60 (60 / 15 = 4)
				if (++count < 3) {
					return;
				}
				
				count = 0;
				context.clearRect(0, 0, canvas.width, canvas.height);
				
				// move snake
				snake.x += snake.dx;
				snake.y += snake.dy;
				
				// wrap snake position horizontally on edge of screen
				if (snake.x < 0) {
					snake.x = canvas.width - grid;
				} else if (snake.x >= canvas.width) {
					snake.x = 0;
				}
				
				// wrap snake position vertically on edge of screen
				if (snake.y < 0) {
					snake.y = canvas.height - grid;
				} else if (snake.y >= canvas.height) {
					snake.y = 0;
				}
				
				// keep track of where snake has been. Front of array is always the head
				snake.cells.unshift({x: snake.x, y: snake.y});
				
				// remove cells as we move away from them
				if (snake.cells.length > snake.maxCells) {
					snake.cells.pop();
				}
				
				//draw food
				context.fillStyle = 'purple';
				context.fillRect(food.x, food.y, grid-1, grid-1);
				
				// draw snake one cell at a time
				context.fillStyle = 'green';
				snake.cells.forEach(function(cell, index) {
					
					// drawing 1px smaller than the grid creates a grid effect in the snake body so you can see how long it is
					context.fillRect(cell.x, cell.y, grid-1, grid-1);
					
					// snake ate food
					if (cell.x === food.x && cell.y === food.y) {
						snake.maxCells++;
						
						// canvas is 400x400 which is 25x25 grid
						food.x = getRandomInt(0, 25) * grid;
						food.y = getRandomInt(0, 25) * grid;
					}
					
					// check for collision with all cells after this one (modified bubble sort)
					for (var i = index + 1; i < snake.cells.length; i++) {
						
						// if snake occupies same space as a body part, reset game
						if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
							snake.x = 160;
							snake.y = 160;
							snake.cells = [];
							snake.maxCells = 4;
							snake.dx = grid;
							snake.dy = 0;
							
							food.x = getRandomInt(0, 25) * grid;
							food.y = getRandomInt(0, 25) * grid;
						}
					}
				});		
			}
			
			// listen for keyboard events to move the snake
			document.addEventListener('keydown', function(e) {
				
				// left arrow key
				if (e.which === 37 && snake.dx === 0) {
					snake.dx = -grid;
					snake.dy = 0;
				}
				
				// up arrow key
				if (e.which === 38 && snake.dy === 0) {
					snake.dy = -grid;
					snake.dx = 0;
				}
				
				// right arrow key
				if (e.which === 39 && snake.dx === 0) {
					snake.dx = grid;
					snake.dy = 0;
				}
				
				// down arrow key
				if (e.which === 40 && snake.dy === 0) {
					snake.dy = grid;
					snake.dx = 0;
				}
			});
			
			// start the game
			requestAnimationFrame(loop);
			