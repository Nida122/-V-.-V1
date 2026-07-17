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

	if (!vb){
		accessText.textContent = "ERROR : DATA NOT FOUND";
		return;
	}

	startAccess(vb,id);

});

/* ===================== ACCESS ===================== */

function startAccess(vb,id){

	let step = 0;

	const logs = [
		`ACCESSING ${id}...`,
		"LOADING DATA...",
		"DECRYPTING..."
	];

	const interval = setInterval(()=>{

		accessText.textContent = logs[step++];

		if(step >= logs.length){

			clearInterval(interval);

			setTimeout(()=>{

				accessScreen.style.display = "none";
				content.style.display = "block";

				loadVB(vb,id);

			},400);

		}

	},600);

}

/* ===================== MAIN ===================== */

function loadVB(vb,id){

	document.getElementById("vb-id").textContent = id.toUpperCase();
	document.getElementById("vb-name").textContent = vb.name;
	document.getElementById("vb-desc").innerText = vb.desc;

	document.getElementById("vb-image").src = vb.image;
	document.getElementById("vb-download").href = vb.dl;

	/* ===================== SPEC ===================== */

	document.getElementById("vb-type").textContent = vb.type || "-";
	document.getElementById("vb-format").textContent = vb.format || "-";
	document.getElementById("vb-pitch").textContent = vb.pitch || "-";
	document.getElementById("vb-original").textContent = vb.original || "-";
	document.getElementById("vb-illustration").textContent = vb.illustration || "-";
	document.getElementById("vb-author").textContent = vb.author || "-";

	/* ===================== YOUTUBE ===================== */

	const video = document.getElementById("vb-video");
	const videoBox = document.getElementById("vb-video-box");

	if(vb.youtube){

		video.src = `https://www.youtube.com/embed/${vb.youtube}`;
		videoBox.style.display = "block";

	}else{

		video.src = "";
		videoBox.style.display = "none";

	}

	/* ===================== AUDIO ===================== */

	const audio = document.getElementById("vb-audio");
	const play = document.getElementById("vb-play");
	const bar = document.querySelector(".vb-bar");
	const progress = document.getElementById("vb-progress");
	const time = document.getElementById("vb-time");

	audio.src = vb.audio;

	play.onclick = ()=>{

		if(audio.paused){

			audio.play();
			play.textContent = "■";

		}else{

			audio.pause();
			play.textContent = "▶";

		}

	};

	audio.ontimeupdate = ()=>{

		if(!audio.duration) return;

		progress.style.width =
			(audio.currentTime / audio.duration) * 100 + "%";

		time.textContent =
			formatTime(audio.currentTime);

	};

	bar.onclick = e=>{

		if(!audio.duration) return;

		const rect = bar.getBoundingClientRect();

		audio.currentTime =
			((e.clientX - rect.left) / rect.width)
			* audio.duration;

	};

	audio.onended = ()=>{

		play.textContent = "▶";
		progress.style.width = "0%";

	};

	/* ===================== VISUALIZER ===================== */

	const canvas = document.getElementById("vb-visualizer");
	const ctx = canvas.getContext("2d");

	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;

	const AudioCtx =
		window.AudioContext || window.webkitAudioContext;

	const audioCtx = new AudioCtx();

	const source = audioCtx.createMediaElementSource(audio);

	const analyser = audioCtx.createAnalyser();

	source.connect(analyser);
	analyser.connect(audioCtx.destination);

	analyser.fftSize = 32;
	analyser.smoothingTimeConstant = 0.25;

	const bufferLength = analyser.frequencyBinCount;
	const dataArray = new Uint8Array(bufferLength);

	let lastActive = Date.now();
	let sleep = false;

	function draw(){

		requestAnimationFrame(draw);

		analyser.getByteFrequencyData(dataArray);

		ctx.clearRect(0,0,canvas.width,canvas.height);

		const center = canvas.height/2;
		const w = canvas.width/bufferLength;

		let active = false;

		for(let i=0;i<bufferLength;i++){

			if(dataArray[i]>10){
				active=true;
				break;
			}

		}

		if(active){

			lastActive = Date.now();
			sleep = false;

		}else if(Date.now()-lastActive>1500){

			sleep = true;

		}

		for(let i=0;i<bufferLength;i++){

			let value = dataArray[i];

			if(audio.paused || sleep){

				value = Math.random()<0.02
					? Math.random()*20
					: 0;

			}

			const h =
				(value/255)
				* center
				*0.8;

			const x=i*w;

			ctx.fillStyle =
				sleep ? "#033" : "#0f0";

			ctx.fillRect(
				x,
				center-h,
				w-1,
				h
			);

			ctx.fillStyle =
				sleep ? "#011" : "#0a0";

			ctx.fillRect(
				x,
				center,
				w-1,
				h
			);

		}

		ctx.strokeStyle =
			sleep ? "#033" : "#0f0";

		ctx.beginPath();
		ctx.moveTo(0,center);
		ctx.lineTo(canvas.width,center);
		ctx.stroke();

	}

	draw();

	audio.addEventListener("play",()=>{

		audioCtx.resume();

		canvas.classList.add("active");

	});

	audio.addEventListener("pause",()=>{

		canvas.classList.remove("active");

	});

	audio.addEventListener("ended",()=>{

		canvas.classList.remove("active");

	});
		/* ===================== BACKGROUND ===================== */

	const bg = document.getElementById("bg-gifs");
	bg.innerHTML = "";

	const bgList = Array.isArray(vb.bg) ? vb.bg : [vb.bg];

	const COUNT = 10;

	for(let n = 0; n < COUNT; n++){

		const gif = document.createElement("img");

		gif.className = "bg-gif";

		gif.src = bgList[Math.floor(Math.random()*bgList.length)];

		gif.style.left = Math.random()*100 + "vw";
		gif.style.top = Math.random()*100 + "vh";

		const size = 40 + Math.random()*180;
		gif.style.width = size + "px";

		gif.style.opacity = 0.2 + Math.random()*0.6;

		gif.style.animationDuration =
			(4 + Math.random()*8) + "s";

		gif.style.animationDelay =
			(Math.random()*5) + "s";

		gif.style.transform =
			`rotate(${Math.random()*360}deg)`;

		bg.appendChild(gif);

	}

	/* ===================== GALLERY ===================== */

	let slide = 0;

	const slides =
		(vb.images && vb.images.length)
			? vb.images
			: [vb.image];

	const slideImg =
		document.getElementById("vb-slide-image");

	const dots =
		document.getElementById("vb-dots");

	const prev =
		document.getElementById("img-prev");

	const next =
		document.getElementById("img-next");

	function renderSlide(){

		slideImg.src = slides[slide];

		dots.innerHTML = "";

		slides.forEach((_,index)=>{

			const dot =
				document.createElement("div");

			dot.className =
				"vb-dot" +
				(index===slide ? " active" : "");

			dot.onclick=()=>{

				slide=index;
				renderSlide();

			};

			dots.appendChild(dot);

		});

		/* 画像1枚なら矢印を無効 */

		if(slides.length<=1){

			prev.disabled=true;
			next.disabled=true;

			prev.style.opacity=".2";
			next.style.opacity=".2";

		}else{

			prev.disabled=false;
			next.disabled=false;

			prev.style.opacity="";
			next.style.opacity="";

		}

	}

	renderSlide();

	prev.onclick=()=>{

		if(slides.length<=1)return;

		slide--;

		if(slide<0)
			slide=slides.length-1;

		renderSlide();

	};

	next.onclick=()=>{

		if(slides.length<=1)return;

		slide++;

		if(slide>=slides.length)
			slide=0;

		renderSlide();

	};

	/* ===================== MODAL ===================== */

	const modal =
		document.getElementById("vb-modal");

	const modalImg =
		document.getElementById("vb-modal-img");

	slideImg.onclick=()=>{

		modal.style.display="flex";
		modalImg.src=slides[slide];

	};

	modal.onclick=()=>{

		modal.style.display="none";

	};

		/* ===================== MOBILE SWIPE ===================== */

	let startX = 0;
	let currentX = 0;
	let dragging = false;

	slideImg.addEventListener("touchstart",(e)=>{

		if(slides.length <= 1) return;

		startX = e.touches[0].clientX;
		currentX = startX;
		dragging = true;

		slideImg.style.transition = "none";

	},{passive:true});

	slideImg.addEventListener("touchmove",(e)=>{

		if(!dragging) return;

		currentX = e.touches[0].clientX;

		const diff = currentX - startX;

		/* 軽い追従（iOS風） */
		slideImg.style.transform =
			`translateX(${diff * 0.25}px)`;

		e.preventDefault();

	},{passive:false});

	slideImg.addEventListener("touchend",()=>{

		if(!dragging) return;

		dragging = false;

		const diff = currentX - startX;

		slideImg.style.transition = "transform .18s ease";
		slideImg.style.transform = "translateX(0px)";

		if(Math.abs(diff) > 45){

			if(diff < 0){
				slide = (slide + 1) % slides.length;
			}else{
				slide = (slide - 1 + slides.length) % slides.length;
			}

			renderSlide();
		}

	});

	/* ===================== RESIZE ===================== */

	window.addEventListener("resize",()=>{

		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;

	});

}

/* ===================== FORMAT ===================== */

function formatTime(sec){

	const m = Math.floor(sec / 60);
	const s = Math.floor(sec % 60);

	return `${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;

}
