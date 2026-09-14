const canvas = document.getElementById('signal-field');
const context = canvas.getContext('2d');
let width;
let height;
let particles;
const pointer = { x: -1000, y: -1000 };

function resize() {
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;
	particles = Array.from({ length: Math.min(90, Math.floor(width / 15)) }, () => ({
		x: Math.random() * width,
		y: Math.random() * height,
		vx: (Math.random() - .5) * .22,
		vy: (Math.random() - .5) * .22,
		size: Math.random() * 1.8 + .3
	}));
}

function draw() {
	context.clearRect(0, 0, width, height);
	particles.forEach((particle, index) => {
		particle.x += particle.vx;
		particle.y += particle.vy;
		if (particle.x < 0 || particle.x > width) particle.vx *= -1;
		if (particle.y < 0 || particle.y > height) particle.vy *= -1;
		const distance = Math.hypot(pointer.x - particle.x, pointer.y - particle.y);
		context.fillStyle = distance < 170 ? '#e7b45b' : '#77bdc2';
		context.globalAlpha = distance < 170 ? .8 : .3;
		context.fillRect(particle.x, particle.y, particle.size, particle.size);
		particles.slice(index + 1, index + 4).forEach(other => {
			const gap = Math.hypot(particle.x - other.x, particle.y - other.y);
			if (gap < 115) {
				context.globalAlpha = (1 - gap / 115) * .14;
				context.strokeStyle = '#77bdc2';
				context.beginPath();
				context.moveTo(particle.x, particle.y);
				context.lineTo(other.x, other.y);
				context.stroke();
			}
		});
	});
	context.globalAlpha = 1;
	requestAnimationFrame(draw);
}

function showToast(message, duration) {
	const toast = document.getElementById('toast');
	toast.textContent = message;
	toast.classList.add('show');
	setTimeout(() => toast.classList.remove('show'), duration);
}

window.addEventListener('resize', resize);
window.addEventListener('pointermove', event => {
	pointer.x = event.clientX;
	pointer.y = event.clientY;
});
resize();
draw();

document.querySelectorAll('nav button').forEach(button => button.addEventListener('click', () => {
	document.querySelectorAll('nav button').forEach(item => item.classList.remove('active'));
	button.classList.add('active');
	document.getElementById(button.dataset.section)?.scrollIntoView({ behavior: 'smooth' });
}));

document.getElementById('launch-button').addEventListener('click', () => {
	showToast('COMMAND MAP OPENED // ROUTE LOCKED', 2800);
});

document.querySelectorAll('.operator-card').forEach((card, index) => card.addEventListener('click', () => {
	document.querySelectorAll('.operator-card').forEach(item => item.classList.remove('selected'));
	card.classList.add('selected');
	const detail = document.querySelector('.operator-detail');
	const portrait = document.getElementById('operator-portrait');
	detail.classList.remove('detail-updated');
	document.querySelector('.detail-index').textContent = `Selected operator / ${String(index + 1).padStart(2, '0')}`;
	document.getElementById('operator-name').textContent = card.dataset.name;
	document.getElementById('operator-rarity').textContent = card.dataset.rarity || '6★';
	document.getElementById('operator-faction').textContent = card.dataset.faction || 'Rhodes Island';
	document.getElementById('operator-note').textContent = card.dataset.note;
	document.getElementById('operator-status').textContent = `● ${card.dataset.role} / Ready for deployment`;
	portrait.src = card.querySelector('img').src;
	portrait.alt = `${card.dataset.name} portrait`;
	requestAnimationFrame(() => detail.classList.add('detail-updated'));
	showToast(`${card.dataset.name.toUpperCase()} // PROFILE LOADED`, 2200);
}));

document.querySelectorAll('.operator-card img, #operator-portrait').forEach(image => image.addEventListener('error', () => {
	image.src = 'assets/operators/raidian.svg';
	image.alt = 'Fallback operator portrait';
}));
