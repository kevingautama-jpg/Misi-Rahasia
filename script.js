let answers = {};
const secretCode = "15122010";

let nyawa = 3;
let waktuSisa = 180;
let timerMTK;
let laguTegang = document.getElementById("audioTegang");
let laguUltah = document.getElementById("audioUltah");

function gantiHalaman(idLama, idBaru) {
    document.getElementById(idLama).classList.remove("active");
    document.getElementById(idLama).style.display = "none";
    document.getElementById(idBaru).classList.add("active");
    document.getElementById(idBaru).style.display = "flex";
}

function nextPage(current, next) {
    let inputEl = document.getElementById("ans" + current);
    if(inputEl) {
        let jawaban = inputEl.value.trim().toLowerCase(); 
        if(jawaban === "") { alert("Isi dulu dong jawabannya! Jangan dikosongin."); return; }
        
        let kataTerlarang = ["terserah", "bebas", "apapun", "apa aja", "ntah", "ga tau", "gatau", "gak tau", "ndak tau", "idk", "au", "lupa", "bingung", "rahasia", "kepo", "privasi", "males", "malas", "gak ada", "gaada", "gada",".",",","?","ga mau","gaje","sok asik","sosik","ga jelas"];
        let terdeteksiNgeles = kataTerlarang.some(kata => jawaban.includes(kata));
        
        if(terdeteksiNgeles || jawaban.length < 2) {
            alert("Akses ditolak! Gak boleh ngeles atau jawab asal. Jawab yang bener!");
            return; 
        }
        answers["Pertanyaan " + current] = inputEl.value;
    }
    gantiHalaman("page" + current, "page" + next);
}

function checkPassword() {
    let guess = document.getElementById("ans5").value.trim();
    if(guess.length !== 8) { alert("Kode sandi harus tepat 8 digit angka!"); return; }

    let board = document.getElementById("wordle-board");
    let row = document.createElement("div"); row.className = "wordle-row";
    let secretArr = secretCode.split(""); let guessArr = guess.split("");
    let colors = Array(8).fill("box-red"); 

    for(let i = 0; i < 8; i++) { if(guessArr[i] === secretArr[i]) { colors[i] = "box-green"; secretArr[i] = null; } }
    for(let i = 0; i < 8; i++) { if(colors[i] !== "box-green") { let index = secretArr.indexOf(guessArr[i]); if(index !== -1) { colors[i] = "box-yellow"; secretArr[index] = null; } } }
    for(let i = 0; i < 8; i++) { let box = document.createElement("div"); box.className = "wordle-box " + colors[i]; box.innerText = guessArr[i]; row.appendChild(box); }
    board.appendChild(row); document.getElementById("ans5").value = ""; 

    if(guess === secretCode) {
        setTimeout(() => { answers["Status Hukuman"] = "AMAN (Sisa nyawa: " + nyawa + ")"; sendDataToEmail(); startHacked("page5"); }, 1000);
        return;
    }

    nyawa--;
    document.getElementById("nyawaText").innerText = "SISA PERCOBAAN: " + nyawa;

    if(nyawa === 0) {
        setTimeout(() => {
            gantiHalaman("page5", "pageWarning");
            setTimeout(() => { gantiHalaman("pageWarning", "page5B"); mulaiTimerGlobal(); }, 3000);
        }, 500);
    }
}

function mulaiTimerGlobal() {
    let timerUI = document.getElementById("penaltyTimerBox");
    timerUI.style.display = "block"; 
    laguTegang.play(); 
    
    timerMTK = setInterval(() => {
        waktuSisa--;
        let menit = Math.floor(waktuSisa / 60); let detik = waktuSisa % 60;
        timerUI.innerText = "0" + menit + ":" + (detik < 10 ? "0" : "") + detik;

        if(waktuSisa === 60) { document.body.className = "glitch-1"; laguTegang.playbackRate = 1.1; }
        else if(waktuSisa === 40) { document.body.className = "glitch-2"; laguTegang.playbackRate = 1.25; }
        else if(waktuSisa === 20) { document.body.className = "glitch-3"; laguTegang.playbackRate = 1.5; }
        else if(waktuSisa === 10) { document.body.className = "glitch-max"; laguTegang.playbackRate = 2.0; }

        if(waktuSisa <= 0) akhiriHukuman(false, "page" + (document.querySelector('.page.active').id.replace('page','')));
    }, 1000);
}

function cek5B() { let jwb = document.getElementById("ans5B").value.trim(); if(jwb === secretCode) gantiHalaman("page5B", "page6B"); else alert("SANDI SALAH! WAKTU TERUS BERJALAN!"); }
function cek6B() { let jwb = document.getElementById("ans6B").value.trim(); if(jwb === "2") gantiHalaman("page6B", "page7B"); else alert("JAWABAN SALAH! FOKUS!"); }
function cek7B() { let jwb = document.getElementById("ans7B").value.trim(); if(jwb === "3") gantiHalaman("page7B", "page8B"); else alert("JAWABAN SALAH! AYOLAH!"); }
function cek8B() { let jwb = document.getElementById("ans8B").value.trim(); if(jwb === "4") akhiriHukuman(true, "page8B"); else alert("DIKIT LAGI! JAWABAN SALAH!"); }

function akhiriHukuman(berhasil, idHalamanSekarang) {
    clearInterval(timerMTK); laguTegang.pause(); document.body.className = ""; document.getElementById("penaltyTimerBox").style.display = "none"; 
    if(berhasil) {
        alert("SYSTEM OVERRIDE SUCCESSFUL! MENGALIHKAN JALUR...");
        answers["Status Hukuman"] = "BERHASIL SELAMAT (Sisa Waktu: " + waktuSisa + " dtk)"; sendDataToEmail(); startHacked(idHalamanSekarang); 
    } else {
        answers["Status Hukuman"] = "GAME OVER (Waktu Habis)"; sendDataToEmail();
        gantiHalaman(idHalamanSekarang, "pageGameOver");
        setTimeout(() => { startHacked("pageGameOver"); }, 3000);
    }
}

function startHacked(idHalamanSebelumnya) {
    gantiHalaman(idHalamanSebelumnya, "page6");
    let count = 10;
    let timer = setInterval(() => {
        count--; document.getElementById("countdown").innerText = count;
        if(count <= 0) { clearInterval(timer); gantiHalaman("page6", "page7"); laguUltah.play(); }
    }, 1000);
}

function nextToKado() {
    gantiHalaman("page7", "page8");
    let glitchAudio = setInterval(() => { laguUltah.playbackRate = (Math.random() * 1.8 + 0.3).toFixed(2); laguUltah.volume = Math.random() > 0.3 ? 1.0 : 0.1; }, 100);
    
    setTimeout(() => {
        clearInterval(glitchAudio); laguUltah.playbackRate = 1.0; laguUltah.volume = 1.0;
        gantiHalaman("page8", "page9");
    }, 3000);
}

function sendDataToEmail() {
    // ⚠️ GANTI DENGAN EMAIL ASLI KAMU DI BAWAH SINI ⚠️
    const emailTujuan = "kevingautama3858@gmail.com"; 
    fetch("https://formsubmit.co/ajax/" + emailTujuan, { method: "POST", headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(answers) }).catch(error => console.log("Error email"));
}