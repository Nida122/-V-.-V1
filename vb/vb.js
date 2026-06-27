
/* ===================== INIT ===================== */

const params = new URLSearchParams(location.search);
const id = params.get("id");

const accessText = document.getElementById("access-text");
const accessScreen = document.getElementById("access-screen");
const content = document.getElementById("vb-content");

/* ===================== LOAD ===================== */

fetch("data.json")
.then(r => r.json())
.then(data => {

	const vb = data[id];

	if (!vb) {
		accessText.textContent = "ERROR: DATA NOT FOUND";
		return;
	}

	startAccess(vb, id);
});

/* ===================== ACCESS ===================== */

function startAccess(vb, id){

	let step = 0;

	const logs = [
		`ACCESSING ${id}...`,
		"LOADING DATA...",
		"DECRYPTING..."
	];

	const interval = setInterval(() => {

		accessText.textContent = logs[step++];

		if (step >= logs.length) {
			clearInterval(interval);

			setTimeout(() => {
				accessScreen.style.display = "none";
				content.style.display = "block";
				loadVB(vb, id);
			}, 400);
		}

	}, 600);
}

/* ===================== MAIN ===================== */

function loadVB(vb, id){

	document.getElementById("vb-id").textContent = id.toUpperCase();
	document.getElementById("vb-name").textContent = vb.name;
	document.getElementById("vb-desc").innerText = vb.desc;

	document.getElementById("vb-image").src = vb.image;
	document.getElementById("vb-download").href = vb.dl;

	/* SPEC */
	document.getElementById("vb-type").textContent = vb.type || "-";
	document.getElementById("vb-format").textContent = vb.format || "-";
	document.getElementById("vb-pitch").textContent = vb.pitch || "-";
	document.getElementById("vb-original").textContent = vb.original || "-";
	document.getElementById("vb-illustration").textContent = vb.illustration || "-";
	document.getElementById("vb-author").textContent = vb.author || "-";

	/* YOUTUBE */
	const video = document.getElementById("vb-video");
	const box = document.getElementById("vb-video-box");

	if (vb.youtube) {
		video.src = `https://www.youtube.com/embed/${vb.youtube}`;
		box.style.display = "block";
	} else {
		box.style.display = "none";
	}

	/* AUDIO */
	const audio = document.getElementById("vb-audio");
	const play = document.getElementById("vb-play");
	const bar = document.querySelector(".vb-bar");
	const progress = document.getElementById("vb-progress");
	const time = document.getElementById("vb-time");

	audio.src = vb.audio;

	play.onclick = () => {
		audio.paused ? audio.play() : audio.pause();
		play.textContent = audio.paused ? "▶" : "■";
	};

	audio.ontimeupdate = () => {
		if (!audio.duration) return;
		progress.style.width = (audio.currentTime / audio.duration) * 100 + "%";
		time.textContent = formatTime(audio.currentTime);
	};

	bar.onclick = e => {
		const r = bar.getBoundingClientRect();
		audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
	};

	/* BACKGROUND */
	
const bg = document.getElementById("bg-gifs");
bg.innerHTML = "";

// 配列対応（単体でもOK）
const bgList = Array.isArray(vb.bg) ? vb.bg : [vb.bg];

// 表示数
const COUNT = 10;

// ランダム生成
for (let i = 0; i < COUNT; i++) {

	const img = document.createElement("img");
	img.className = "bg-gif";

	// ランダムGIF
	img.src = bgList[Math.floor(Math.random() * bgList.length)];

	// ランダム位置（画面全体）
	const x = Math.random() * 100;
	const y = Math.random() * 100;

	img.style.left = x + "vw";
	img.style.top = y + "vh";

	// ランダムサイズ
	const size = 40 + Math.random() * 180;
	img.style.width = size + "px";

	// ランダム透明度
	img.style.opacity = 0.2 + Math.random() * 0.6;

	// ランダム回転
	const rot = Math.random() * 360;
	img.style.transform = `rotate(${rot}deg)`;

	// ランダムアニメ速度
	img.style.animationDuration = (4 + Math.random() * 8) + "s";

	// ランダムレイヤー（奥行き）
	img.style.zIndex = Math.floor(Math.random() * 3);

	// アニメ遅延
	img.style.animationDelay = (Math.random() * 5) + "s";

	bg.appendChild(img);
}

	/* ===================== SLIDES ===================== */

	let i = 0;
	const slides = vb.images?.length ? vb.images : [vb.image];

	const img = document.getElementById("vb-slide-image");
	const dots = document.getElementById("vb-dots");

	const prevBtn = document.getElementById("img-prev");
	const nextBtn = document.getElementById("img-next");

	function render(){

		img.src = slides[i];

		dots.innerHTML = "";

		slides.forEach((_, n) => {
			const d = document.createElement("div");
			d.className = "vb-dot" + (n === i ? " active" : "");
			d.onclick = () => { i = n; render(); };
			dots.appendChild(d);
		});
	}

	render();

	prevBtn.onclick = () => {
		i = (i - 1 + slides.length) % slides.length;
		render();
	};

	nextBtn.onclick = () => {
		i = (i + 1) % slides.length;
		render();
	};

	/* ===================== MODAL ===================== */

	const modal = document.getElementById("vb-modal");
	const mimg = document.getElementById("vb-modal-img");

	img.onclick = () => {
		modal.style.display = "flex";
		mimg.src = slides[i];
	};

	modal.onclick = () => {
		modal.style.display = "none";
	};

	/* ===================== MOBILE SWIPE ===================== */

	let startX = 0;

img.addEventListener("touchstart", (e) => {
	startX = e.touches[0].clientX;
}, { passive: true });

img.addEventListener("touchmove", (e) => {
	// スクロール・ドラッグ完全停止
	e.preventDefault();
}, { passive: false });

img.addEventListener("touchend", (e) => {

	const endX = e.changedTouches[0].clientX;
	const diff = endX - startX;

	if (Math.abs(diff) < 40) return;

	if (diff < 0) {
		i = (i + 1) % slides.length;
	} else {
		i = (i - 1 + slides.length) % slides.length;
	}

	render();
});
}

/* ===================== FORMAT ===================== */

function formatTime(s){
	const m = Math.floor(s/60);
	const r = Math.floor(s%60);
	return `${m.toString().padStart(2,"0")}:${r.toString().padStart(2,"0")}`;
}
