// ===============================
const params = new URLSearchParams(location.search);
const id = params.get("id");

const accessText = document.getElementById("access-text");
const accessScreen = document.getElementById("access-screen");
const content = document.getElementById("vb-content");

// ===============================
fetch("data.json")
.then(res => res.json())
.then(data => {

	const vb = data[id];

	if (!vb) {
		accessText.textContent = "ERROR: DATA NOT FOUND";
		return;
	}

	startAccess(vb, id);
});

// ===============================
function startAccess(vb, id){

	let step = 0;

	const logs = [
		`ACCESSING ${id}...`,
		"LOADING DATA...",
		"DECRYPTING..."
	];

	const interval = setInterval(() => {

		accessText.textContent = logs[step];
		step++;

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

// ===============================
function loadVB(vb, id){

	document.getElementById("vb-id").textContent = id.toUpperCase();
	document.getElementById("vb-name").textContent = vb.name;
	document.getElementById("vb-desc").innerText = vb.desc;

	document.getElementById("vb-image").src = vb.image;
	document.getElementById("vb-download").href = vb.audio;

	const audio = document.getElementById("vb-audio");
	const playBtn = document.getElementById("vb-play");
	const progress = document.getElementById("vb-progress");
	const bar = document.querySelector(".vb-bar");
	const time = document.getElementById("vb-time");
	const canvas = document.getElementById("vb-visualizer");
	const ctx = canvas.getContext("2d");

	audio.src = vb.audio;

	// ===============================
	// PLAYER
	// ===============================

	playBtn.onclick = () => {
		if (audio.paused) {
			audio.play();
			playBtn.textContent = "■";
		} else {
			audio.pause();
			playBtn.textContent = "▶";
		}
	};

	audio.ontimeupdate = () => {
		if (!audio.duration) return;

		const percent = (audio.currentTime / audio.duration) * 100;
		progress.style.width = percent + "%";
		time.textContent = formatTime(audio.currentTime);
	};

	bar.onclick = (e) => {
		const rect = bar.getBoundingClientRect();
		const ratio = (e.clientX - rect.left) / rect.width;
		audio.currentTime = ratio * audio.duration;
	};

	audio.onended = () => {
		playBtn.textContent = "▶";
		progress.style.width = "0%";
	};

	// ===============================
	// VISUALIZER
	// ===============================

	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	const src = audioCtx.createMediaElementSource(audio);
	const analyser = audioCtx.createAnalyser();

	src.connect(analyser);
	analyser.connect(audioCtx.destination);

	analyser.fftSize = 128;

	const bufferLength = analyser.frequencyBinCount;
	const dataArray = new Uint8Array(bufferLength);

	let lastActiveTime = Date.now();
	let sleep = false;

	function draw(){

		analyser.getByteFrequencyData(dataArray);

		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const centerY = canvas.height / 2;
		const barWidth = (canvas.width / bufferLength) * 2.5;

		let x = 0;

		// 音検出
		let active = false;
		for(let i = 0; i < bufferLength; i++){
			if(dataArray[i] > 10){
				active = true;
				break;
			}
		}

		if(active){
			lastActiveTime = Date.now();
			sleep = false;
		}

		if(Date.now() - lastActiveTime > 1500){
			sleep = true;
		}

		for(let i = 0; i < bufferLength; i++){

			let value = dataArray[i];

			// スリープ or 停止
			if(audio.paused || sleep){
				if(Math.random() < 0.02){
					value = Math.random() * 20;
				}else{
					value = 0;
				}
			}

			const height = Math.floor((value / 255) * centerY * 0.7 / 3) * 3;

			// 上
			ctx.fillStyle = sleep ? "#030" : "#0f0";
			ctx.fillRect(x, centerY - height, barWidth, height);

			// 下
			ctx.fillStyle = sleep ? "#010" : "#0a0";
			ctx.fillRect(x, centerY, barWidth, height);

			x += barWidth + 1;
		}

		// 中央ライン
		ctx.strokeStyle = sleep ? "#030" : "#0f0";
		ctx.beginPath();
		ctx.moveTo(0, centerY);
		ctx.lineTo(canvas.width, centerY);
		ctx.stroke();

		// class制御
		if(sleep){
			canvas.classList.add("sleep");
		}else{
			canvas.classList.remove("sleep");
		}

		requestAnimationFrame(draw);
	}

	draw();

	audio.addEventListener("play", () => {
		audioCtx.resume();
		canvas.classList.add("active");
	});

	audio.addEventListener("pause", () => {
		canvas.classList.remove("active");
	});

	audio.addEventListener("ended", () => {
		canvas.classList.remove("active");
	});

	// BG
	const bg = document.getElementById("bg-gifs");
	bg.style.backgroundImage = `url(../images/${vb.bg})`;
	bg.style.backgroundSize = "cover";
}

// ===============================
function formatTime(sec) {
	const m = Math.floor(sec / 60);
	const s = Math.floor(sec % 60);
	return `${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
}