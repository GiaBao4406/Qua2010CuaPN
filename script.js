// 🌸 Hiệu ứng mưa tim
const canvas = document.getElementById("heartRain");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const hearts = [];
for (let i = 0; i < 60; i++) {
  hearts.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 20 + 10,
    speed: Math.random() * 1 + 0.5,
  });
}

function drawHearts(glow = false) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach((h) => {
    ctx.beginPath();
    ctx.moveTo(h.x, h.y);
    ctx.bezierCurveTo(
      h.x - h.size / 2,
      h.y - h.size / 2,
      h.x - h.size,
      h.y + h.size / 3,
      h.x,
      h.y + h.size
    );
    ctx.bezierCurveTo(
      h.x + h.size,
      h.y + h.size / 3,
      h.x + h.size / 2,
      h.y - h.size / 2,
      h.x,
      h.y
    );
    ctx.fillStyle = glow ? "#ffb6c1" : "#ffc0cb";
    ctx.shadowBlur = glow ? 20 : 0;
    ctx.shadowColor = glow ? "#ff66b2" : "transparent";
    ctx.fill();
    h.y += h.speed;
    if (h.y > canvas.height + 20) h.y = -10;
  });
}

// 🌼 Phân tích âm thanh
const audio = document.getElementById("audio");
const lyricsDiv = document.getElementById("lyrics");
const img = document.getElementById("friendImg");

// 🎵 Lyric theo thời gian
const lyrics = [
  { time: 0, text: "Ngày thay đêm, vội trôi giấc mơ êm đềm" },
  { time: 7, text: "Tôi lênh đênh trên biển vắng" },
  { time: 12, text: "Hoàng hôn chờ em chưa buông nắng" },
  { time: 14, text: "Đừng tìm nhau" },
  { time: 17, text: "Vào hôm gió mưa tơi bời" },
  { time: 21, text: "Sợ lời sắp nói vỡ tan thương đau" },
  { time: 24, text: "Hẹn kiếp sau có nhau trọn đời" },
  { time: 42, text: "Liệu người có còn ở đây với tôi thật lâu" },
  { time: 49, text: "Ngày rộng tháng dài sợ mai không còn thấy nhau" },
  { time: 54, text: "Ngày em đến áng mây xanh thêm" },
  { time: 59, text: "Ngày em đi nắng vương cuối thềm" },
  { time: 62, text: "Thiếu em tôi sợ bơ vơ, vắng em như tàn cơn mơ" },
  { time: 69, text: "Chẳng phải phép màu vậy sao chúng ta gặp nhau" },
  { time: 76, text: "Một người khẽ cười, người kia cũng dịu nỗi đau" },
  { time: 82, text: "Gọi tôi thức giấc cơn ngủ mê" },
  { time: 86, text: "Dìu tôi đi lúc quên lối về" },
  { time: 90, text: "Quãng đời mai sau luôn cạnh nhau" },
  { time: 104, text: "Rồi ngày mai" },
  { time: 106, text: "Còn ai với ai ở lại" },
  { time: 109, text: "Vẫn căng buồm ra khơi" },
  { time: 111, text: "Theo làn gió mới" },
  { time: 113, text: "Vì biết đâu mọi thứ chưa bắt đầu" },
  { time: 129, text: "Liệu người có còn ở đây với tôi thật lâu" },
  { time: 136, text: "Ngày rộng tháng dài sợ mai không còn thấy nhau" },
  { time: 142, text: "Ngày em đến áng mây xanh thêm" },
  { time: 146, text: "Ngày em đi nắng vương cuối thềm" },
  { time: 149, text: "Thiếu em tôi sợ bơ vơ, vắng em như tàn cơn mơ" },
  { time: 156, text: "Chẳng phải phép màu vậy sao chúng ta gặp nhau" },
  { time: 162, text: "Một người khẽ cười, người kia cũng dịu nỗi đau" },
  { time: 169, text: "Gọi tôi thức giấc cơn ngủ mê" },
  { time: 172, text: "Dìu tôi đi lúc quên lối về" },
  { time: 176, text: "Quãng đời thanh xuân, sao em cho tôi giữ lấy, giữ lấy." },
  { time: 215, text: "Chẳng phải phép màu vậy sao chúng ta gặp nhau" },
  { time: 223, text: "Một người khẽ cười, người kia cũng dịu nỗi đau" },
  { time: 228, text: "Gọi tôi thức giấc cơn ngủ mê" },
  { time: 233, text: "Dìu tôi đi lúc quên lối về" },
  { time: 237, text: "Quãng đời mai sau luôn cạnh nhau" },
  { time: 243, text: "Quãng đời mai sau luôn cạnh nhau." },
];

let currentLyricIndex = -1;
let audioCtx, analyser, dataArray, bufferLength;

// 🌈 Hiển thị karaoke từng chữ
function showKaraokeLyric(text, duration = 3000) {
  lyricsDiv.innerHTML = "";
  const chars = text.split("");
  chars.forEach((ch) => {
    const span = document.createElement("span");
    span.textContent = ch;
    lyricsDiv.appendChild(span);
  });

  const spans = lyricsDiv.querySelectorAll("span");
  let progress = 0;
  const interval = setInterval(() => {
    const index = Math.floor((progress / duration) * spans.length);
    spans.forEach((s, i) => {
      if (i < index) {
        s.style.color = "#fff";
        s.style.textShadow =
          "0 0 10px #fff, 0 0 20px #ff66b2, 0 0 40px #ff1493";
      } else {
        s.style.color = "rgba(255,255,255,0.3)";
        s.style.textShadow = "none";
      }
    });
    progress += 60;
    if (progress > duration) clearInterval(interval);
  }, 60);
}

// 🎧 Khi phát nhạc → khởi tạo
audio.addEventListener("play", () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const src = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    src.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 512;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    animate();
  }
});

// 🌟 Hiệu ứng tổng hợp theo beat
function animate() {
  requestAnimationFrame(animate);
  if (!analyser) return;

  analyser.getByteFrequencyData(dataArray);
  const bass = dataArray.slice(0, 20).reduce((a, b) => a + b, 0) / 20;

  // 💖 Mưa tim sáng theo beat
  const glow = bass > 120;
  drawHearts(glow);

  // 🌈 Viền ảnh đổi màu + nhịp
  const hue = (bass * 3 + Date.now() / 10) % 360;
  const borderColor = `hsl(${hue}, 100%, 70%)`;
  img.style.border = `6px solid ${borderColor}`;
  img.style.boxShadow = `0 0 ${10 + bass / 5}px ${borderColor}`;
  img.style.transform = `scale(${1 + bass / 400}) rotate(${Math.sin(
    bass / 60
  )}deg)`;

  // 🎤 Cập nhật lyric
  const t = audio.currentTime;
  const next = lyrics.findIndex((line) => t < line.time);
  const index = next === -1 ? lyrics.length - 1 : Math.max(0, next - 1);

  if (index !== currentLyricIndex) {
    currentLyricIndex = index;
    showKaraokeLyric(lyrics[index].text, 3000);
  }
}

// Nếu autoplay bị chặn → click để phát
window.addEventListener("click", () => {
  audio.play();
  if (audioCtx) audioCtx.resume();
});
