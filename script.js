document.addEventListener("DOMContentLoaded", () => {
  const reveal = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){ entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    });
  }, {threshold:.12});
  reveal.forEach(el => observer.observe(el));

  document.getElementById("surpriseBtn")?.addEventListener("click", () => {
    document.getElementById("letter").scrollIntoView({behavior:"smooth"});
    burst(18);
  });

  const target = new Date("2026-08-20T00:00:00");
  const countdownLabel = document.getElementById("countdownLabel");
  function tick(){
    const now = new Date();
    let diff = target - now;
    if(diff <= 0){
      document.getElementById("days").textContent = "28";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";
      countdownLabel.textContent = "It’s your birthday! 28 looks beautiful on you. ✨";
      return;
    }
    const d = Math.floor(diff/86400000); diff%=86400000;
    const h = Math.floor(diff/3600000); diff%=3600000;
    const m = Math.floor(diff/60000); diff%=60000;
    const s = Math.floor(diff/1000);
    document.getElementById("days").textContent = String(d).padStart(2,"0");
    document.getElementById("hours").textContent = String(h).padStart(2,"0");
    document.getElementById("minutes").textContent = String(m).padStart(2,"0");
    document.getElementById("seconds").textContent = String(s).padStart(2,"0");
  }
  tick(); setInterval(tick,1000);

  document.getElementById("celebrateBtn")?.addEventListener("click", () => {
    burst(70);
    const toast=document.getElementById("toast");
    toast.classList.add("show");
    setTimeout(()=>toast.classList.remove("show"),2500);
  });

  function burst(count){
    const symbols=["✦","♥","✧","🎉","♡"];
    for(let i=0;i<count;i++){
      const el=document.createElement("span");
      el.className="spark";
      el.textContent=symbols[Math.floor(Math.random()*symbols.length)];
      el.style.left=(45+Math.random()*10)+"vw";
      el.style.top=(45+Math.random()*10)+"vh";
      el.style.setProperty("--x",((Math.random()-.5)*window.innerWidth)+"px");
      el.style.setProperty("--y",((Math.random()-.5)*window.innerHeight)+"px");
      document.body.appendChild(el);
      setTimeout(()=>el.remove(),1500);
    }
  }
});

// Birthday password gate -> cute bear video -> birthday site
(() => {
  const form = document.getElementById("unlockForm");
  const input = document.getElementById("passwordInput");
  const gate = document.getElementById("passwordGate");
  const error = document.getElementById("gateError");
  const videoScreen = document.getElementById("bearVideoScreen");
  const video = document.getElementById("bearVideo");
  const progress = document.getElementById("videoProgress");
  const caption = document.getElementById("bearCaption");
  const subcaption = document.getElementById("bearSubcaption");
  const skip = document.getElementById("skipBear");
  if (!form) return;

  function showBirthdaySite(){
    videoScreen?.classList.remove("show");
    videoScreen?.setAttribute("aria-hidden","true");
    gate?.remove();
    setTimeout(()=>document.getElementById("surpriseBtn")?.focus(), 500);
  }

  function startBear(){
    gate.classList.add("unlocked");
    videoScreen.classList.add("show");
    videoScreen.setAttribute("aria-hidden","false");
    video.currentTime = 0;
    video.play().catch(()=>{});
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const value = input.value.trim().toLowerCase();
    if (value === "chudail" || value === "himani" || value === "birthday") {
      startBear();
    } else {
      error.classList.add("show");
      input.animate([{transform:"translateX(-7px)"},{transform:"translateX(7px)"},{transform:"translateX(0)"}], {duration:280});
      setTimeout(()=>error.classList.remove("show"),2200);
    }
  });

  video.addEventListener("timeupdate", () => {
    const pct = video.duration ? (video.currentTime / video.duration) * 100 : 0;
    progress.style.width = pct + "%";
    if(video.currentTime < 1.1){
      caption.textContent = "Hi Chudail! 👋";
      subcaption.textContent = "I have a tiny birthday message for you...";
    } else if(video.currentTime < 4.5){
      caption.textContent = "Make a wish... then blow! 💨";
      subcaption.textContent = "Your cake is waiting for you.";
    } else {
      caption.textContent = "Now go celebrate! 🎉";
      subcaption.textContent = "The rest of your surprise is ready.";
    }
  });

  video.addEventListener("ended", showBirthdaySite);
  skip.addEventListener("click", showBirthdaySite);
})();

// Candle: button-based blowing + optional microphone detection.
(() => {
  const flameWrap = document.getElementById("flameWrap");
  const blowBtn = document.getElementById("blowBtn");
  const micBtn = document.getElementById("micBtn");
  const progress = document.getElementById("blowProgress");
  const status = document.getElementById("blowStatus");
  const reveal = document.getElementById("wishReveal");
  if (!flameWrap || !blowBtn) return;

  let blown = false, level = 0, audioContext, analyser, stream, raf;

  function update(v){
    if (blown) return;
    level = Math.min(100, Math.max(level, v));
    progress.style.width = level + "%";
    if(level > 20) status.textContent = "The flame is flickering… keep blowing! 💨";
    if(level >= 100) extinguish();
  }

  function extinguish(){
    if(blown) return;
    blown = true;
    flameWrap.classList.add("out");
    progress.style.width = "100%";
    status.textContent = "Wish granted. ✨";
    reveal.classList.add("show");
    blowBtn.textContent = "🎉 Candle blown out!";
    blowBtn.disabled = true;
    if(stream) stream.getTracks().forEach(t=>t.stop());
    if(raf) cancelAnimationFrame(raf);
    if(audioContext) audioContext.close().catch(()=>{});
    for(let i=0;i<30;i++){
      const s=document.createElement("span");
      s.className="spark"; s.textContent=["✦","♥","✧"][Math.floor(Math.random()*3)];
      s.style.left=(45+Math.random()*10)+"vw"; s.style.top="50vh";
      s.style.setProperty("--x",((Math.random()-.5)*500)+"px");
      s.style.setProperty("--y",(-100-Math.random()*350)+"px");
      document.body.appendChild(s); setTimeout(()=>s.remove(),1500);
    }
  }

  blowBtn.addEventListener("mousedown",()=>{ update(35); });
  blowBtn.addEventListener("touchstart",()=>{ update(35); }, {passive:true});
  blowBtn.addEventListener("click",()=>{ update(100); });

  micBtn?.addEventListener("click", async ()=>{
    try{
      stream = await navigator.mediaDevices.getUserMedia({audio:true});
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser(); analyser.fftSize = 1024;
      source.connect(analyser);
      micBtn.textContent="🎙 Microphone active";
      status.textContent="Now blow toward your microphone… 💨";
      const data = new Uint8Array(analyser.fftSize);
      function listen(){
        if(blown) return;
        analyser.getByteTimeDomainData(data);
        let sum=0;
        for(let i=0;i<data.length;i++){ const x=(data[i]-128)/128; sum+=x*x; }
        const rms=Math.sqrt(sum/data.length);
        if(rms>.045) update(Math.min(100, level + Math.max(3, rms*45)));
        else if(level>0) { level=Math.max(0,level-.35); progress.style.width=level+"%"; }
        raf=requestAnimationFrame(listen);
      }
      listen();
    }catch(err){
      status.textContent="Microphone unavailable — use the button to blow out the candle.";
      micBtn.textContent="🎙 Microphone unavailable";
    }
  });
})();
