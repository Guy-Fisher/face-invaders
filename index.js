const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const scoreEl = document.querySelector('#scoreEl')

canvas.width = 1024 * 1.5
canvas.height = 576 * 1.5

class Player{
	constructor() {
		
		
		this.velocity = {
			x: 0,
			y: 0
		}
		
		this.rotation = 0
		this.opacity = 1
		
		const image = new Image()
		image.src = './img/Ship.png'
		image.onload = () => {
			
			const scale = 0.35
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale
			this.position = {
			x: canvas.width / 2 - this.width / 2,
			y: canvas.height - this.height - 20
			}
			
		}
		
	}
	
	draw() {
		c.save()
		c.globalAlpha = this.opacity
		c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
		c.rotate(this.rotation)
		c.translate(- player.position.x - player.width / 2, -player.position.y - player.height / 2)
		c.drawImage(this.image, this.position.x+this.velocity.x, this.position.y, this.width, this.height)
		c.restore()
	}
	
	update() {
		if(this.image) {
			this.draw()
			this.position.x += this.velocity.x
		}
		
	}
}

class Invader{
	constructor({position}) {
		
		
		this.velocity = {
			x: 0,
			y: 0
		}
		
		
		const image = new Image()
		image.src = './img/invader.webp'
		image.onload = () => {
			
			const scale = 0.6
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale
			this.position = {
			x: position.x,
			y: position.y
			}
			
		}
		
	}
	
	draw() {

		c.drawImage(this.image, this.position.x+this.velocity.x, this.position.y, this.width, this.height)
	}
	
	update({velocity}) {
		if(this.image) {
			this.draw()
			this.position.x += velocity.x
			this.position.y += velocity.y
		}
		
	}
	
	shoot(invaderProjectiles){
		invaderProjectiles.push(new invaderProjectile({
			position: {
				x: this.position.x + this.width / 2,
				y: this.position.y + this.height
			},
			velocity: {
				x:0,
				y:5
			}
		}))
	}
}

class Grid {
	constructor(){
		this.position = {
			x:0,
			y:0
		}
		this.velocity = {
			x:3,
			y:0
		}
		
		this.invaders = []
		
		
		const columns = Math.floor(Math.random() * 10) + 10
		const rows = Math.floor(Math.random() * 4) + 1
		
		this.width = columns * 50
		
		for (let x = 0; x < columns; x++) {
			for (let y = 0; y < rows; y++) {
				this.invaders.push(
					new Invader({
						position: {
							x:x * 50,
							y:y * 75
							}
						})
				)
			}
		}
	}
	
	update(){
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
		
		this.velocity.y = 0
		
		if(this.position.x + this.width >= canvas.width || this.position.x <=0){
			this.velocity.x = -this.velocity.x
			this.velocity.y = 75
		}
	}
}

class Projectile{
	constructor({position, velocity}){
		this.position = position
		this.velocity = velocity
		this.radius = 5		
	}
	
	draw(){
		c.beginPath()
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
		c.fillStyle = 'chartreuse'
		c.fill()
	}
	
	update(){
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
	
}

class Particle{
	constructor({position, velocity, radius, color, fades}){
		this.position = position
		this.velocity = velocity
		this.radius = radius
		this.color = color
		this.opacity = 1
		this.fades = fades
	}
	
	draw(){
		c.save()
		c.globalAlpha = this.opacity
		c.beginPath()
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
		c.fillStyle = this.color
		c.fill()
		c.restore()
	}
	
	update(){
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
		if (this.fades)
			this.opacity -= 0.01
	}
	
}

class invaderProjectile{
	constructor({position, velocity}){
		this.position = position
		this.velocity = velocity
		this.width = 4
		this.height = 10
	}
	
	draw(){
		c.fillStyle = '#7DF9FF'
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
	
	update(){
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
	
}



const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []

const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	space: {
		pressed: false
	}
}

let frames = 0
let randomInterval = Math.floor((Math.random() * 500) + 500)
let game = {
	over: false,
	active: true
}

let deathAudio = new Audio('./sounds/player_death.mp3')
let playerAudio = new Audio('./sounds/player_fire.mp3')
let invaderAudio = new Audio('./sounds/invader_fire.mp3')
invaderAudio.volume = 0.1
playerAudio.volume = 0.3

let score = 0

for (let i = 0; i < 100; i++){
	particles.push(
		new Particle({
			position: {
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height
			},
			velocity: {
				x: 0,
				y: 0.5
			},
							
			radius : Math.random() * 2,
			color: 'white',
			fades: false
		})
		)
							
						
						}

function createParticles({object, color, amount, fades}) {
	for (let i = 0; i < amount; i++){
						particles.push(
							new Particle({
								position: {
									x: object.position.x + object.width/2,
									y: object.position.y + object.height/2
								},
								velocity: {
									x: (Math.random() - 0.5) * 4,
									y: (Math.random() - 0.5) * 4
								},
							
								radius : Math.random() * 3,
								color: color,
								fades: fades
							})
							)
							
						
						}
}

function animate(){
	if (!game.active) return
	requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)
	player.update()
	particles.forEach((particle, i) => {
		
		if (particle.position.y - particle.radius >= canvas.height){
			particle.position.x = Math.random() * canvas.width
			particle.position.y = -particle.radius
		}
		
		if (particle.opacity <= 0) {
			setTimeout(() => {
				particles.splice(i, 1)
			}, 0)
		} else {
			particle.update()
		}
		
	})
	
	invaderProjectiles.forEach((invaderProjectile, index) => {
		if (invaderProjectile.position.y+ invaderProjectile.height >= canvas.height){
			setTimeout(() => {
				invaderProjectiles.splice(index, 1)
			}, 0)
			
			} else {invaderProjectile.update()}
			//Player hit by invader projectile
			if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y && invaderProjectile.position.x+invaderProjectile.width >= player.position.x && invaderProjectile.position.x <= player.position.x + player.width){
				
				player.opacity = 0
				game.over = true
				deathAudio.play()
				setTimeout(() => {
				game.active = false
				}, 2000)
				createParticles({
								object: player,
								color: '#F73718',
								amount: 50,
								fades : true
							})
				createParticles({
								object: player,
								color: '#FEDE17',
								amount: 50,
								fades : true
							})
				setTimeout(() => {
				invaderProjectiles.splice(index, 1)
			}, 0)
			}
		})
		
	
	projectiles.forEach((projectile, index) => {
		
		if(projectile.position.y + projectile.radius <=0) {
			projectiles.splice(index, 1)
		}
		else{projectile.update()
		}
		
	})
	
	grids.forEach((grid, gridIndex) => {
		grid.update()
		
		// Spawn Projectiles
	
		if(frames % 100 === 0 && grid.invaders.length > 0 && !game.over) {
			grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
			invaderAudio.play()
		}
			
		
		grid.invaders.forEach((invader, i) => {
			invader.update({velocity: grid.velocity})
			//projectiles hit enemy
			projectiles.forEach((projectile, j) => {
				if (
					projectile.position.y - projectile.radius <= invader.position.y + invader.height 
					&& projectile.position.x + projectile.radius >= invader.position.x 
					&& projectile.position.x - projectile.radius <= invader.position.x + invader.width 
					&& projectile.position.y +projectile.radius >= invader.position.y
				)	{
					
					
					
						
					setTimeout(() => {
						const invaderFound = grid.invaders.find(invader2 => {
							return invader2 === invader
						})
						
						const projectileFound = projectiles.find(projectile2 => projectile2 ===projectile)
						
						// remove invader and projectile here
						if (invaderFound && projectileFound){
							score += 100
							scoreEl.innerHTML = score
							createParticles({
								object: invader,
								color: '#ffdbac',
								amount: 15,
								fades : true
							})
							grid.invaders.splice(i, 1)
							projectiles.splice(j, 1)
							
							if (grid.invaders.length > 0){
								const firstInvader = grid.invaders[0]
								const lastInvader = grid.invaders[grid.invaders.length - 1]
								
								grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
								grid.position.x = firstInvader.position.x
							}
							else{
								grids.splice(gridIndex, 1)
							}
						}
						
					}, 0)
				}
				
			})
		})
	})
	
	if (keys.a.pressed && player.position.x >=0){
		player.velocity.x = -8
		player.rotation = -0.15
	} else if (keys.d.pressed && player.position.x <= canvas.width - player.width){
		player.velocity.x = 8
		player.rotation = 0.15
	} 
	else{
		player.velocity.x = 0
		player.rotation = 0
	}
	// Spawning enemies
	if (frames % randomInterval === 0) {
		grids.push(new Grid())
		randomInterval = Math.floor((Math.random() * 500) + 500)
		frames = 0
	}

	
	console.log(score)
	frames++
}

animate()

addEventListener('keydown', ({key}) => {
	if(game.over) return
	
	switch(key) {
		case 'a':
			keys.a.pressed = true
			break
			
		case 'd':
			keys.d.pressed = true
			break
			
		case ' ':
			projectiles.push(new Projectile({
			position: {
				x:player.position.x + player.width/2,
				y:player.position.y
			},
			velocity:{
				x: 0,
				y: -25
			}
}))
playerAudio.play()
			break
	}
})

addEventListener('keyup', ({key}) => {
	switch(key) {
		case 'a':
			
			keys.a.pressed = false
			break
		case 'd':
			
			keys.d.pressed = false
			break
		case ' ':
			break
	}
})