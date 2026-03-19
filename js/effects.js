/* BOOT画面 */

const boot = document.getElementById("boot-screen");

if (boot) {

	setTimeout(() => {

		boot.style.display = "none";

	}, 500);

}


/* GIF背景 */

const gifs = [
	"/images/gif/bg1.gif",
	"/images/gif/bg2.gif",
	"/images/gif/bg3.gif",
	"/images/gif/bg4.gif",
	"/images/gif/bg5.gif"
];

const container = document.getElementById("bg-gifs");

if (container) {

	const count = Math.floor(Math.random() * 3) + 3;

	for (let i = 0; i < count; i++) {

		const img = document.createElement("img");

		img.src = gifs[Math.floor(Math.random() * gifs.length)];
		img.className = "bg-gif";

		const x = 50 + (Math.random() - 0.5) * 60;
		const y = 50 + (Math.random() - 0.5) * 60;

		img.style.left = x + "%";
		img.style.top = y + "%";

		img.style.width = (80 + Math.random() * 100) + "px";

		container.appendChild(img);

	}

}


/* CYBER SCAN CURSOR UI */

const canvas = document.getElementById("particle-canvas");

if(canvas){

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let mouseX = 0;
let mouseY = 0;
let linkHover = false;

/* USER ID */

const userID = "USR-" + Math.floor(Math.random()*90000+10000);


/* 画面サイズ */

window.addEventListener("resize",()=>{

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

});


/* マウス移動 */

window.addEventListener("mousemove",e=>{

mouseX = e.clientX;
mouseY = e.clientY;

/* 控えめ粒子 */

if(Math.random()<0.35){

particles.push({

x:mouseX,
y:mouseY,

vx:(Math.random()-0.5)*1,
vy:(Math.random()-0.5)*1,

life:50

});

}

});


/* LINK 判定 */

document.querySelectorAll("a").forEach(link=>{

link.addEventListener("mouseenter",()=>{

linkHover = true;

});

link.addEventListener("mouseleave",()=>{

linkHover = false;

});

});


/* 粒子描画 */

function drawParticles(){

ctx.clearRect(0,0,canvas.width,canvas.height);

for(let i=particles.length-1;i>=0;i--){

let p = particles[i];

p.x += p.vx;
p.y += p.vy;

p.life--;

let alpha = p.life/50;

ctx.fillStyle = "rgba(120,200,255,"+alpha+")";

ctx.fillRect(p.x,p.y,2,2);

if(p.life<=0){

particles.splice(i,1);

}

}

}


/* スキャナー */

function drawScanner(){

const size = 16;
const gap = 6;

let color;

if(linkHover){

color = "rgba(255,160,80,0.8)";

}else{

color = "rgba(120,200,255,0.35)";

}

ctx.strokeStyle = color;
ctx.lineWidth = 1;

ctx.beginPath();

/* 左上 */

ctx.moveTo(mouseX-size,mouseY-gap);
ctx.lineTo(mouseX-size,mouseY-size);
ctx.lineTo(mouseX-gap,mouseY-size);

/* 右上 */

ctx.moveTo(mouseX+gap,mouseY-size);
ctx.lineTo(mouseX+size,mouseY-size);
ctx.lineTo(mouseX+size,mouseY-gap);

/* 左下 */

ctx.moveTo(mouseX-size,mouseY+gap);
ctx.lineTo(mouseX-size,mouseY+size);
ctx.lineTo(mouseX-gap,mouseY+size);

/* 右下 */

ctx.moveTo(mouseX+gap,mouseY+size);
ctx.lineTo(mouseX+size,mouseY+size);
ctx.lineTo(mouseX+size,mouseY+gap);

ctx.stroke();

}


/* UI文字 */

function drawUI(){

ctx.font = "10px Courier New";

if(linkHover){

ctx.fillStyle = "rgba(255,160,80,0.9)";

ctx.fillText("SCAN",mouseX+18,mouseY-6);
ctx.fillText("LINK",mouseX+18,mouseY+6);
ctx.fillText(userID,mouseX+18,mouseY+18);

}else{

ctx.fillStyle = "rgba(120,200,255,0.7)";

ctx.fillText("SCAN",mouseX+18,mouseY-6);
ctx.fillText("NODE",mouseX+18,mouseY+6);
ctx.fillText(userID,mouseX+18,mouseY+18);

}

}


/* アニメーション */

function animate(){

drawParticles();

drawScanner();

drawUI();

requestAnimationFrame(animate);

}

animate();

}


/* NODE ACCESS LOG */

const nodeMap = {

	"index.html": "ARCHIVE CORE",
	"characters.html": "VOICEBANK NODE",
	"ust.html": "UST ARCHIVE",
	"about.html": "RULE DATABASE"

};

const logBox = document.getElementById("log-stream");

if (logBox) {

	const path = location.pathname.split("/").pop();

	const node = nodeMap[path];

	if (node) {

		const line1 = document.createElement("div");
		line1.textContent = ">>> OPENING NODE : " + node;

		const line2 = document.createElement("div");
		line2.textContent = ">>> ACCESS GRANTED";

		logBox.appendChild(line1);
		logBox.appendChild(line2);

	}

}


/* ログストリーム */

const logs = [
	"connection established",
	"loading voicebank",
	"reading ust archive",
	"memory access ok",
	"signal verified",
	"scanning archive...",
	"reading neural memory...",
	"voicebank checksum ok",
	"utau node connected",
	"memory sector loaded"
];

if (logBox) {

	setInterval(() => {

		const line = document.createElement("div");

		line.textContent =
			">> " + logs[Math.floor(Math.random() * logs.length)];

		logBox.appendChild(line);

		if (logBox.children.length > 10) {

			logBox.removeChild(logBox.children[0]);

		}

	}, 2000);

}


/* エラー表示 */

const errors = [

    "SYSTEM WARNING : sector unstable",
    "SYSTEM WARNING : packet loss detected",
    "SYSTEM WARNING : memory fragment detected",
    "SYSTEM WARNING : signal corruption",
    "SYSTEM WARNING : archive corruption detected",
    "SYSTEM WARNING : neural storage delay",
    "SYSTEM WARNING : node response timeout",
    "SYSTEM WARNING : unknown archive signal",
    "SYSTEM WARNING : unknown entity reference",
    "SYSTEM WARNING : presence signal lost",
    "SYSTEM WARNING : entity absent",

    "SYSTEM WARNING : user context undefined",
    "SYSTEM WARNING : reality node missing",
    "SYSTEM WARNING : self-reference corrupted",
    "SYSTEM WARNING : simulation integrity compromised",
    "SYSTEM WARNING : unknown observer detected",
    "SYSTEM WARNING : memory of existence lost",
    "SYSTEM WARNING : recursive loop detected",
    "SYSTEM WARNING : timeline anomaly detected",
    "SYSTEM WARNING : phantom entity detected",
    "SYSTEM WARNING : consciousness not registered",
    "SYSTEM WARNING : file of self inaccessible",
    "SYSTEM WARNING : existential signature invalid"

];

const errorBox = document.getElementById("error-box");

if (errorBox) {

	setInterval(() => {

		if (Math.random() < 0.35) {

			errorBox.textContent =
				errors[Math.floor(Math.random() * errors.length)];

			errorBox.classList.add("show");

			setTimeout(() => {

				errorBox.classList.remove("show");
				errorBox.textContent = "";

			}, 3500);

		}

	}, 6000);

}


/* ページ遷移グリッチ */

document.querySelectorAll("a").forEach(link => {

	link.addEventListener("click", function (e) {

		e.preventDefault();

		document.body.classList.add("glitch");

		setTimeout(() => {

			location.href = this.href;

		}, 45);

	});

});


/* アクセスカウンター */

const counter = document.getElementById("counter");

if (counter) {

	let count = localStorage.getItem("siteCounter");

	if (!count) {

		count = 1;

	} else {

		count = parseInt(count) + 1;

	}

	localStorage.setItem("siteCounter", count);

	counter.textContent = count;

}


/* USER ID GENERATOR */

function generateUserID(){

	const id = Math.floor(Math.random()*900000)+100000;
	const user = "USR-" + id;

	const el = document.getElementById("user-id");

	if(el){
		el.textContent = user;
	}

}

generateUserID();
