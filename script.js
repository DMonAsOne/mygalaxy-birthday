/* =========================================================
   MY GALAXY - V66.1 TOP CROP TWO PHOTOS
   V24: richer nebula pockets + brighter arm dust + varied mini galaxies + NO giant spiral ribbons
   Performance-first: heavy layers pre-rendered to staticCanvas
========================================================= */

const heart = document.getElementById("heart");
const progressText = document.getElementById("progressText");
const heartProgressFill = document.getElementById("heartProgressFill");
const loginButton = document.getElementById("loginButton");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");
const galaxyPage = document.getElementById("galaxy-page");
const canvas = document.getElementById("galaxyCanvas");
const ctx = canvas.getContext("2d");
const welcomeScreen = document.getElementById("welcome-screen");
const galaxyTitle = document.getElementById("galaxy-title");
const spaceDecor = document.getElementById("space-decor");
const memoryStars = document.querySelectorAll(".memory-star");
const starMessage = document.getElementById("star-message");
const messageText = document.getElementById("message-text");
const closeMessage = document.getElementById("close-message");
const firstMeetingModal = document.getElementById("first-meeting-modal");
const closeFirstMeeting = document.getElementById("close-first-meeting");
const loveStoryModal = document.getElementById("love-story-modal");
const closeLoveStory = document.getElementById("close-love-story");
const careNoteModal = document.getElementById("care-note-modal");
const closeCareNote = document.getElementById("close-care-note");
const birthdayWishModal = document.getElementById("birthday-wish-modal");
const closeBirthdayWish = document.getElementById("close-birthday-wish");
const birthdayBefore = document.getElementById("birthday-before");
const birthdayAfter = document.getElementById("birthday-after");
const blowCandles = document.getElementById("blow-candles");
const birthdayConfetti = document.getElementById("birthday-confetti");
const songVideoModal = document.getElementById("song-video-modal");
const closeSongVideo = document.getElementById("close-song-video");
const songVideoPlayer = document.getElementById("song-video-player");
const songVideoPlayerWrap = document.getElementById("song-video-player-wrap");
const songVideoPlaceholder = document.getElementById("song-video-placeholder");
const openSongSurprise = document.getElementById("open-song-surprise");
const songVideoEnding = document.getElementById("song-video-ending");

function random(min, max) {
    return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/* =========================================================
   HEART HOLD
========================================================= */

let progress = 0;
let holdTimer = null;
let completed = false;

function startHold() {
    if (completed || holdTimer !== null) return;

    heart.classList.add("holding");

    holdTimer = setInterval(() => {
        progress += 2;
        if (progress >= 100) progress = 100;

        const scale = 1 + (progress / 100) * 0.3;
        heart.style.transform = `scale(${scale})`;
        progressText.textContent = `กำลังเติมหัวใจ ${progress}% ❤️`;
        if (heartProgressFill) heartProgressFill.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(holdTimer);
            holdTimer = null;
            completed = true;

            heart.classList.remove("holding");
            heart.classList.add("full");
            heart.style.transform = "scale(1.3)";
            progressText.textContent = "หัวใจเต็มแล้ว ❤️";
            if (heartProgressFill) heartProgressFill.style.width = "100%";

            setTimeout(() => {
                document.getElementById("heart-page").style.display = "none";
                document.getElementById("login-page").style.display = "flex";
            }, 1500);
        }
    }, 50);
}

function stopHold() {
    if (holdTimer !== null) {
        clearInterval(holdTimer);
        holdTimer = null;
    }

    heart.classList.remove("holding");

    if (!completed) {
        progress = 0;
        heart.style.transform = "scale(1)";
        progressText.textContent = "กดค้างที่หัวใจ ❤️";
        if (heartProgressFill) heartProgressFill.style.width = "0%";
    }
}

const heartTouchArea = document.querySelector(".heart-wrapper");
heartTouchArea.addEventListener("pointerdown", e => {
    e.preventDefault();
    try { heartTouchArea.setPointerCapture(e.pointerId); } catch (_) {}
    startHold();
});

window.addEventListener("pointerup", stopHold);
window.addEventListener("pointercancel", stopHold);

/* =========================================================
   LOGIN
========================================================= */

function login() {
    if (passwordInput.value === "071107") {
        loginMessage.textContent = "หึ้ยย เก่งมากคั้บ ❤️";

        setTimeout(() => {
            document.getElementById("login-page").style.display = "none";
            galaxyPage.style.display = "block";
            document.body.classList.add("galaxy-entered");
            startUniverse();
        }, 700);
    } else {
        loginMessage.textContent = "ลองใหม่นะอ้วน รหัส6หลัก ❤️";
    }
}

loginButton.addEventListener("click", login);

passwordInput.addEventListener("keydown", e => {
    if (e.key === "Enter") login();
});

/* =========================================================
   CANVAS
========================================================= */

let width = 0;
let height = 0;
let dpr = 1;

const staticCanvas = document.createElement("canvas");
const staticCtx = staticCanvas.getContext("2d");

// V45: cached transition frame.
// During warp we draw this cheap bitmap instead of recalculating
// the crystal heart every animation frame.
const transitionSceneCanvas = document.createElement("canvas");
const transitionSceneCtx = transitionSceneCanvas.getContext("2d");

// V49: separate cached heart/orbits layer.
// This lets the galaxy move during warp while the heart stays perfectly stable.
const transitionHeartCanvas = document.createElement("canvas");
const transitionHeartCtx = transitionHeartCanvas.getContext("2d");

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    dpr = Math.min(window.devicePixelRatio || 1, 1.10);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    // V35 MAX COLOR:
    // Strong saturation + contrast on the canvas only.
    // Keeps the HTML title/login text unaffected.
    canvas.style.filter = "saturate(1.32) contrast(1.22) brightness(0.88)";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    staticCanvas.width = Math.round(width * dpr);
    staticCanvas.height = Math.round(height * dpr);
    staticCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    transitionSceneCanvas.width = Math.round(width * dpr);
    transitionSceneCanvas.height = Math.round(height * dpr);
    transitionSceneCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    transitionHeartCanvas.width = Math.round(width * dpr);
    transitionHeartCanvas.height = Math.round(height * dpr);
    transitionHeartCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/* =========================================================
   GLOW HELPERS
========================================================= */

function drawSoftGlow(c, x, y, radius, rgb, alpha) {
    const g = c.createRadialGradient(x, y, 0, x, y, radius);

    g.addColorStop(0, `rgba(${rgb},${alpha})`);
    g.addColorStop(0.22, `rgba(${rgb},${alpha * 0.80})`);
    g.addColorStop(0.50, `rgba(${rgb},${alpha * 0.35})`);
    g.addColorStop(0.78, `rgba(${rgb},${alpha * 0.10})`);
    g.addColorStop(1, `rgba(${rgb},0)`);

    c.fillStyle = g;
    c.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

function drawCloudBlob(c, x, y, rx, ry, rgb, alpha, rotation = 0) {
    c.save();
    c.translate(x, y);
    c.rotate(rotation);
    c.scale(rx, ry);

    const g = c.createRadialGradient(0, 0, 0, 0, 0, 1);

    g.addColorStop(0, `rgba(${rgb},${alpha})`);
    g.addColorStop(0.28, `rgba(${rgb},${alpha * 0.80})`);
    g.addColorStop(0.58, `rgba(${rgb},${alpha * 0.30})`);
    g.addColorStop(0.84, `rgba(${rgb},${alpha * 0.07})`);
    g.addColorStop(1, `rgba(${rgb},0)`);

    c.fillStyle = g;
    c.beginPath();
    c.arc(0, 0, 1, 0, Math.PI * 2);
    c.fill();
    c.restore();
}

/* =========================================================
   STATIC BACKGROUND
========================================================= */

function drawStaticBackground() {
    const c = staticCtx;

    c.clearRect(0, 0, width, height);

    const bg = c.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#010516");
    bg.addColorStop(0.22, "#02051b");
    bg.addColorStop(0.50, "#08051c");
    bg.addColorStop(0.76, "#10051d");
    bg.addColorStop(1, "#02030d");

    c.fillStyle = bg;
    c.fillRect(0, 0, width, height);

    drawBackgroundNebula(c);
    drawStaticStars(c);
    drawDreamyGalaxy(c, width / 2, height * 0.43);
}

/* =========================================================
   BACKGROUND NEBULA
========================================================= */

function drawBackgroundNebula(c) {
    c.save();
    c.globalCompositeOperation = "screen";

    const pools = [
        [0.00, 0.16, 0.40, "20,75,210", 0.16],
        [0.20, 0.00, 0.30, "65,25,205", 0.12],
        [0.72, 0.02, 0.34, "190,35,210", 0.16],
        [1.00, 0.24, 0.35, "155,35,205", 0.15],
        [0.00, 0.96, 0.37, "185,35,190", 0.15],
        [0.88, 0.90, 0.31, "25,95,210", 0.14],
        [0.52, 0.10, 0.26, "125,45,205", 0.10]
    ];

    for (const [px, py, pr, rgb, alpha] of pools) {
        drawSoftGlow(
            c,
            width * px,
            height * py,
            Math.max(width, height) * pr,
            rgb,
            alpha
        );
    }

    const patches = width < 700 ? 30 : 54;

    for (let i = 0; i < patches; i++) {
        const chance = Math.random();
        let rgb;

        if (chance < 0.32) rgb = "45,125,255";
        else if (chance < 0.67) rgb = "150,75,255";
        else rgb = "245,80,225";

        drawCloudBlob(
            c,
            random(-width * 0.05, width * 1.05),
            random(-height * 0.05, height * 1.05),
            random(75, 175),
            random(38, 92),
            rgb,
            random(0.010, 0.026),
            random(-0.9, 0.9)
        );
    }

    c.restore();
}

function drawStaticStars(c) {
    const amount = width < 700 ? 540 : 1220;

    for (let i = 0; i < amount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;

        const big = Math.random() < 0.024;
        const size = big ? random(0.9, 2.1) : random(0.10, 0.72);
        const alpha = big ? random(0.55, 0.96) : random(0.12, 0.66);

        const t = Math.random();

        if (t < 0.10) {
            c.fillStyle = `rgba(255,130,235,${alpha})`;
        } else if (t < 0.31) {
            c.fillStyle = `rgba(105,185,255,${alpha})`;
        } else {
            c.fillStyle = `rgba(245,240,255,${alpha})`;
        }

        c.beginPath();
        c.arc(x, y, size, 0, Math.PI * 2);
        c.fill();
    }
}

/* =========================================================
   V32.2 SOFT COLOR PATCHES
   Broad rounded color clouds. No thin streaks / no stroke lines.
========================================================= */
function drawV32SoftColorPatches(c,cx,cy){
    const mobile = width < 700;
    const count = mobile ? 18 : 34;
    const maxR = Math.max(width,height) * .52;

    for(let i=0;i<count;i++){
        const r = random(120,maxR);
        const a = random(0,Math.PI*2);
        const p = v15Point(cx,cy,r,a);
        const q = Math.random();
        const rgb = q < .34 ? "25,105,245" : q < .68 ? "145,40,235" : "245,38,170";

        drawCloudBlob(
            c,
            p.x + random(-38,38),
            p.y + random(-26,26),
            random(mobile?100:135,mobile?180:245),
            random(mobile?55:68,mobile?92:128),
            rgb,
            random(.010,.024),
            random(-.8,.8)
        );

        if(Math.random() < .44){
            drawCloudBlob(
                c,
                p.x + random(-25,25),
                p.y + random(-18,18),
                random(mobile?55:70,mobile?105:145),
                random(mobile?32:40,mobile?60:82),
                q < .50 ? "70,205,255" : "255,90,205",
                random(.012,.030),
                random(-.8,.8)
            );
        }
    }
}

/* =========================================================
   GALAXY
========================================================= */

function drawDreamyGalaxy(c, centerX, centerY) {
    c.save();
    c.globalCompositeOperation = "screen";

    // V15: cloudy galactic disc, not clean spiral rings.
    drawSoftGlow(c, centerX, centerY, Math.min(width,height)*0.72, "0,12,95", .030);
    drawSoftGlow(c, centerX, centerY, Math.min(width,height)*0.54, "55,0,150", .050);
    drawSoftGlow(c, centerX, centerY, Math.min(width,height)*0.37, "190,0,110", .055);

    // V32: keep the soft galactic body, but remove the long neon ribbon layers.
    drawV15CloudDisc(c,centerX,centerY);
    drawV16InnerCloudMass(c,centerX,centerY);
    // V32.2: replace long bright streaks with soft rounded cloud patches.
    drawV32SoftColorPatches(c,centerX,centerY);
    // V31 CLEAN STACK:
    // Keep the main galaxy, small galaxies and dust,
    // but disable older full-screen nebula layers that caused a purple veil.
    drawV18MiniGalaxies(c,centerX,centerY);
    drawV15Dust(c,centerX,centerY);
    drawV15Core(c,centerX,centerY);
    drawV26ArmDust(c, centerX, centerY);

    // Deepen space BEFORE drawing the new chunky nebula.
    drawV20DeepSpaceWash(c);

    // V32.5: TRUE SPIRAL — broad cloudy arms made from blobs + dust,
    // never from visible stroke lines.
    drawV325SpiralGalaxy(c, centerX, centerY);

    // Keep the heart/core readable.
    drawV31HeartClearZone(c, centerX, centerY);

    drawV19ContrastVignette(c);

    c.restore();
}

function v15Point(cx,cy,r,a) {
    const tilt=-.10;
    const x=Math.cos(a)*r;
    const y=Math.sin(a)*r*.36;
    return {
        x:cx+x*Math.cos(tilt)-y*Math.sin(tilt),
        y:cy+x*Math.sin(tilt)+y*Math.cos(tilt)
    };
}

/* Dense cloud body filling the middle instead of outlining rings */
function drawV15CloudDisc(c,cx,cy) {
    const mobile=width<700;
    const count=mobile?105:190;
    const maxR=Math.max(width,height)*.50;

    for(let i=0;i<count;i++){
        const r=Math.pow(Math.random(),.68)*maxR;
        const a=random(0,Math.PI*2);
        const p=v15Point(cx,cy,r,a);
        const q=Math.random();

        let rgb;
        if(q<.26) rgb="0,38,190";
        else if(q<.52) rgb="45,0,205";
        else if(q<.78) rgb="145,0,220";
        else rgb="235,0,125";

        drawCloudBlob(
            c,p.x+random(-38,38),p.y+random(-24,24),
            random(mobile?90:120,mobile?185:245),
            random(mobile?30:40,mobile?82:105),
            rgb,random(.004,.012),random(-1.0,1.0)
        );
    }
}


/* =========================================================
   V16 INNER CLOUD MASS
   Fills the large empty gaps inside the galaxy while keeping
   some deep navy pockets for strong contrast.
========================================================= */
function drawV16InnerCloudMass(c,cx,cy) {
    const mobile = width < 700;
    const count = mobile ? 90 : 165;
    const maxR = Math.max(width,height) * .43;

    for(let i=0;i<count;i++){
        const r = Math.pow(Math.random(),.78) * maxR;
        const a = random(0,Math.PI*2);
        const p = v15Point(cx,cy,r,a);

        // Don't turn the whole center into one flat purple glow.
        if(Math.random() < .17 && r > maxR*.45) continue;

        const q = Math.random();
        let rgb;
        if(q < .28) rgb = "0,30,175";
        else if(q < .52) rgb = "35,0,215";
        else if(q < .76) rgb = "145,0,230";
        else rgb = "240,0,125";

        drawCloudBlob(
            c,
            p.x + random(-45,45),
            p.y + random(-27,27),
            random(mobile?82:105,mobile?165:220),
            random(mobile?24:32,mobile?62:82),
            rgb,
            random(.006,.016),
            random(-1.15,1.15)
        );
    }
}

/* =========================================================
   V16 ELECTRIC BLUE STREAMS
   Strong cyan/blue ribbons inspired by the reference image.
   They are intentionally broken so they look like nebula
   filaments rather than clean vector rings.
========================================================= */
function drawV16ElectricStreams(c,cx,cy) {
    const mobile = width < 700;
    const pieces = mobile ? 48 : 86;
    const maxR = Math.max(width,height) * .57;

    for(let i=0;i<pieces;i++){
        if(Math.random() < .26) continue;

        const arm = Math.floor(Math.random()*2);
        const r = random(115,maxR);
        const a = arm*Math.PI + r*.0049 + random(-.25,.25);
        const p = v15Point(cx,cy,r,a);
        const tangent = a + Math.PI/2 - .10;

        drawCloudBlob(
            c,p.x,p.y,
            random(mobile?78:100,mobile?145:190),
            random(mobile?8:11,mobile?21:29),
            "0,150,255",
            random(.050,.095),
            tangent+random(-.16,.16)
        );

        if(Math.random() < .70){
            drawCloudBlob(
                c,p.x+random(-14,14),p.y+random(-9,9),
                random(mobile?52:68,mobile?100:135),
                random(mobile?4:6,mobile?11:16),
                "0,255,255",
                random(.060,.110),
                tangent+random(-.10,.10)
            );
        }

        if(Math.random() < .32){
            drawCloudBlob(
                c,p.x+random(-9,9),p.y+random(-6,6),
                random(mobile?26:34,mobile?55:72),
                random(mobile?2.5:3.5,mobile?6:9),
                "225,255,255",
                random(.070,.125),
                tangent
            );
        }
    }
}

/* =========================================================
   V16 HOT PINK CLOUDS
   Local luminous magenta patches. Kept localized to avoid
   the pastel-purple wash seen in earlier versions.
========================================================= */
function drawV16HotPinkClouds(c,cx,cy) {
    const mobile = width < 700;
    const count = mobile ? 22 : 40;
    const maxR = Math.max(width,height) * .49;

    for(let i=0;i<count;i++){
        const arm = Math.floor(Math.random()*2);
        const r = random(100,maxR);
        const a = arm*Math.PI + r*.0049 + random(-.32,.32);
        const p = v15Point(cx,cy,r,a);
        const tangent = a + Math.PI/2 - .10;

        drawCloudBlob(
            c,p.x,p.y,
            random(mobile?100:130,mobile?190:255),
            random(mobile?28:36,mobile?68:92),
            "255,0,105",
            random(.028,.060),
            tangent+random(-.30,.30)
        );

        drawCloudBlob(
            c,p.x+random(-17,17),p.y+random(-11,11),
            random(mobile?45:58,mobile?90:122),
            random(mobile?9:12,mobile?24:34),
            "255,0,160",
            random(.038,.075),
            tangent
        );
    }
}

/* Two broad broken arms with gaps and irregular thickness */
function drawV15BrokenArms(c,cx,cy) {
    const mobile=width<700;
    const steps=mobile?76:126;
    const maxR=Math.max(width,height)*.61;

    for(let arm=0;arm<2;arm++){
        const base=arm*Math.PI;

        for(let i=0;i<steps;i++){
            if(Math.random()<.20) continue;

            const t=i/(steps-1);
            const r=45+Math.pow(t,.87)*maxR+random(-34,34);
            const a=base+r*.0049+random(-.18-t*.13,.18+t*.13);
            const p=v15Point(cx,cy,r,a);
            const tangent=a+Math.PI/2-.10;

            for(let j=0;j<(mobile?4:7);j++){
                const q=Math.random();
                const rgb=q<.30?"35,120,235":
                          q<.56?"55,0,255":
                          q<.78?"185,45,225":"255,0,105";

                drawCloudBlob(
                    c,
                    p.x+random(-72,72),
                    p.y+random(-36,36),
                    random(mobile?85:110,mobile?170:225),
                    random(mobile?22:28,mobile?58:76),
                    rgb,random(.006,.016),
                    tangent+random(-.36,.36)
                );
            }
        }
    }
}

/* White/pink luminous cloud patches like the reference */
function drawV15BrightClouds(c,cx,cy) {
    const mobile=width<700;
    const count=mobile?24:42;
    const maxR=Math.max(width,height)*.50;

    for(let i=0;i<count;i++){
        const arm=Math.floor(Math.random()*2);
        const r=random(95,maxR);
        const a=arm*Math.PI+r*.0049+random(-.34,.34);
        const p=v15Point(cx,cy,r,a);
        const tangent=a+Math.PI/2-.10;
        const pink=Math.random()<.62;

        drawCloudBlob(
            c,p.x,p.y,
            random(mobile?100:130,mobile?200:270),
            random(mobile?30:38,mobile?72:96),
            pink?"255,0,155":"0,195,255",
            random(.022,.050),tangent+random(-.28,.28)
        );

        if(Math.random()<.72){
            drawCloudBlob(
                c,p.x+random(-18,18),p.y+random(-12,12),
                random(mobile?48:62,mobile?100:135),
                random(mobile?10:13,mobile?28:38),
                pink?"255,75,205":"75,235,255",
                random(.030,.065),tangent
            );
        }
    }
}

/* Cyan broken rims, deliberately discontinuous */
function drawV15BlueRims(c,cx,cy) {
    const mobile=width<700;
    const pieces=mobile?38:70;
    const maxR=Math.max(width,height)*.58;

    for(let i=0;i<pieces;i++){
        if(Math.random()<.32) continue;
        const arm=Math.floor(Math.random()*2);
        const r=random(120,maxR);
        const a=arm*Math.PI+r*.0049+random(-.20,.20);
        const p=v15Point(cx,cy,r,a);
        const tangent=a+Math.PI/2-.10;

        drawCloudBlob(c,p.x,p.y,
            random(mobile?62:82,mobile?125:165),
            random(mobile?6:8,mobile?15:21),
            "0,245,255",random(.040,.082),tangent+random(-.13,.13));

        if(Math.random()<.36){
            drawCloudBlob(c,p.x,p.y,
                random(mobile?30:40,mobile?62:85),
                random(mobile?3:4,mobile?7:10),
                "225,255,255",random(.045,.09),tangent);
        }
    }
}

/* Large corner/edge nebulae so the scene does not feel empty */
function drawV15OuterNebula(c,cx,cy) {
    const mobile=width<700;
    const count=mobile?45:78;

    for(let i=0;i<count;i++){
        let x,y;
        const side=Math.floor(Math.random()*4);
        if(side===0){x=random(-width*.08,width*1.08);y=random(-height*.10,height*.24);}
        else if(side===1){x=random(-width*.08,width*1.08);y=random(height*.76,height*1.10);}
        else if(side===2){x=random(-width*.10,width*.22);y=random(0,height);}
        else{x=random(width*.78,width*1.10);y=random(0,height);}

        const q=Math.random();
        const rgb=q<.34?"0,28,145":q<.68?"75,0,190":"205,0,115";

        drawCloudBlob(c,x,y,
            random(mobile?135:175,mobile?270:360),
            random(mobile?45:58,mobile?115:150),
            rgb,random(.003,.009),random(-1.1,1.1));
    }
}


/* =========================================================
   V18 MINI GALAXIES — HIGHER QUALITY
   4–5 larger mini galaxies with real glowing cores,
   cloudy arms, dust, and soft halo.
========================================================= */

function drawV18MiniGalaxies(c,cx,cy) {
    const mobile = width < 700;

    const spots = mobile
        ? [
            [0.22,0.27,0.72,-0.18],
            [0.78,0.28,0.82,0.22],
            [0.72,0.58,0.62,-0.28],
            [0.28,0.58,0.58,0.18]
        ]
        : [
            [0.20,0.28,0.82,-0.18],
            [0.80,0.26,0.94,0.18],
            [0.72,0.57,0.72,-0.30],
            [0.28,0.58,0.66,0.22],
            [0.88,0.68,0.70,-0.12]
        ];

    for(const s of spots){
        const x = width*s[0] + random(-18,18);
        const y = height*s[1] + random(-14,14);
        drawV18MiniGalaxy(c,x,y,s[2],s[3]);
    }
}

function drawV18MiniGalaxy(c,x,y,scale,rotation) {
    c.save();
    c.translate(x,y);
    c.rotate(rotation);
    c.globalCompositeOperation = "screen";

    const R = 58 * scale;

    // Wide aura
    drawSoftGlow(c,0,0,R*2.2,"15,15,210",0.11);
    drawSoftGlow(c,0,0,R*1.35,"195,0,255",0.14);
    drawSoftGlow(c,0,0,R*.62,"255,20,175",0.20);

    // Cloudy spiral arms
    const arms = 2;
    const steps = 32;

    for(let arm=0; arm<arms; arm++){
        const base = arm*Math.PI;

        for(let i=0;i<steps;i++){
            const t = i/(steps-1);
            if(Math.random()<.12) continue;

            const r = 8 + t*R;
            const a = base + r*.105 + random(-.16,.16);

            const px = Math.cos(a)*r;
            const py = Math.sin(a)*r*.42;

            const tangent = a + Math.PI/2;

            const q = Math.random();
            let rgb;
            if(q<.38) rgb="0,195,255";
            else if(q<.70) rgb="170,30,255";
            else rgb="255,10,170";

            drawCloudBlob(
                c,
                px,py,
                random(10,20)*scale,
                random(3.5,7)*scale,
                rgb,
                random(.030,.070),
                tangent
            );

            if(i%3===0){
                drawCloudBlob(
                    c,
                    px,py,
                    random(6,12)*scale,
                    random(1.6,3.4)*scale,
                    Math.random()<.5 ? "50,245,255" : "255,70,205",
                    random(.045,.090),
                    tangent
                );
            }
        }
    }

    // Dust stars
    const dust = 260;

    for(let i=0;i<dust;i++){
        const arm = i%2;
        const t = Math.pow(Math.random(),.74);
        const r = 6 + t*R;
        const a = arm*Math.PI + r*.105 + random(-.28,.28);

        const px = Math.cos(a)*r + random(-3,3);
        const py = Math.sin(a)*r*.42 + random(-2,2);

        const q = Math.random();
        if(q<.40){
            c.fillStyle=`rgba(120,210,255,${random(.25,.82)})`;
        }else if(q<.74){
            c.fillStyle=`rgba(230,155,255,${random(.25,.84)})`;
        }else{
            c.fillStyle=`rgba(255,175,225,${random(.28,.86)})`;
        }

        c.beginPath();
        c.arc(px,py,random(.25,1.15)*scale,0,Math.PI*2);
        c.fill();
    }

    // Bright core
    drawSoftGlow(c,0,0,R*.48,"255,20,175",0.34);
    drawSoftGlow(c,0,0,R*.24,"255,215,235",0.58);
    drawSoftGlow(c,0,0,R*.10,"255,250,225",0.88);

    c.restore();
}

/* =========================================================
   V18 NEBULA CLUSTERS
   Large irregular cloud clusters placed in empty pockets.
========================================================= */

function drawV18NebulaClusters(c,cx,cy) {
    const mobile = width < 700;

    const zones = mobile
        ? [
            [0.14,0.18,1.0],
            [0.50,0.13,.9],
            [0.86,0.18,1.0],
            [0.14,0.62,.95],
            [0.50,0.66,.95],
            [0.86,0.58,.9]
        ]
        : [
            [0.10,0.16,1.15],
            [0.32,0.12,1.0],
            [0.55,0.14,.95],
            [0.82,0.15,1.15],
            [0.12,0.56,1.10],
            [0.34,0.64,1.00],
            [0.62,0.62,1.05],
            [0.86,0.56,1.05]
        ];

    for(const z of zones){
        const x = width*z[0] + random(-35,35);
        const y = height*z[1] + random(-25,25);

        const dx=(x-cx)/(width*.18);
        const dy=(y-cy)/(height*.16);
        if(dx*dx+dy*dy<1) continue;

        drawV18NebulaCluster(c,x,y,z[2]);
    }
}

function drawV18NebulaCluster(c,x,y,scale) {
    c.save();
    c.globalCompositeOperation="screen";

    const palette = Math.random();

    let c1,c2,c3;
    if(palette<.34){
        c1="0,115,255";
        c2="45,15,255";
        c3="195,0,255";
    }else if(palette<.68){
        c1="20,20,250";
        c2="175,0,255";
        c3="255,0,135";
    }else{
        c1="0,175,255";
        c2="140,0,255";
        c3="255,0,160";
    }

    // big soft base
    drawCloudBlob(
        c,x,y,
        random(120,175)*scale,
        random(45,70)*scale,
        c2,
        random(.012,.025),
        random(-1.0,1.0)
    );

    // layered broken clouds
    const pieces = 10;

    for(let i=0;i<pieces;i++){
        const ang = random(0,Math.PI*2);
        const dist = random(12,70)*scale;

        const px=x+Math.cos(ang)*dist;
        const py=y+Math.sin(ang)*dist*.55;

        const pick=Math.random();
        const rgb=pick<.34?c1:pick<.67?c2:c3;

        drawCloudBlob(
            c,
            px,py,
            random(40,85)*scale,
            random(14,32)*scale,
            rgb,
            random(.018,.050),
            random(-1.0,1.0)
        );
    }

    // small luminous core knot
    if(Math.random()<.60){
        drawSoftGlow(
            c,
            x+random(-25,25),
            y+random(-18,18),
            random(28,50)*scale,
            Math.random()<.5 ? "120,220,255" : "255,145,220",
            random(.22,.42)
        );
    }

    // fine dust
    for(let i=0;i<180;i++){
        const ang=random(0,Math.PI*2);
        const rr=Math.pow(Math.random(),.72)*95*scale;
        const px=x+Math.cos(ang)*rr;
        const py=y+Math.sin(ang)*rr*.55;

        const q=Math.random();
        if(q<.4){
            c.fillStyle=`rgba(120,210,255,${random(.12,.62)})`;
        }else if(q<.75){
            c.fillStyle=`rgba(225,150,255,${random(.12,.66)})`;
        }else{
            c.fillStyle=`rgba(255,165,225,${random(.14,.68)})`;
        }

        c.beginPath();
        c.arc(px,py,random(.2,.9)*scale,0,Math.PI*2);
        c.fill();
    }

    c.restore();
}

/* Dense multicolor dust gives texture without frame-by-frame cost */
function drawV15Dust(c,cx,cy) {
    const amount=width<700?5200:10500;
    const maxR=Math.max(width,height)*.64;

    for(let i=0;i<amount;i++){
        const arm=Math.floor(Math.random()*2);
        const t=Math.pow(Math.random(),.60);
        const r=20+t*maxR;
        const a=arm*Math.PI+r*.0049+random(-.25-t*.42,.25+t*.42);
        const p=v15Point(cx,cy,r,a);

        const x=p.x+random(-38,38);
        const y=p.y+random(-24,24);
        const q=Math.random();
        const bright=Math.random()<.065;

        if(q<.38)
            c.fillStyle=`rgba(${random(45,115)},${random(175,240)},255,${bright?random(.6,.98):random(.08,.50)})`;
        else if(q<.72)
            c.fillStyle=`rgba(${random(175,235)},${random(60,130)},255,${bright?random(.6,.98):random(.08,.50)})`;
        else
            c.fillStyle=`rgba(255,${random(75,150)},${random(185,235)},${bright?random(.6,.98):random(.08,.52)})`;

        c.beginPath();
        c.arc(x,y,bright?random(.85,2.1):random(.12,.78),0,Math.PI*2);
        c.fill();
    }
}

function drawV15Core(c,cx,cy) {
    drawSoftGlow(c,cx,cy,width<700?230:330,"45,80,245",.14);
    drawSoftGlow(c,cx,cy,width<700?180:260,"185,35,250",.24);
    drawSoftGlow(c,cx,cy,width<700?132:190,"255,40,180",.31);
    drawSoftGlow(c,cx,cy,width<700?88:128,"255,190,215",.25);

    const clouds=width<700?30:52;
    for(let i=0;i<clouds;i++){
        const a=random(0,Math.PI*2);
        const r=random(width<700?85:105,width<700?175:245);
        const p=v15Point(cx,cy,r,a);
        const q=Math.random();
        const rgb=q<.34?"30,190,255":q<.68?"210,55,255":"255,80,185";

        drawCloudBlob(c,p.x,p.y,
            random(70,140),random(15,38),rgb,
            random(.018,.045),a+Math.PI/2-.10);
    }

    const stars=width<700?340:680;
    for(let i=0;i<stars;i++){
        const a=Math.random()*Math.PI*2;
        const r=random(82,width<700?165:230);
        const p=v15Point(cx,cy,r,a);
        c.fillStyle=`rgba(255,${random(195,250)},${random(220,255)},${random(.20,.72)})`;
        c.beginPath();
        c.arc(p.x,p.y,Math.random()<.07?random(.9,1.9):random(.2,1.0),0,Math.PI*2);
        c.fill();
    }
}



/* =========================================================
   V21 DENSE NEBULA TEXTURE
   Static only: adds cloud knots and luminous dust lanes
   without increasing per-frame particle work.
========================================================= */
function drawV22DenseNebula(c, cx, cy) {
    c.save();
    c.globalCompositeOperation = "screen";

    const mobile = width < 700;

    /*
       V22:
       No stroke() spiral ribbons at all.
       Everything is cloud blobs + dust only, so there are
       no giant black/purple rings crossing the whole screen.
    */

    const cloudCount = mobile ? 62 : 118;

    for (let i = 0; i < cloudCount; i++) {
        const arm = i % 4;
        const t = random(.18, 1.0);

        const a =
            arm * Math.PI / 2 +
            t * 5.05 +
            random(-.34, .34);

        const rx = width * (.10 + t * .40);
        const ry = height * (.06 + t * .27);

        const x =
            cx +
            Math.cos(a) * rx +
            random(-55, 55);

        const y =
            cy +
            Math.sin(a) * ry +
            random(-34, 34);

        const palette = Math.random();

        let rgb;
        if (palette < .28) rgb = "0,145,255";
        else if (palette < .52) rgb = "80,25,255";
        else if (palette < .76) rgb = "190,15,255";
        else rgb = "255,5,155";

        const r = random(
            mobile ? 42 : 56,
            mobile ? 98 : 150
        );

        drawCloudBlob(
            c,
            x,
            y,
            r * random(1.1, 1.8),
            r * random(.32, .62),
            rgb,
            random(.010, .030),
            random(-1.0, 1.0)
        );

        /*
           Small brighter cloud knot inside some blobs.
        */
        if (Math.random() < .48) {
            const hotRgb =
                palette < .28
                    ? "70,220,255"
                    : palette < .76
                        ? "205,100,255"
                        : "255,90,190";

            drawCloudBlob(
                c,
                x + random(-18, 18),
                y + random(-12, 12),
                r * random(.45, .85),
                r * random(.13, .28),
                hotRgb,
                random(.020, .050),
                random(-1.0, 1.0)
            );
        }
    }

    /*
       Dense dust follows the arms, but because these are just
       tiny points, they create texture instead of vector rings.
    */
    const dust = mobile ? 1500 : 3400;

    for (let i = 0; i < dust; i++) {
        const arm = i % 4;
        const t = Math.pow(Math.random(), .78);

        const a =
            arm * Math.PI / 2 +
            t * 5.05 +
            random(-.22, .22);

        const rx = width * (.08 + t * .43);
        const ry = height * (.045 + t * .30);

        const x =
            cx +
            Math.cos(a) * rx +
            random(-26, 26);

        const y =
            cy +
            Math.sin(a) * ry +
            random(-18, 18);

        const k = i % 6;

        c.fillStyle =
            k === 0
                ? `rgba(0,220,255,${random(.10,.36)})`
                : k === 1
                    ? `rgba(255,20,180,${random(.10,.36)})`
                    : k === 2
                        ? `rgba(175,65,255,${random(.10,.32)})`
                        : `rgba(255,225,255,${random(.07,.22)})`;

        const size = random(.32, 1.18);

        c.fillRect(
            x,
            y,
            size,
            size
        );
    }

    /*
       Extra irregular nebula pockets in empty zones.
       These are not tied to a clean spiral.
    */
    const pockets = mobile ? 16 : 28;

    for (let i = 0; i < pockets; i++) {
        const x = random(width * .07, width * .93);
        const y = random(height * .08, height * .76);

        const dx = (x - cx) / (width * .18);
        const dy = (y - cy) / (height * .17);

        if (dx * dx + dy * dy < 1 && Math.random() < .78) {
            continue;
        }

        const q = Math.random();

        const rgb =
            q < .34
                ? "0,110,235"
                : q < .68
                    ? "120,10,230"
                    : "235,5,165";

        drawCloudBlob(
            c,
            x,
            y,
            random(
                mobile ? 70 : 95,
                mobile ? 135 : 190
            ),
            random(
                mobile ? 24 : 32,
                mobile ? 58 : 78
            ),
            rgb,
            random(.006, .018),
            random(-1.0, 1.0)
        );
    }

    c.restore();
}



/* =========================================================
   V23 POCKET DETAILS
   Adds compact nebula knots, richer blue/pink dust and a few
   varied micro-galaxies into dark gaps without drawing rings.
   Static layer only, so animation performance stays light.
========================================================= */
function drawV23PocketDetails(c, cx, cy) {
    c.save();
    c.globalCompositeOperation = "screen";
    const mobile = width < 700;

    // Carefully placed pockets: mostly between the large arms.
    const zones = mobile ? [
        [.18,.18,.75], [.82,.17,.72], [.17,.52,.70], [.82,.52,.68],
        [.34,.15,.58], [.68,.14,.58]
    ] : [
        [.11,.18,.90], [.29,.13,.72], [.49,.12,.64], [.69,.14,.72], [.88,.19,.88],
        [.12,.52,.82], [.29,.61,.72], [.52,.61,.68], [.73,.57,.76], [.89,.54,.80]
    ];

    for (const [nx,ny,scale] of zones) {
        const x = width*nx + random(-28,28);
        const y = height*ny + random(-20,20);
        const dx=(x-cx)/(width*.17), dy=(y-cy)/(height*.15);
        if (dx*dx+dy*dy < 1.05) continue;

        const palette=Math.random();
        const base = palette<.34 ? "0,105,255" : palette<.68 ? "125,15,255" : "245,0,160";
        const hot  = palette<.34 ? "45,215,255" : palette<.68 ? "205,75,255" : "255,75,195";

        // Irregular nebula clump made from overlapping soft blobs.
        for(let j=0;j<(mobile?4:7);j++){
            drawCloudBlob(c,
                x+random(-55,55)*scale, y+random(-30,30)*scale,
                random(55,115)*scale, random(16,40)*scale,
                j%3===0?hot:base, random(.012,.035), random(-1.1,1.1));
        }
        if(Math.random()<.72) drawSoftGlow(c,x,y,random(28,55)*scale,hot,random(.10,.22));

        // Local jewel-like dust, denser than the old empty pockets.
        const n=mobile?80:145;
        for(let j=0;j<n;j++){
            const a=Math.random()*Math.PI*2;
            const rr=Math.pow(Math.random(),.62)*105*scale;
            const px=x+Math.cos(a)*rr;
            const py=y+Math.sin(a)*rr*.48;
            const q=Math.random();
            c.fillStyle=q<.34?`rgba(55,205,255,${random(.18,.62)})`:
                        q<.70?`rgba(205,95,255,${random(.16,.58)})`:
                               `rgba(255,100,205,${random(.18,.62)})`;
            const z=Math.random()<.06?random(1.0,1.8):random(.25,.85);
            c.fillRect(px,py,z,z);
        }
    }

    // A few extra micro galaxies with varied size/rotation, not evenly spaced.
    const minis = mobile ? [
        [.24,.31,.48,-.35], [.76,.34,.52,.24], [.67,.55,.42,-.18]
    ] : [
        [.16,.35,.48,-.32], [.39,.20,.42,.18], [.61,.19,.46,-.15],
        [.84,.36,.52,.28], [.61,.55,.40,.18], [.38,.55,.43,-.25]
    ];
    for(const m of minis){
        const x=width*m[0]+random(-12,12), y=height*m[1]+random(-10,10);
        const dx=(x-cx)/(width*.16), dy=(y-cy)/(height*.14);
        if(dx*dx+dy*dy<1.0) continue;
        drawV23MicroGalaxy(c,x,y,m[2],m[3]);
    }
    c.restore();
}

function drawV23MicroGalaxy(c,x,y,scale,rotation){
    c.save();
    c.translate(x,y); c.rotate(rotation);
    c.globalCompositeOperation="screen";
    const R=44*scale;
    drawSoftGlow(c,0,0,R*1.5,"120,35,255",.10);
    drawSoftGlow(c,0,0,R*.65,"255,20,180",.18);

    for(let arm=0;arm<2;arm++){
        for(let i=0;i<22;i++){
            const t=i/21, r=4+t*R, a=arm*Math.PI+r*.13+random(-.18,.18);
            const px=Math.cos(a)*r, py=Math.sin(a)*r*.38;
            const rgb=i%3===0?"40,210,255":i%3===1?"190,65,255":"255,65,190";
            drawCloudBlob(c,px,py,random(5,10)*scale,random(1.4,3.2)*scale,rgb,random(.025,.060),a+Math.PI/2);
        }
    }
    for(let i=0;i<115;i++){
        const arm=i%2, r=random(3,R), a=arm*Math.PI+r*.13+random(-.30,.30);
        const px=Math.cos(a)*r, py=Math.sin(a)*r*.38;
        c.fillStyle=i%3===0?`rgba(80,220,255,${random(.25,.72)})`:
                    i%3===1?`rgba(220,130,255,${random(.22,.70)})`:
                              `rgba(255,150,220,${random(.24,.72)})`;
        c.beginPath(); c.arc(px,py,random(.25,.8)*scale,0,Math.PI*2); c.fill();
    }
    drawSoftGlow(c,0,0,R*.28,"255,180,235",.48);
    drawSoftGlow(c,0,0,R*.10,"255,250,235",.82);
    c.restore();
}


/* =========================================================
   V24 MEGA NEBULAE
   Large glowing nebula structures for the empty arm gaps.
   Static-only, so they do not add per-frame animation cost.
========================================================= */
function drawV24MegaNebulae(c, cx, cy) {
    c.save();
    c.globalCompositeOperation = "screen";

    const mobile = width < 700;

    const zones = mobile ? [
        [0.16,0.22,1.00],
        [0.78,0.18,1.00],
        [0.18,0.56,0.95],
        [0.76,0.55,0.95],
        [0.50,0.13,0.85]
    ] : [
        [0.08,0.15,1.65],
        [0.29,0.10,1.55],
        [0.53,0.10,1.45],
        [0.79,0.14,1.65],
        [0.92,0.34,1.45],
        [0.11,0.58,1.60],
        [0.32,0.65,1.40],
        [0.68,0.63,1.45],
        [0.89,0.57,1.55]
    ];

    for (const z of zones) {
        const x = width * z[0] + random(-45,45);
        const y = height * z[1] + random(-35,35);
        const scale = z[2];

        const dx = (x-cx)/(width*.20);
        const dy = (y-cy)/(height*.18);
        if (dx*dx + dy*dy < .85) continue;

        drawV24MegaNebulaCluster(c,x,y,scale);
    }

    c.restore();
}

function drawV24MegaNebulaCluster(c, x, y, scale) {
    const pick = Math.random();
    let deep, mid, hot, cool;

    if (pick < .34) {
        deep = "0,35,155";
        mid  = "35,120,235";
        hot  = "125,225,255";
        cool = "40,65,255";
    } else if (pick < .68) {
        deep = "65,0,155";
        mid  = "145,15,255";
        hot  = "230,105,255";
        cool = "30,100,255";
    } else {
        deep = "105,0,125";
        mid  = "225,0,165";
        hot  = "245,85,195";
        cool = "85,45,255";
    }

    // V25: one broad cloud field made from overlapping lobes.
    // Much larger than V24 and deliberately irregular.
    const rotation = random(-1.05, 1.05);
    const lobes = 22;

    for (let i = 0; i < lobes; i++) {
        const u = random(-1, 1);
        const spreadX = 230 * scale;
        const spreadY = 82 * scale;

        const px = x + u * spreadX + random(-75, 75) * scale;
        const py = y + Math.sin(u * 4.4 + random(-.7,.7)) * 38 * scale
                     + random(-62, 62) * scale;

        const edge = Math.abs(u);
        const rgb =
            Math.random() < .28 ? cool :
            Math.random() < .62 ? mid : deep;

        drawCloudBlob(
            c, px, py,
            random(150, 300) * scale * (1 - edge * .18),
            random(60, 125) * scale,
            rgb,
            random(.010, .028),
            rotation + random(-.34,.34)
        );
    }

    // Bright embedded cloud ridges.
    for (let i = 0; i < 10; i++) {
        const px = x + random(-205,205) * scale;
        const py = y + random(-75,75) * scale;
        drawCloudBlob(
            c, px, py,
            random(95,185) * scale,
            random(28,68) * scale,
            Math.random() < .5 ? hot : mid,
            random(.014,.038),
            rotation + random(-.45,.45)
        );
    }

    // Soft internal luminous knots, blurred into the cloud instead of isolated balls.
    for(let i=0;i<5;i++){
        drawSoftGlow(
            c,
            x + random(-175,175)*scale,
            y + random(-62,62)*scale,
            random(55,105)*scale,
            Math.random()<.55 ? hot : cool,
            random(.12,.28)
        );
    }

    // Dense embedded dust field.
    for(let i=0;i<620;i++){
        const u = random(-1,1);
        const px = x + u*260*scale + random(-65,65)*scale;
        const py = y + Math.sin(u*4.2)*42*scale + random(-82,82)*scale;

        const q = Math.random();
        c.fillStyle =
            q < .30 ? `rgba(65,195,255,${random(.08,.42)})` :
            q < .68 ? `rgba(205,90,255,${random(.08,.46)})` :
                      `rgba(255,90,195,${random(.08,.44)})`;

        const s = random(.25,1.15)*scale;
        c.fillRect(px,py,s,s);
    }
}

/* =========================================================
   V24 LARGE DUST CLOUDS
   Big smoky dust patches with luminous edges.
========================================================= */
function drawV24DustClouds(c, cx, cy) {
    c.save();

    const mobile = width < 700;
    const count = mobile ? 8 : 13;

    for(let i=0;i<count;i++){
        const a = random(0,Math.PI*2);
        const rr = random(Math.min(width,height)*.18, Math.max(width,height)*.55);

        const x = cx + Math.cos(a)*rr + random(-55,55);
        const y = cy + Math.sin(a)*rr*.42 + random(-35,35);

        const dx = (x-cx)/(width*.18);
        const dy = (y-cy)/(height*.17);
        if(dx*dx+dy*dy < 1) continue;

        // Dark smoky mass
        c.save();
        c.globalCompositeOperation = "source-over";
        drawCloudBlob(
            c,x,y,
            random(130,220),
            random(48,95),
            "0,0,18",
            random(.050,.105),
            random(-1.0,1.0)
        );
        c.restore();

        // Colored rim around dust mass
        c.save();
        c.globalCompositeOperation = "screen";
        const rgb = Math.random()<.5 ? "0,165,255" : "240,20,190";
        drawCloudBlob(
            c,
            x+random(-18,18),
            y+random(-12,12),
            random(150,245),
            random(55,105),
            rgb,
            random(.006,.018),
            random(-1.0,1.0)
        );
        c.restore();
    }

    c.restore();
}

/* =========================================================
   V24 CLOUD MASSES
   Large fluffy cloud bodies to make the galaxy feel dense,
   not like thin ribbons.
========================================================= */
function drawV24CloudMasses(c, cx, cy) {
    c.save();

    // V28 — compact but dense cloud complexes.
    // Keep dark space between clouds instead of covering the whole scene.
    const groups = [
        [-0.36,-0.28,1.12,-0.28,0],
        [ 0.34,-0.27,1.18, 0.22,1],
        [-0.43, 0.14,1.00, 0.34,2],
        [ 0.40, 0.14,1.05,-0.34,0],
        [-0.08,-0.12,0.80, 0.08,1],
        [ 0.13, 0.23,0.76,-0.12,2]
    ];

    const count = width < 700 ? 4 : groups.length;

    for (let i=0;i<count;i++) {
        const [nx,ny,s,a,p] = groups[i];
        drawV28DenseNebula(
            c,
            cx + width*nx,
            cy + height*ny,
            s*Math.min(width/1780,1.18),
            a,p
        );
    }
    c.restore();
}

function drawV28DenseNebula(c,x,y,scale,angle,palette) {
    const palettes = [
        {base:"45,4,105",violet:"115,12,205",pink:"255,25,185",blue:"20,100,255",cyan:"20,220,255"},
        {base:"20,10,105",violet:"78,25,220",pink:"225,30,245",blue:"15,110,255",cyan:"40,205,255"},
        {base:"65,4,95",violet:"150,12,190",pink:"255,48,160",blue:"25,100,235",cyan:"35,190,255"}
    ];
    const p = palettes[palette%3];

    c.save();
    c.translate(x,y);
    c.rotate(angle);
    c.globalCompositeOperation = "screen";

    // Dense purple body made from overlapping puffs.
    for(let i=0;i<14;i++){
        const t=random(-1,1);
        const px=t*155*scale+random(-34,34)*scale;
        const py=Math.sin(t*3)*25*scale+random(-38,38)*scale;
        drawCloudBlob(c,px,py,
            random(100,175)*scale,random(42,78)*scale,
            i%3===0?p.base:p.violet,
            random(.032,.070),random(-.32,.32));
    }

    // Bright puffy cells.
    for(let i=0;i<12;i++){
        drawCloudBlob(c,
            random(-145,145)*scale,random(-52,52)*scale,
            random(62,112)*scale,random(26,52)*scale,
            Math.random()<.58?p.pink:p.violet,
            random(.060,.125),random(-.42,.42));
    }

    // Dark lanes/cavities = stronger 3D cloud structure.
    c.globalCompositeOperation="source-over";
    for(let i=0;i<11;i++){
        drawCloudBlob(c,
            random(-145,145)*scale,random(-47,47)*scale,
            random(48,92)*scale,random(17,35)*scale,
            "0,1,14",random(.095,.185),random(-.60,.60));
    }

    // Electric cyan/blue/pink rims.
    c.globalCompositeOperation="screen";
    for(let i=0;i<16;i++){
        const q=Math.random();
        drawCloudBlob(c,
            random(-160,160)*scale,random(-58,58)*scale,
            random(48,98)*scale,random(6,15)*scale,
            q<.42?p.cyan:q<.72?p.blue:p.pink,
            random(.075,.155),random(-.28,.28));
    }

    // Wispy filaments.
    for(let i=0;i<13;i++){
        drawCloudBlob(c,
            random(-170,170)*scale,random(-62,62)*scale,
            random(75,135)*scale,random(3.5,8)*scale,
            Math.random()<.52?p.cyan:p.pink,
            random(.055,.130),random(-.20,.20));
    }

    // Dense embedded dust.
    const dust=width<700?250:720;
    for(let i=0;i<dust;i++){
        const dx=random(-180,180)*scale;
        const dy=random(-65,65)*scale;
        const e=(dx*dx)/(180*180*scale*scale)+(dy*dy)/(65*65*scale*scale);
        if(e>1 || Math.random()>1-e*.42) continue;

        const q=Math.random();
        c.fillStyle=q<.28
            ?`rgba(55,220,255,${random(.15,.60)})`
            :q<.64
            ?`rgba(190,85,255,${random(.14,.62)})`
            :`rgba(255,70,190,${random(.14,.66)})`;
        const s=random(.35,1.65);
        c.fillRect(dx,dy,s,s);
    }

    // Luminous knots.
    for(let i=0;i<5;i++){
        const kx=random(-135,135)*scale, ky=random(-43,43)*scale;
        const r=random(13,26)*scale;
        const g=c.createRadialGradient(kx,ky,0,kx,ky,r);
        g.addColorStop(0,"rgba(255,255,255,.46)");
        g.addColorStop(.12,"rgba(255,175,245,.32)");
        g.addColorStop(.42,"rgba(210,55,255,.13)");
        g.addColorStop(1,"rgba(80,15,180,0)");
        c.fillStyle=g;
        c.beginPath(); c.arc(kx,ky,r,0,Math.PI*2); c.fill();
    }

    c.restore();
}

/* =========================================================
   V29 ULTRA DENSE NEBULA — giant clouds, chunky dust, dark cavities
========================================================= */


/* =========================================================
   V32 TRUE CLOUD NEBULA
   Large fluffy nebula masses with dark cavities and chunky dust.
   No long neon ribbons. Static layer only.
========================================================= */


/* =========================================================
   V32.7 CLOUDY SPIRAL GALAXY
   Broad spiral arms made from cloud blobs + dust particles.
   NO visible line strokes.
========================================================= */



function drawV325SpiralGalaxy(c, cx, cy) {
    c.save();

    const mobile = width < 700;
    const sceneScale = Math.min(width / 1780, 1.15);
    const maxDim = Math.max(width, height);
    const tilt = -0.075;
    const flatten = 0.39;

    function point(r, a) {
        const ex = Math.cos(a) * r;
        const ey = Math.sin(a) * r * flatten;
        return {
            x: cx + ex * Math.cos(tilt) - ey * Math.sin(tilt),
            y: cy + ex * Math.sin(tilt) + ey * Math.cos(tilt)
        };
    }

    function normal(a) {
        return {
            x: Math.cos(a + Math.PI / 2),
            y: Math.sin(a + Math.PI / 2) * flatten
        };
    }

    c.globalCompositeOperation = "screen";

    // V37: richer body, but keep the V36/V35 composition and saturation.
    drawSoftGlow(c, cx, cy, (mobile ? 260 : 405) * sceneScale, "55,80,235", .13);
    drawSoftGlow(c, cx, cy, (mobile ? 205 : 315) * sceneScale, "175,45,235", .15);
    drawSoftGlow(c, cx, cy, (mobile ? 135 : 205) * sceneScale, "245,55,185", .14);

    const ARM_COUNT = 3;
    const TURNS = Math.PI * 3.35;
    const INNER = (mobile ? 42 : 58) * sceneScale;
    const OUTER = maxDim * (mobile ? .54 : .59) * sceneScale;

    // 1) Main fluffy arm body: several overlapping cloud scales make the
    // spiral look like real nebula instead of one smooth luminous stripe.
    for (let arm = 0; arm < ARM_COUNT; arm++) {
        const phase = arm * Math.PI * 2 / ARM_COUNT;
        const steps = mobile ? 72 : 132;

        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);
            const gap = Math.sin(t * 23 + arm * 2.7) + .52 * Math.sin(t * 49 + arm * 1.4);
            if (t > .16 && gap > 1.14 && Math.random() < .78) continue;

            const a = phase - .70 + t * TURNS + .10 * Math.sin(t * 9 + arm);
            const r = INNER + Math.pow(t, .91) * (OUTER - INNER);
            const p = point(r, a);
            const n = normal(a);
            const armWidth = (25 + t * (mobile ? 50 : 80)) * sceneScale;
            const side = random(-.82, .82);
            const px = p.x + n.x * side * armWidth + random(-13, 13) * sceneScale;
            const py = p.y + n.y * side * armWidth + random(-9, 9) * sceneScale;

            const q = (t * 3.6 + arm * .29 + Math.random() * .42) % 1;
            const rgb = q < .22 ? "25,125,245" :
                        q < .43 ? "55,75,235" :
                        q < .69 ? "165,50,235" : "240,45,175";

            drawCloudBlob(c, px, py,
                random(64, 136) * sceneScale * (1 + t * .28),
                random(30, 68) * sceneScale * (1 + t * .20),
                rgb, random(.026, .064),
                a + Math.PI / 2 + random(-.42, .42));

            // Smaller cloudy fragments around the large lobe.
            const fragments = mobile ? 1 : 2;
            for (let f = 0; f < fragments; f++) {
                if (Math.random() < .25) continue;
                const hot = Math.random() < .34 ? "65,215,255" :
                            Math.random() < .55 ? "205,85,250" : "255,75,190";
                drawCloudBlob(c,
                    px + random(-34,34) * sceneScale,
                    py + random(-20,20) * sceneScale,
                    random(20,58) * sceneScale,
                    random(8,25) * sceneScale,
                    hot, random(.040,.095),
                    a + Math.PI/2 + random(-.65,.65));
            }
        }
    }

    // 2) Broken cyan / violet / pink ridges. Short, irregular and offset.
    const ridges = mobile ? 62 : 138;
    for (let i = 0; i < ridges; i++) {
        const arm = i % ARM_COUNT;
        const phase = arm * Math.PI * 2 / ARM_COUNT;
        const t = random(.08,.99);
        const a = phase - .70 + t*TURNS + .10*Math.sin(t*9+arm);
        const r = INNER + Math.pow(t,.91)*(OUTER-INNER);
        const p = point(r,a);
        const n = normal(a);
        const spread = (12 + t*(mobile?45:70))*sceneScale;
        const off = random(-.9,.9)*spread;
        const x = p.x+n.x*off+random(-14,14)*sceneScale;
        const y = p.y+n.y*off+random(-9,9)*sceneScale;
        const hot = i%4===0 ? "75,225,255" : i%4===1 ? "75,145,250" : i%4===2 ? "215,90,250" : "255,85,195";

        drawCloudBlob(c,x,y,
            random(32,88)*sceneScale,
            random(8,24)*sceneScale,
            hot,random(.055,.125),
            a+Math.PI/2+random(-.52,.52));

        if(Math.random()<.32)
            drawSoftGlow(c,x,y,random(12,28)*sceneScale,hot,random(.06,.13));
    }

    // 3) Chunky nebula knots give the arms cloud detail at a glance.
    const clumps = mobile ? 110 : 245;
    for (let i=0; i<clumps; i++) {
        const arm = i % ARM_COUNT;
        const phase = arm * Math.PI*2/ARM_COUNT;
        const t = random(.07,.995);
        const a = phase-.70+t*TURNS+.13*Math.sin(t*13+arm*1.7);
        const r = INNER+Math.pow(t,.91)*(OUTER-INNER);
        const p=point(r,a), n=normal(a);
        const spread=(14+t*(mobile?48:76))*sceneScale;
        const off=random(-1,1)*spread;
        const x=p.x+n.x*off+random(-22,22)*sceneScale;
        const y=p.y+n.y*off+random(-14,14)*sceneScale;
        const pick=Math.random();
        const rgb=pick<.24?"40,205,255":pick<.48?"45,100,235":pick<.74?"190,60,240":"245,55,180";
        drawCloudBlob(c,x,y,
            random(24,82)*sceneScale,
            random(12,40)*sceneScale,
            rgb,random(.045,.110),
            a+Math.PI/2+random(-.8,.8));
    }

    // 4) Dense multicolour dust. Two scales: tiny dust + jewel highlights.
    const dustCount = mobile ? 6800 : 18800;
    for (let i=0;i<dustCount;i++) {
        const arm=Math.floor(Math.random()*ARM_COUNT);
        const phase=arm*Math.PI*2/ARM_COUNT;
        const t=Math.pow(Math.random(),.82);
        const a=phase-.70+t*TURNS+.10*Math.sin(t*9+arm)+random(-.045,.045);
        const r=INNER+Math.pow(t,.91)*(OUTER-INNER);
        const p=point(r,a), n=normal(a);
        const spread=(11+t*(mobile?56:88))*sceneScale;
        const edgeBias=Math.random()<.54 ? (Math.random()<.5?-1:1)*random(.28,1) : random(-.62,.62);
        const x=p.x+n.x*edgeBias*spread+random(-8,8);
        const y=p.y+n.y*edgeBias*spread+random(-6,6);
        const q=Math.random(), bright=Math.random()<.052;
        const alpha=bright?random(.55,.94):random(.10,.58);
        c.fillStyle=q<.23?`rgba(70,220,255,${alpha})`:
                    q<.46?`rgba(65,135,245,${alpha})`:
                    q<.73?`rgba(205,85,250,${alpha})`:
                            `rgba(255,80,195,${alpha})`;
        const sz=bright?random(.9,1.9):random(.18,.82);
        c.fillRect(x,y,sz,sz);
    }

    // 5) Dark lanes: fewer and more irregular than V34 so they create
    // depth without looking like clean black spiral lines.
    c.globalCompositeOperation="source-over";
    const lanes=mobile?82:175;
    for(let i=0;i<lanes;i++){
        const arm=i%ARM_COUNT;
        const phase=arm*Math.PI*2/ARM_COUNT;
        const t=random(.15,.98);
        if(Math.random()<.18) continue;
        const a=phase-.70+t*TURNS+.10*Math.sin(t*9+arm);
        const r=INNER+Math.pow(t,.91)*(OUTER-INNER);
        const p=point(r,a), n=normal(a);
        const side=(Math.random()<.5?-1:1)*(25+t*62)*sceneScale;
        drawCloudBlob(c,
            p.x+n.x*side+random(-24,24)*sceneScale,
            p.y+n.y*side+random(-14,14)*sceneScale,
            random(36,92)*sceneScale,
            random(12,34)*sceneScale,
            "0,2,18",random(.045,.105),
            a+Math.PI/2+random(-.7,.7));
    }

    // Random cavities inside arms = mottled dusty texture.
    const cavities=mobile?42:94;
    for(let i=0;i<cavities;i++){
        const arm=i%ARM_COUNT, phase=arm*Math.PI*2/ARM_COUNT;
        const t=random(.18,.96);
        const a=phase-.70+t*TURNS+.11*Math.sin(t*11+arm);
        const r=INNER+Math.pow(t,.91)*(OUTER-INNER);
        const p=point(r,a), n=normal(a);
        const off=random(-.75,.75)*(18+t*58)*sceneScale;
        drawCloudBlob(c,p.x+n.x*off,p.y+n.y*off,
            random(28,76)*sceneScale,random(12,34)*sceneScale,
            "1,0,20",random(.045,.115),a+Math.PI/2+random(-.8,.8));
    }

    // 6) Re-light the inner curl around the heart.
    c.globalCompositeOperation="screen";
    const innerClouds=mobile?54:108;
    for(let i=0;i<innerClouds;i++){
        const arm=i%ARM_COUNT, t=random(.015,.39);
        const phase=arm*Math.PI*2/ARM_COUNT;
        const a=phase-.70+t*TURNS;
        const r=INNER+Math.pow(t,.90)*(OUTER-INNER);
        const p=point(r,a);
        const rgb=i%3===0?"80,225,255":i%3===1?"220,90,250":"255,85,195";
        drawCloudBlob(c,p.x+random(-10,10),p.y+random(-7,7),
            random(34,86)*sceneScale,random(10,28)*sceneScale,
            rgb,random(.055,.120),a+Math.PI/2+random(-.35,.35));
    }

    drawSoftGlow(c,cx,cy,(mobile?160:240)*sceneScale,"80,95,235",.14);
    drawSoftGlow(c,cx,cy,(mobile?110:170)*sceneScale,"225,70,215",.20);
    drawSoftGlow(c,cx,cy,(mobile?58:94)*sceneScale,"255,195,240",.20);

    c.restore();
}


function drawV32TrueCloudNebula(c, cx, cy) {
    c.save();

    const mobile = width < 700;
    const base = Math.min(width / 1780, 1.18);

    /*
       V32.7 CLOUDY SPIRAL
       Fewer groups, much larger cloud bodies.
       No stroke ribbons / no long filaments.
    */
    const masses = mobile
        ? [
            [-0.34,-0.25,1.60,-0.18,0],
            [ 0.35,-0.24,1.64, 0.18,1],
            [-0.34, 0.22,1.48, 0.14,2],
            [ 0.35, 0.21,1.52,-0.14,0]
        ]
        : [
            [-0.34,-0.23,1.88,-0.16,0],
            [ 0.35,-0.22,1.92, 0.16,1],
            [-0.34, 0.23,1.78, 0.14,2],
            [ 0.35, 0.22,1.82,-0.14,0]
        ];

    for (const [nx, ny, s, rot, pal] of masses) {
        drawV32CloudComplex(
            c,
            cx + width * nx,
            cy + height * ny,
            s * base,
            rot,
            pal
        );
    }

    // Soft shoulders closer to the heart so the big masses feel connected,
    // while still keeping the exact center open.
    c.globalCompositeOperation = "screen";
    const shoulderCount = mobile ? 7 : 12;

    for (let i = 0; i < shoulderCount; i++) {
        const side = i % 2 === 0 ? -1 : 1;
        const x = cx + side * random(width * .13, width * .25);
        const y = cy + random(-height * .13, height * .15);

        const rgb =
            i % 3 === 0 ? "55,175,255" :
            i % 3 === 1 ? "165,55,245" :
                          "245,55,180";

        drawCloudBlob(
            c,
            x,
            y,
            random(115,205),
            random(50,92),
            rgb,
            random(.018,.042),
            random(-.45,.45)
        );
    }

    c.restore();
}

function drawV32CloudComplex(c, x, y, scale, angle, palette) {
    const P = [
        {deep:"48,6,108", violet:"118,20,224", pink:"255,34,180", blue:"18,95,238", cyan:"42,208,255"},
        {deep:"24,12,110", violet:"86,34,228", pink:"230,44,242", blue:"20,118,246",cyan:"46,218,255"},
        {deep:"70,6,94",  violet:"156,18,198", pink:"255,48,150", blue:"26,100,234",cyan:"42,200,255"}
    ][palette % 3];

    c.save();
    c.translate(x, y);
    c.rotate(angle);

    /*
       V32.7 CLOUDY SPIRAL
       Keep the large V32.3 silhouette,
       but add actual texture inside the cloud:
       layered puffs + dark pockets + clumped dust.
       No stroke(), no long filaments, no ribbon lines.
    */

    c.globalCompositeOperation = "screen";

    // 1) Soft base silhouette — slightly weaker than V32.3.
    for (let i = 0; i < 10; i++) {
        const t = random(-1, 1);
        const px = t * 145 * scale + random(-18,18) * scale;
        const py = Math.sin(t * 3.1 + palette) * 24 * scale + random(-34,34) * scale;

        const rgb =
            i % 4 === 0 ? P.deep :
            i % 3 === 0 ? P.blue :
                          P.violet;

        drawCloudBlob(
            c,
            px, py,
            random(95,150) * scale,
            random(50,82) * scale,
            rgb,
            random(.030,.060),
            random(-.38,.38)
        );
    }

    // 2) Medium cloud cells — gives visible "puffy" texture.
    const medium = width < 700 ? 34 : 58;
    for (let i = 0; i < medium; i++) {
        const t = random(-1,1);
        const envelope = Math.sqrt(Math.max(.07, 1 - t*t));

        const px = t * 170 * scale + random(-24,24) * scale;
        const py =
            Math.sin(t * 4.2 + palette * .9) * 30 * scale +
            random(-58,58) * envelope * scale;

        const q = Math.random();
        const rgb =
            q < .30 ? P.violet :
            q < .55 ? P.pink :
            q < .80 ? P.blue :
                      P.cyan;

        drawCloudBlob(
            c,
            px, py,
            random(42,78) * scale,
            random(26,48) * scale,
            rgb,
            random(.085,.155),
            random(-.58,.58)
        );
    }

    // 3) Small cloud "cauliflower" puffs for broken edges and structure.
    const small = width < 700 ? 42 : 78;
    for (let i = 0; i < small; i++) {
        const t = random(-1,1);
        const edgeBias = Math.pow(Math.random(), .70);
        const side = Math.random() < .5 ? -1 : 1;

        const px = t * 180 * scale + random(-22,22) * scale;
        const py =
            Math.sin(t * 4.5 + palette) * 28 * scale +
            side * (28 + edgeBias * 55) * scale +
            random(-18,18) * scale;

        const q = Math.random();
        const rgb =
            q < .36 ? P.pink :
            q < .68 ? P.violet :
            q < .86 ? P.blue :
                      P.cyan;

        drawCloudBlob(
            c,
            px, py,
            random(24,48) * scale,
            random(16,30) * scale,
            rgb,
            random(.075,.145),
            random(-.70,.70)
        );
    }

    // 4) Dark pockets and little rifts — enough for depth, not enough to erase the cloud.
    c.globalCompositeOperation = "source-over";

    const holes = width < 700 ? 11 : 18;
    for (let i = 0; i < holes; i++) {
        const t = random(-1,1);
        const px = t * 158 * scale + random(-20,20) * scale;
        const py =
            Math.sin(t * 4.0 + 1.2) * 26 * scale +
            random(-44,44) * scale;

        drawCloudBlob(
            c,
            px, py,
            random(34,66) * scale,
            random(14,28) * scale,
            "0,0,10",
            random(.11,.21),
            random(-.72,.72)
        );
    }

    // A few larger low-opacity cavities make depth without looking like black holes.
    for (let i = 0; i < 4; i++) {
        drawCloudBlob(
            c,
            random(-125,125) * scale,
            random(-38,38) * scale,
            random(65,95) * scale,
            random(24,38) * scale,
            "0,0,12",
            random(.06,.11),
            random(-.55,.55)
        );
    }

    // 5) Re-light selected cloud faces after dark carving.
    c.globalCompositeOperation = "screen";

    for (let i = 0; i < 16; i++) {
        const t = random(-1,1);
        const side = Math.random() < .5 ? -1 : 1;
        const q = Math.random();
        const rgb =
            q < .34 ? P.cyan :
            q < .66 ? P.pink :
                      P.violet;

        drawCloudBlob(
            c,
            t * 170 * scale + random(-14,14) * scale,
            side * random(22,62) * scale + Math.sin(t * 4.5) * 18 * scale,
            random(40,72) * scale,
            random(16,30) * scale,
            rgb,
            random(.075,.135),
            random(-.50,.50)
        );
    }

    // 6) Fine dust, but in clumps rather than a uniform fog.
    const dust = width < 700 ? 560 : 1320;

    for (let i = 0; i < dust; i++) {
        const t = random(-1,1);
        const envelope = Math.sqrt(Math.max(.05, 1 - t*t));

        const centerBand =
            Math.sin(t * 4.3 + palette) * 28 * scale;

        const px = t * 205 * scale + random(-30,30) * scale;
        const py = centerBand + random(-76,76) * envelope * scale;

        // Deterministic-looking gaps: prevents spray-paint appearance.
        const texture = Math.sin(t * 14 + py / (18 * scale));
        if (texture > .52 && Math.random() < .70) continue;

        const q = Math.random();
        const alpha = random(.14,.52);

        c.fillStyle =
            q < .28 ? `rgba(55,215,255,${alpha})` :
            q < .64 ? `rgba(175,72,255,${alpha})` :
                      `rgba(255,70,190,${alpha})`;

        const s = Math.random() < .07 ? random(1.2,2.0) : random(.32,1.10);
        c.fillRect(px, py, s, s);
    }

    // 7) Dust clusters embedded at a few points for visible detail.
    const clusters = width < 700 ? 4 : 7;

    for (let i = 0; i < clusters; i++) {
        const kx = random(-135,135) * scale;
        const ky = random(-46,46) * scale;
        const clusterSize = random(18,30) * scale;

        for (let j = 0; j < 28; j++) {
            const a = random(0, Math.PI * 2);
            const rr = Math.pow(Math.random(), 1.6) * clusterSize;
            const dx = kx + Math.cos(a) * rr;
            const dy = ky + Math.sin(a) * rr * .55;

            const q = Math.random();
            c.fillStyle =
                q < .34 ? `rgba(120,225,255,${random(.12,.34)})` :
                q < .70 ? `rgba(230,120,255,${random(.12,.36)})` :
                          `rgba(255,120,210,${random(.12,.38)})`;

            const s = random(.45,1.45);
            c.fillRect(dx,dy,s,s);
        }
    }

    // 8) Very few compact luminous cores — not giant blurred circles.
    for (let i = 0; i < 2; i++) {
        const kx = random(-105,105) * scale;
        const ky = random(-34,34) * scale;
        const r = random(15,23) * scale;

        const g = c.createRadialGradient(kx,ky,0,kx,ky,r);
        g.addColorStop(0,"rgba(255,255,255,.52)");
        g.addColorStop(.16,"rgba(255,175,240,.28)");
        g.addColorStop(.50,"rgba(210,60,235,.10)");
        g.addColorStop(1,"rgba(90,20,180,0)");

        c.fillStyle = g;
        c.beginPath();
        c.arc(kx,ky,r,0,Math.PI*2);
        c.fill();
    }

    c.restore();
}



/* =========================================================
   V31 CHUNKY NEBULA
   Big, dense, separated cloud masses.
   Designed to look like nebula "clouds", not a fog curtain.
========================================================= */

function drawV31ChunkyNebula(c, cx, cy) {
    c.save();

    const mobile = width < 700;
    const baseScale = Math.min(width / 1780, 1.16);

    // Only six major complexes on desktop.
    // Center is intentionally left open.
    const masses = [
        [-0.35,-0.27,1.28,-0.22,0],
        [ 0.35,-0.28,1.32, 0.20,1],
        [-0.43, 0.13,1.18, 0.30,2],
        [ 0.43, 0.14,1.22,-0.28,0],
        [-0.27, 0.31,1.02, 0.10,1],
        [ 0.29, 0.30,1.04,-0.12,2]
    ];

    const count = mobile ? 4 : masses.length;

    for (let i=0; i<count; i++) {
        const [nx,ny,s,a,p] = masses[i];
        drawV31NebulaMass(
            c,
            cx + width*nx,
            cy + height*ny,
            s*baseScale,
            a,
            p
        );
    }

    c.restore();
}

function drawV31NebulaMass(c, x, y, scale, angle, palette) {
    const P = [
        {deep:"40,10,120", violet:"115,18,220", pink:"255,25,185", blue:"10,95,255", cyan:"15,220,255"},
        {deep:"22,18,120", violet:"85,30,235",  pink:"225,35,250", blue:"10,115,255",cyan:"35,220,255"},
        {deep:"70,8,105",  violet:"155,15,205", pink:"255,45,155", blue:"20,100,245",cyan:"35,205,255"}
    ][palette % 3];

    c.save();
    c.translate(x,y);
    c.rotate(angle);

    // -------------------------------------------------------
    // A) Dense cloud body: stronger opacity, less huge spread.
    // -------------------------------------------------------
    c.globalCompositeOperation = "screen";

    for (let i=0; i<18; i++) {
        const t = random(-1,1);
        const px = t*175*scale + random(-32,32)*scale;
        const py = Math.sin(t*3.2)*26*scale + random(-50,50)*scale;

        drawCloudBlob(
            c, px, py,
            random(105,190)*scale,
            random(45,88)*scale,
            i%4===0 ? P.deep : P.violet,
            random(.055,.110),
            random(-.45,.45)
        );
    }

    // -------------------------------------------------------
    // B) Puffy luminous cells.
    // -------------------------------------------------------
    for (let i=0; i<18; i++) {
        const q = Math.random();

        drawCloudBlob(
            c,
            random(-170,170)*scale,
            random(-66,66)*scale,
            random(58,112)*scale,
            random(27,52)*scale,
            q < .40 ? P.pink : q < .72 ? P.violet : P.blue,
            random(.080,.155),
            random(-.65,.65)
        );
    }

    // -------------------------------------------------------
    // C) Deep black cavities carve the cloud into chunks.
    // -------------------------------------------------------
    c.globalCompositeOperation = "source-over";

    for (let i=0; i<17; i++) {
        drawCloudBlob(
            c,
            random(-165,165)*scale,
            random(-61,61)*scale,
            random(50,102)*scale,
            random(18,39)*scale,
            "0,0,12",
            random(.18,.34),
            random(-.8,.8)
        );
    }

    // -------------------------------------------------------
    // D) Bright edge filaments — thin, vivid, irregular.
    // -------------------------------------------------------
    c.globalCompositeOperation = "screen";

    for (let i=0; i<24; i++) {
        const q = Math.random();
        const rgb =
            q < .34 ? P.cyan :
            q < .61 ? P.blue :
            q < .80 ? P.violet :
                      P.pink;

        drawCloudBlob(
            c,
            random(-185,185)*scale,
            random(-72,72)*scale,
            random(58,112)*scale,
            random(4,12)*scale,
            rgb,
            random(.12,.24),
            random(-.45,.45)
        );
    }

    // -------------------------------------------------------
    // E) Cloud-edge dust.
    // Mostly outer/mid area, not uniformly across the mass.
    // -------------------------------------------------------
    const dust = width < 700 ? 300 : 780;

    for (let i=0; i<dust; i++) {
        const a = random(0, Math.PI*2);
        const edge = Math.pow(Math.random(), .48);

        if (edge < .40 && Math.random() < .80) continue;

        const dx = Math.cos(a) * 188*scale*edge + random(-12,12)*scale;
        const dy = Math.sin(a) *  73*scale*edge + random(-8,8)*scale;

        const q = Math.random();

        c.fillStyle =
            q < .32 ? `rgba(25,220,255,${random(.18,.62)})` :
            q < .67 ? `rgba(175,70,255,${random(.18,.64)})` :
                      `rgba(255,55,190,${random(.18,.66)})`;

        const s = random(.45,1.9);
        c.fillRect(dx,dy,s,s);
    }

    // -------------------------------------------------------
    // F) Only two bright stellar knots per cloud.
    // No blurry-ball overload.
    // -------------------------------------------------------
    for (let i=0; i<2; i++) {
        const kx = random(-125,125)*scale;
        const ky = random(-44,44)*scale;
        const r  = random(14,25)*scale;

        const g = c.createRadialGradient(kx,ky,0,kx,ky,r);
        g.addColorStop(0,"rgba(255,255,255,.66)");
        g.addColorStop(.14,"rgba(255,170,245,.42)");
        g.addColorStop(.42,"rgba(245,35,210,.18)");
        g.addColorStop(1,"rgba(80,20,170,0)");

        c.fillStyle = g;
        c.beginPath();
        c.arc(kx,ky,r,0,Math.PI*2);
        c.fill();
    }

    c.restore();
}

/* =========================================================
   V31 HEART CLEAR ZONE
   Slightly darkens haze around the center WITHOUT hiding
   the heart, orbit lines, stars or core glow.
========================================================= */
function drawV31HeartClearZone(c, cx, cy) {
    c.save();
    c.globalCompositeOperation = "source-over";

    const rx = Math.min(width*0.22, 390);
    const ry = Math.min(height*0.19, 175);

    // Ring-shaped darkening: center remains transparent,
    // outer haze is gently reduced.
    const r = Math.max(rx, ry);
    const g = c.createRadialGradient(cx,cy,r*.20,cx,cy,r);

    g.addColorStop(0,   "rgba(0,0,12,0)");
    g.addColorStop(.35, "rgba(0,0,14,.02)");
    g.addColorStop(.62, "rgba(0,0,15,.10)");
    g.addColorStop(1,   "rgba(0,0,14,0)");

    c.fillStyle = g;
    c.save();
    c.translate(cx,cy);
    c.scale(1, ry/rx);
    c.beginPath();
    c.arc(0,0,rx,0,Math.PI*2);
    c.fill();
    c.restore();

    c.restore();
}

function drawV29UltraDenseNebula(c, cx, cy) {
    c.save();

    const mobile = width < 700;
    const scaleBase = Math.min(width / 1780, 1.18);

    // V30: fewer but more structured nebula masses.
    const masses = [
        [-0.36,-0.29,1.30,-0.24,0],
        [ 0.34,-0.30,1.38, 0.22,1],
        [-0.43, 0.12,1.22, 0.30,2],
        [ 0.43, 0.13,1.30,-0.28,0],
        [-0.27, 0.30,1.08, 0.12,1],
        [ 0.29, 0.29,1.10,-0.14,2]
    ];

    const count = mobile ? 4 : masses.length;

    for (let i = 0; i < count; i++) {
        const [nx, ny, s, a, p] = masses[i];
        drawV30CloudComplex(
            c,
            cx + width * nx,
            cy + height * ny,
            s * scaleBase,
            a,
            p
        );
    }

    // Dark space pockets between the clouds. These restore contrast.
    c.globalCompositeOperation = "source-over";
    const pockets = [
        [-.19,-.13,.16,.11], [.20,-.12,.15,.10],
        [-.31,.02,.13,.11],  [.31,.03,.13,.11],
        [-.10,.22,.15,.09],  [.13,.23,.14,.09]
    ];

    for (const [nx,ny,rx,ry] of pockets) {
        const x = cx + width * nx;
        const y = cy + height * ny;
        const R = Math.max(width * rx, height * ry);
        const g = c.createRadialGradient(x,y,0,x,y,R);
        g.addColorStop(0,"rgba(1,2,22,.58)");
        g.addColorStop(.42,"rgba(2,3,28,.38)");
        g.addColorStop(1,"rgba(2,3,28,0)");
        c.fillStyle = g;
        c.save();
        c.translate(x,y);
        c.scale(1, (height*ry)/(width*rx));
        c.beginPath();
        c.arc(0,0,width*rx,0,Math.PI*2);
        c.fill();
        c.restore();
    }

    c.restore();
}

function drawV30CloudComplex(c, x, y, scale, angle, palette) {
    const P = [
        {violet:"118,30,255", pink:"255,25,190", blue:"20,78,255", cyan:"20,215,255"},
        {violet:"92,35,255",  pink:"225,35,255", blue:"15,100,255",cyan:"35,220,255"},
        {violet:"160,20,230", pink:"255,38,150", blue:"25,88,255", cyan:"35,205,255"}
    ][palette % 3];

    c.save();
    c.translate(x,y);
    c.rotate(angle);

    // Broad cloud body, intentionally darker than V29.
    c.globalCompositeOperation = "screen";
    for (let i=0; i<18; i++) {
        const t = random(-1,1);
        const px = t * 215 * scale + random(-48,48)*scale;
        const py = Math.sin(t*3.0)*30*scale + random(-62,62)*scale;

        drawCloudBlob(
            c, px, py,
            random(150,260)*scale,
            random(55,112)*scale,
            i%3===0 ? P.blue : P.violet,
            random(.025,.060),
            random(-.48,.48)
        );
    }

    // Distinct cloud puffs. Less transparent wash, more shape.
    for (let i=0; i<22; i++) {
        const q = Math.random();
        drawCloudBlob(
            c,
            random(-210,210)*scale,
            random(-88,88)*scale,
            random(72,142)*scale,
            random(30,67)*scale,
            q < .34 ? P.pink : q < .68 ? P.violet : P.blue,
            random(.050,.105),
            random(-.65,.65)
        );
    }

    // Strong dark cavities carved into each mass.
    c.globalCompositeOperation = "source-over";
    for (let i=0; i<24; i++) {
        drawCloudBlob(
            c,
            random(-205,205)*scale,
            random(-82,82)*scale,
            random(62,132)*scale,
            random(22,54)*scale,
            "0,0,15",
            random(.16,.31),
            random(-.8,.8)
        );
    }

    // Thin luminous ridges: cyan -> blue -> violet -> hot pink.
    c.globalCompositeOperation = "screen";
    for (let i=0; i<32; i++) {
        const q = Math.random();
        const col = q < .28 ? P.cyan : q < .53 ? P.blue : q < .76 ? P.violet : P.pink;
        drawCloudBlob(
            c,
            random(-225,225)*scale,
            random(-91,91)*scale,
            random(64,130)*scale,
            random(5,15)*scale,
            col,
            random(.10,.20),
            random(-.52,.52)
        );
    }

    // Only a FEW luminous knots. V29 had too many blurry balls.
    for (let i=0; i<3; i++) {
        const kx = random(-175,175)*scale;
        const ky = random(-65,65)*scale;
        const r  = random(20,34)*scale;
        const g = c.createRadialGradient(kx,ky,0,kx,ky,r);
        g.addColorStop(0,"rgba(255,255,255,.62)");
        g.addColorStop(.12,"rgba(255,175,245,.43)");
        g.addColorStop(.38,"rgba(255,35,210,.20)");
        g.addColorStop(1,"rgba(80,20,170,0)");
        c.fillStyle = g;
        c.beginPath();
        c.arc(kx,ky,r,0,Math.PI*2);
        c.fill();
    }

    // Dust concentrated around cloud edges instead of evenly filling everything.
    const dust = width < 700 ? 330 : 900;
    for (let i=0; i<dust; i++) {
        const a = random(0, Math.PI*2);
        const edge = Math.pow(Math.random(), .55);
        const rx = 225*scale;
        const ry = 88*scale;
        const dx = Math.cos(a)*rx*edge + random(-16,16)*scale;
        const dy = Math.sin(a)*ry*edge + random(-10,10)*scale;

        // Prefer outer/mid cloud regions.
        if (edge < .42 && Math.random() < .76) continue;

        const q = Math.random();
        const rgb = q < .32 ? "30,220,255" : q < .66 ? "160,65,255" : "245,75,190";
        const alpha = random(.16,.58);
        const s = random(.45,1.75);

        c.fillStyle = `rgba(${rgb},${alpha})`;
        c.fillRect(dx,dy,s,s);
    }

    c.restore();
}

function drawV26ArmDust(c,cx,cy) {
    c.save();
    c.globalCompositeOperation="screen";

    // Narrower arm dust so navy/black negative space remains visible.
    const amount=width<700?1100:2500;

    for(let i=0;i<amount;i++){
        const arm=i%4;
        const t=Math.pow(Math.random(),.68);
        const a=arm*Math.PI/2+t*5.08+random(-.10,.10);
        const rx=width*(.08+t*.43);
        const ry=height*(.045+t*.30);
        const px=cx+Math.cos(a)*rx+random(-17,17);
        const py=cy+Math.sin(a)*ry+random(-11,11);

        const q=Math.random();
        c.fillStyle=q<.38
            ?`rgba(20,210,255,${random(.10,.40)})`
            :q<.72
            ?`rgba(180,70,255,${random(.10,.43)})`
            :`rgba(255,50,185,${random(.10,.46)})`;
        const s=random(.30,1.32);
        c.fillRect(px,py,s,s);
    }
    c.restore();
}

/* =========================================================
   V19 MAX DARK CONTRAST
   Darkens edges and preserves a vivid saturated center.
========================================================= */

function drawV20DeepSpaceWash(c) {
    c.save();
    c.globalCompositeOperation = "source-over";

    // Very dark transparent wash: preserves bright arms/core but kills pastel haze.
    const wash = c.createLinearGradient(0, 0, width, height);
    wash.addColorStop(0, "rgba(0,2,22,.10)");
    wash.addColorStop(.32, "rgba(5,0,22,.08)");
    wash.addColorStop(.62, "rgba(18,0,28,.07)");
    wash.addColorStop(1, "rgba(3,0,15,.14)");
    c.fillStyle = wash;
    c.fillRect(0,0,width,height);

    c.restore();
}

function drawV19ContrastVignette(c) {
    c.save();
    c.globalCompositeOperation = "source-over";

    const g = c.createRadialGradient(
        width/2, height*.43, Math.min(width,height)*.18,
        width/2, height*.43, Math.max(width,height)*.78
    );

    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(.38, "rgba(0,0,8,.06)");
    g.addColorStop(.68, "rgba(0,0,10,.28)");
    g.addColorStop(1, "rgba(0,0,5,.62)");

    c.fillStyle = g;
    c.fillRect(0,0,width,height);
    c.restore();
}

/* =========================================================
   DYNAMIC STARS
========================================================= */

let dynamicStars = [];

function createDynamicStars() {
    dynamicStars = [];

    const amount = width < 700 ? 100 : 160;

    for (let i = 0; i < amount; i++) {
        dynamicStars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: random(0.3, 1.2),
            alpha: random(0.22, 0.85),
            phase: random(0, Math.PI * 2),
            speed: random(0.7, 1.8)
        });
    }
}

function drawDynamicStars() {
    for (const star of dynamicStars) {
        const twinkle =
            0.60 +
            Math.sin(
                galaxyTime * star.speed +
                star.phase
            ) * 0.40;

        const alpha =
            clamp(
                star.alpha * twinkle,
                0,
                1
            );

        ctx.fillStyle = `rgba(250,240,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

/* =========================================================
   SPARKLES
========================================================= */

let sparkleStars = [];

function createSparkleStars() {
    sparkleStars = [];

    const amount = width < 700 ? 8 : 15;

    for (let i = 0; i < amount; i++) {
        sparkleStars.push({
            x: random(width * 0.04, width * 0.96),
            y: random(height * 0.04, height * 0.88),
            size: random(2, 4.5),
            phase: random(0, Math.PI * 2)
        });
    }
}

function drawSparkleStars() {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (const star of sparkleStars) {
        const alpha =
            clamp(
                0.48 +
                Math.sin(
                    galaxyTime * 1.7 +
                    star.phase
                ) * 0.40,
                0.05,
                1
            );

        const size =
            star.size *
            (0.85 + alpha * 0.25);

        ctx.strokeStyle = `rgba(255,235,255,${alpha})`;
        ctx.lineWidth = 0.8;

        ctx.beginPath();
        ctx.moveTo(star.x - size * 3, star.y);
        ctx.lineTo(star.x + size * 3, star.y);
        ctx.moveTo(star.x, star.y - size * 3);
        ctx.lineTo(star.x, star.y + size * 3);
        ctx.stroke();

        ctx.fillStyle = `rgba(255,255,255,${alpha})`;

        ctx.beginPath();
        ctx.arc(star.x, star.y, size * 0.65, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

/* =========================================================
   HEART - KEEP V6 GLASS HEART
========================================================= */

let heartOutline = [];
let heartFill = [];

function heartPoint(t) {
    const x =
        16 *
        Math.pow(
            Math.sin(t),
            3
        );

    const y =
        -(
            13 * Math.cos(t)
            -
            5 * Math.cos(2 * t)
            -
            2 * Math.cos(3 * t)
            -
            Math.cos(4 * t)
        );

    return { x, y };
}

function createHeart() {
    heartOutline = [];
    heartFill = [];

    const scale = width < 700 ? 5.0 : 6.8;

    const outlineCount = width < 700 ? 160 : 230;

    for (let i = 0; i < outlineCount; i++) {
        const t =
            (i / outlineCount) *
            Math.PI * 2;

        const p = heartPoint(t);

        heartOutline.push({
            x: p.x * scale,
            y: p.y * scale
        });
    }

    const fillCount = width < 700 ? 360 : 560;

    for (let i = 0; i < fillCount; i++) {
        const t = random(0, Math.PI * 2);
        const p = heartPoint(t);
        const fill = Math.sqrt(Math.random());

        heartFill.push({
            x: p.x * scale * fill,
            y: p.y * scale * fill,
            size: random(0.6, 1.7),
            alpha: random(0.18, 0.62),
            phase: random(0, Math.PI * 2)
        });
    }
}

function traceHeartPath(c, centerX, centerY, scale = 1) {
    c.beginPath();

    for (let i = 0; i < heartOutline.length; i++) {
        const p = heartOutline[i];

        const x =
            centerX +
            p.x * scale;

        const y =
            centerY +
            p.y * scale;

        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
    }

    c.closePath();
}

function drawHeart(centerX, centerY) {
    const pulse =
        1 +
        Math.sin(galaxyTime * 1.65) * 0.008;

    const mobile = width < 700;
    const scale = mobile ? 0.82 : 1;

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    /*
       V42 CRYSTAL HEART
       Glass / crystal style inspired by the reference,
       but still rendered entirely with Canvas code.
    */

    // ---------------------------------------------------------
    // 1) Soft aura behind the heart
    // ---------------------------------------------------------

    const auraRadius = (mobile ? 150 : 205) * scale;

    const aura =
        ctx.createRadialGradient(
            centerX,
            centerY + 4,
            0,
            centerX,
            centerY + 4,
            auraRadius
        );

    aura.addColorStop(0.00, "rgba(255,185,225,0.34)");
    aura.addColorStop(0.16, "rgba(255,90,200,0.24)");
    aura.addColorStop(0.40, "rgba(205,70,255,0.16)");
    aura.addColorStop(0.68, "rgba(80,135,255,0.07)");
    aura.addColorStop(1.00, "rgba(0,0,0,0)");

    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(
        centerX,
        centerY + 4,
        auraRadius,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // ---------------------------------------------------------
    // 2) Main crystal body
    // ---------------------------------------------------------

    const body =
        ctx.createLinearGradient(
            centerX - 105 * scale,
            centerY - 105 * scale,
            centerX + 105 * scale,
            centerY + 115 * scale
        );

    body.addColorStop(0.00, "rgba(170,205,255,0.34)");
    body.addColorStop(0.16, "rgba(220,180,255,0.43)");
    body.addColorStop(0.42, "rgba(255,105,205,0.58)");
    body.addColorStop(0.67, "rgba(245,85,185,0.52)");
    body.addColorStop(1.00, "rgba(155,80,245,0.38)");

    traceHeartPath(
        ctx,
        centerX,
        centerY,
        pulse
    );

    ctx.fillStyle = body;

    ctx.shadowColor = "rgba(255,80,205,0.34)";
    ctx.shadowBlur = mobile ? 18 : 24;

    ctx.fill();

    ctx.shadowBlur = 0;

    // ---------------------------------------------------------
    // 3) Colored glass depth inside the heart
    // ---------------------------------------------------------

    ctx.save();

    traceHeartPath(
        ctx,
        centerX,
        centerY,
        pulse
    );

    ctx.clip();

    const innerPink =
        ctx.createRadialGradient(
            centerX,
            centerY + 12 * scale,
            0,
            centerX,
            centerY + 12 * scale,
            (mobile ? 95 : 125) * scale
        );

    innerPink.addColorStop(0.00, "rgba(255,235,225,0.62)");
    innerPink.addColorStop(0.08, "rgba(255,200,215,0.52)");
    innerPink.addColorStop(0.27, "rgba(255,120,195,0.38)");
    innerPink.addColorStop(0.56, "rgba(225,75,225,0.17)");
    innerPink.addColorStop(1.00, "rgba(75,85,245,0)");

    ctx.fillStyle = innerPink;
    ctx.fillRect(
        centerX - 150 * scale,
        centerY - 140 * scale,
        300 * scale,
        300 * scale
    );

    // Cool blue-violet glass on the upper-left.
    const cool =
        ctx.createRadialGradient(
            centerX - 48 * scale,
            centerY - 52 * scale,
            0,
            centerX - 48 * scale,
            centerY - 52 * scale,
            118 * scale
        );

    cool.addColorStop(0.00, "rgba(210,235,255,0.42)");
    cool.addColorStop(0.18, "rgba(145,185,255,0.26)");
    cool.addColorStop(0.50, "rgba(145,95,255,0.12)");
    cool.addColorStop(1.00, "rgba(0,0,0,0)");

    ctx.fillStyle = cool;
    ctx.fillRect(
        centerX - 170 * scale,
        centerY - 165 * scale,
        250 * scale,
        245 * scale
    );

    // Hot pink glass on the lower-right.
    const hot =
        ctx.createRadialGradient(
            centerX + 52 * scale,
            centerY + 30 * scale,
            0,
            centerX + 52 * scale,
            centerY + 30 * scale,
            126 * scale
        );

    hot.addColorStop(0.00, "rgba(255,90,185,0.30)");
    hot.addColorStop(0.38, "rgba(255,45,170,0.14)");
    hot.addColorStop(1.00, "rgba(0,0,0,0)");

    ctx.fillStyle = hot;
    ctx.fillRect(
        centerX - 35 * scale,
        centerY - 80 * scale,
        210 * scale,
        230 * scale
    );

    // ---------------------------------------------------------
    // 4) Galaxy dust trapped inside the crystal
    // ---------------------------------------------------------

    for (const p of heartFill) {
        const twinkle =
            0.76 +
            Math.sin(
                galaxyTime * 1.6 +
                p.phase
            ) * 0.24;

        const q =
            (p.phase % (Math.PI * 2)) /
            (Math.PI * 2);

        if (q < 0.28) {
            ctx.fillStyle =
                `rgba(190,230,255,${p.alpha * twinkle * 0.72})`;
        } else if (q < 0.62) {
            ctx.fillStyle =
                `rgba(245,190,255,${p.alpha * twinkle * 0.80})`;
        } else {
            ctx.fillStyle =
                `rgba(255,175,215,${p.alpha * twinkle * 0.82})`;
        }

        ctx.beginPath();

        ctx.arc(
            centerX + p.x * pulse,
            centerY + p.y * pulse,
            p.size * 0.78,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    // ---------------------------------------------------------
    // 5) Glass reflection streaks
    // ---------------------------------------------------------

    ctx.lineCap = "round";

    ctx.strokeStyle =
        "rgba(255,255,255,0.34)";

    ctx.lineWidth =
        mobile ? 3.2 : 4.2;

    ctx.shadowColor =
        "rgba(255,235,255,0.40)";

    ctx.shadowBlur =
        mobile ? 7 : 10;

    ctx.beginPath();

    ctx.moveTo(
        centerX - 66 * scale,
        centerY - 60 * scale
    );

    ctx.bezierCurveTo(
        centerX - 91 * scale,
        centerY - 31 * scale,
        centerX - 88 * scale,
        centerY + 2 * scale,
        centerX - 72 * scale,
        centerY + 19 * scale
    );

    ctx.stroke();

    ctx.strokeStyle =
        "rgba(255,255,255,0.22)";

    ctx.lineWidth =
        mobile ? 2.1 : 2.8;

    ctx.beginPath();

    ctx.moveTo(
        centerX - 45 * scale,
        centerY - 78 * scale
    );

    ctx.bezierCurveTo(
        centerX - 20 * scale,
        centerY - 92 * scale,
        centerX + 1 * scale,
        centerY - 87 * scale,
        centerX + 16 * scale,
        centerY - 71 * scale
    );

    ctx.stroke();

    ctx.shadowBlur = 0;

    // Small glass sparkle on upper-right.
    const glint =
        ctx.createRadialGradient(
            centerX + 61 * scale,
            centerY - 54 * scale,
            0,
            centerX + 61 * scale,
            centerY - 54 * scale,
            20 * scale
        );

    glint.addColorStop(
        0,
        "rgba(255,255,255,0.62)"
    );

    glint.addColorStop(
        0.22,
        "rgba(255,225,250,0.22)"
    );

    glint.addColorStop(
        1,
        "rgba(255,255,255,0)"
    );

    ctx.fillStyle = glint;

    ctx.beginPath();

    ctx.arc(
        centerX + 61 * scale,
        centerY - 54 * scale,
        20 * scale,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();

    // ---------------------------------------------------------
    // 6) Thick crystal rim
    // ---------------------------------------------------------

    traceHeartPath(
        ctx,
        centerX,
        centerY,
        pulse
    );

    const rim =
        ctx.createLinearGradient(
            centerX - 100 * scale,
            centerY - 95 * scale,
            centerX + 95 * scale,
            centerY + 100 * scale
        );

    rim.addColorStop(
        0.00,
        "rgba(225,245,255,0.94)"
    );

    rim.addColorStop(
        0.20,
        "rgba(195,180,255,0.86)"
    );

    rim.addColorStop(
        0.48,
        "rgba(255,205,245,0.92)"
    );

    rim.addColorStop(
        0.72,
        "rgba(255,115,210,0.80)"
    );

    rim.addColorStop(
        1.00,
        "rgba(185,145,255,0.82)"
    );

    ctx.strokeStyle = rim;

    ctx.lineWidth =
        mobile ? 4.2 : 5.8;

    ctx.shadowColor =
        "rgba(255,95,220,0.65)";

    ctx.shadowBlur =
        mobile ? 11 : 16;

    ctx.stroke();

    ctx.shadowBlur = 0;

    // Fine white inner rim.
    traceHeartPath(
        ctx,
        centerX,
        centerY,
        pulse * 0.972
    );

    ctx.strokeStyle =
        "rgba(255,245,255,0.54)";

    ctx.lineWidth =
        mobile ? 1.1 : 1.5;

    ctx.stroke();

    // ---------------------------------------------------------
    // 7) Warm luminous core
    // ---------------------------------------------------------

    const coreY =
        centerY + 11 * scale;

    const coreRadius =
        (mobile ? 60 : 78) * scale;

    const core =
        ctx.createRadialGradient(
            centerX,
            coreY,
            0,
            centerX,
            coreY,
            coreRadius
        );

    core.addColorStop(
        0.00,
        "rgba(255,255,235,0.96)"
    );

    core.addColorStop(
        0.08,
        "rgba(255,238,205,0.84)"
    );

    core.addColorStop(
        0.22,
        "rgba(255,185,205,0.55)"
    );

    core.addColorStop(
        0.48,
        "rgba(255,95,190,0.23)"
    );

    core.addColorStop(
        1.00,
        "rgba(255,80,200,0)"
    );

    ctx.fillStyle = core;

    ctx.beginPath();

    ctx.arc(
        centerX,
        coreY,
        coreRadius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Tiny white center.
    drawSoftGlow(
        ctx,
        centerX,
        coreY,
        mobile ? 19 : 25,
        "255,250,235",
        0.58
    );

    ctx.restore();
}

function drawHeartOrbits(centerX, centerY) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (let i = 0; i < 5; i++) {
        const pulse =
            1 +
            Math.sin(
                galaxyTime +
                i
            ) *
            0.015;

        const rx =
            (
                width < 700
                    ? 118
                    : 165
            ) *
            (
                1 +
                i * 0.20
            ) *
            pulse;

        const ry =
            rx * 0.28;

        ctx.beginPath();
        ctx.ellipse(
            centerX,
            centerY + 7,
            rx,
            ry,
            -0.08,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            i < 2
                ? `rgba(255,220,250,${0.28 - i * 0.05})`
                : `rgba(190,140,255,${0.13 - i * 0.012})`;

        ctx.lineWidth = 1;
        ctx.stroke();
    }

    ctx.restore();
}

/* =========================================================
   SHOOTING STAR
========================================================= */

let shootingStar = null;
let nextShootingStar = 0;

function drawShootingStar(now) {
    if (!shootingStar && now > nextShootingStar) {
        shootingStar = {
            x: random(width * 0.08, width * 0.50),
            y: random(height * 0.04, height * 0.21),
            vx: random(8, 11),
            vy: random(3.4, 4.9),
            life: 0,
            maxLife: random(34, 47)
        };

        nextShootingStar =
            now +
            random(
                6000,
                10000
            );
    }

    if (!shootingStar) return;

    shootingStar.x += shootingStar.vx;
    shootingStar.y += shootingStar.vy;
    shootingStar.life++;

    const alpha =
        1 -
        shootingStar.life /
        shootingStar.maxLife;

    const tailX =
        shootingStar.x -
        105;

    const tailY =
        shootingStar.y -
        45;

    const g =
        ctx.createLinearGradient(
            tailX,
            tailY,
            shootingStar.x,
            shootingStar.y
        );

    g.addColorStop(0, "rgba(90,120,255,0)");
    g.addColorStop(0.65, `rgba(150,185,255,${alpha * 0.55})`);
    g.addColorStop(1, `rgba(255,225,250,${alpha})`);

    ctx.strokeStyle = g;
    ctx.lineWidth = 1.8;

    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(shootingStar.x, shootingStar.y);
    ctx.stroke();

    if (shootingStar.life >= shootingStar.maxLife) {
        shootingStar = null;
    }
}

/* =========================================================
   DRAW GALAXY
========================================================= */

let galaxyTime = 0;

function drawGalaxy(now, opacity = 1, zoom = 1) {
    galaxyTime += 0.016;

    const centerX = width / 2;
    const centerY = height * 0.43;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = opacity;

    // V39: during warp transition the whole universe starts far away
    // and smoothly grows into its final position.
    if (zoom !== 1) {
        ctx.translate(centerX, centerY);
        ctx.scale(zoom, zoom);
        ctx.translate(-centerX, -centerY);
    }

    // V49: use exactly the same living-galaxy transform as the warp.
    drawLivingGalaxyLayer(
        ctx,
        now,
        1
    );

    drawDynamicStars();
    drawHeartOrbits(centerX, centerY);
    drawHeart(centerX, centerY);
    drawSparkleStars();
    drawShootingStar(now);

    ctx.restore();
}

/* =========================================================
   V49 LIGHTWEIGHT LIVING GALAXY
   Same transform is used during warp and in the final scene,
   so there is no "start moving" snap when the transition ends.
========================================================= */

function drawLivingGalaxyLayer(c, now, alpha = 1) {
    const centerX = width / 2;
    const centerY = height * 0.43;

    const motionTime =
        (now || performance.now()) * 0.001;

    const galaxyBreath =
        1.012 +
        Math.sin(motionTime * 0.32) * 0.003;

    const galaxyRotation =
        Math.sin(motionTime * 0.20) * 0.00125;

    c.save();

    c.globalAlpha *= alpha;

    c.translate(centerX, centerY);
    c.rotate(galaxyRotation);
    c.scale(galaxyBreath, galaxyBreath);
    c.translate(-centerX, -centerY);

    c.drawImage(
        staticCanvas,
        0,
        0,
        width,
        height
    );

    c.restore();
}


/* =========================================================
   V45 TRANSITION SCENE CACHE
   Render the expensive crystal heart once, then reuse it
   as a bitmap during the warp transition.
========================================================= */

function buildTransitionSceneCache() {
    const centerX = width / 2;
    const centerY = height * 0.43;

    // Heart/orbits only. Cached once so warp stays very light.
    ctx.clearRect(0, 0, width, height);

    drawHeartOrbits(centerX, centerY);
    drawHeart(centerX, centerY);

    transitionHeartCtx.clearRect(0, 0, width, height);

    transitionHeartCtx.drawImage(
        canvas,
        0,
        0,
        width,
        height
    );

    // Keep the older complete cache available for compatibility,
    // but V49 transition no longer depends on it.
    ctx.clearRect(0, 0, width, height);

    ctx.drawImage(
        staticCanvas,
        0,
        0,
        width,
        height
    );

    ctx.drawImage(
        transitionHeartCanvas,
        0,
        0,
        width,
        height
    );

    transitionSceneCtx.clearRect(0, 0, width, height);

    transitionSceneCtx.drawImage(
        canvas,
        0,
        0,
        width,
        height
    );

    ctx.clearRect(0, 0, width, height);
}


/* =========================================================
   WARP
========================================================= */

let warpStars = [];

function createWarpStars() {
    warpStars = [];

    const amount = width < 700 ? 90 : 150;

    for (let i = 0; i < amount; i++) {
        warpStars.push({
            x: random(-1, 1),
            y: random(-1, 1),
            z: random(0.03, 1)
        });
    }
}

function drawWarp(intensity = 1) {
    ctx.fillStyle = "rgba(0,0,5,0.30)";
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    const speed =
        0.010 +
        intensity * 0.012;

    for (const star of warpStars) {
        const oldZ = star.z;

        star.z -= speed;

        if (star.z <= 0.02) {
            star.x = random(-1, 1);
            star.y = random(-1, 1);
            star.z = 1;
        }

        const z = Math.max(star.z, 0.02);
        const old = Math.max(oldZ, 0.025);

        const x =
            cx +
            star.x /
            z *
            width *
            0.39;

        const y =
            cy +
            star.y /
            z *
            height *
            0.39;

        const px =
            cx +
            star.x /
            old *
            width *
            0.39;

        const py =
            cy +
            star.y /
            old *
            height *
            0.39;

        ctx.strokeStyle =
            `rgba(
                255,
                235,
                250,
                ${0.45 + intensity * 0.40}
            )`;

        ctx.lineWidth =
            0.8 +
            intensity * 0.5;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

/* =========================================================
   UNIVERSE / WELCOME
========================================================= */

let animationRunning = false;
let universeStart = 0;
let galaxyReady = false;
let warpStart = 0;
let titleShown = false;
let memoriesShown = false;
let finalSceneFadeStart = 0;
let welcomeAnimation = null;

function showWelcome() {
    welcomeScreen.style.display = "flex";
    welcomeScreen.style.position = "fixed";
    welcomeScreen.style.inset = "0";
    welcomeScreen.style.zIndex = "999";
    welcomeScreen.style.opacity = "1";
    welcomeScreen.style.visibility = "visible";
    welcomeScreen.style.pointerEvents = "none";
    welcomeScreen.style.animation = "none";

    if (welcomeAnimation) {
        welcomeAnimation.cancel();
    }

    welcomeAnimation =
        welcomeScreen.animate(
            [
                {
                    opacity: 0,
                    transform: "scale(0.97)"
                },
                {
                    opacity: 1,
                    transform: "scale(1)",
                    offset: 0.18
                },
                {
                    opacity: 1,
                    transform: "scale(1)",
                    offset: 0.72
                },
                {
                    opacity: 0,
                    transform: "scale(1.025)"
                }
            ],
            {
                duration: 2600,
                easing: "ease-in-out",
                fill: "forwards"
            }
        );

    welcomeAnimation.onfinish = () => {
        welcomeScreen.style.display = "none";
    };
}

function startUniverse() {
    document.body.classList.remove("v713-galaxy-ready", "galaxy-memories-ready");

    resizeCanvas();

    galaxyTime = 0;
    shootingStar = null;
    nextShootingStar = 0;

    galaxyReady = false;
    warpStart = 0;
    titleShown = false;
    memoriesShown = false;
    finalSceneFadeStart = 0;

    if (spaceDecor) {
        spaceDecor.classList.remove("galaxy-visible");
        spaceDecor.style.opacity = "0";
    }

    galaxyTitle.classList.remove("show");

    memoryStars.forEach(star => {
        star.classList.remove("show");
    });

    createWarpStars();
    showWelcome();

    universeStart = performance.now();
    animationRunning = true;

    setTimeout(() => {
        drawStaticBackground();
        createDynamicStars();
        createSparkleStars();
        createHeart();

        // Build the expensive heart/orbit frame only once.
        buildTransitionSceneCache();

        galaxyReady = true;
        warpStart = performance.now() + 300;
    }, 2700);

    requestAnimationFrame(universeAnimation);
}

function universeAnimation(now) {
    if (!animationRunning) return;

    if (now < universeStart + 2600) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width, height);
    }

    else if (
        !galaxyReady ||
        warpStart === 0 ||
        now < warpStart
    ) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width, height);
    }

    else {
        const warpElapsed =
            now -
            warpStart;

        // V43 PERFORMANCE WARP
        // Keep transition cheap and continuous:
        // - no galaxy zoom
        // - no heart/orbits during warp
        // - only cached staticCanvas + warp stars
        // - dynamic galaxy starts only after warp is completely finished

        if (warpElapsed < 2100) {
            const t = warpElapsed / 2100;

            const smooth =
                t * t * (3 - 2 * t);

            drawWarp(
                0.32 +
                smooth * 0.64
            );
        }

        else if (warpElapsed < 4550) {
            const t =
                (warpElapsed - 2100) /
                2450;

            const smooth =
                t * t * (3 - 2 * t);

            /*
               V49: the galaxy is already "alive" while it fades in.
               Only the cached static bitmap is transformed, so this stays cheap.
               Heart/orbits are a separate cached layer and remain stable.
            */
            ctx.clearRect(0, 0, width, height);

            const sceneAlpha =
                0.035 +
                smooth * 0.965;

            drawLivingGalaxyLayer(
                ctx,
                now,
                sceneAlpha
            );

            ctx.save();
            ctx.globalAlpha = sceneAlpha;

            ctx.drawImage(
                transitionHeartCanvas,
                0,
                0,
                width,
                height
            );

            ctx.restore();

            // Warp remains in front and fades away continuously.
            // Reduce its visual intensity toward the end instead of
            // suddenly switching to the final scene.
            const warpFade =
                Math.pow(
                    1 - smooth,
                    1.28
                );

            if (warpFade > 0.008) {
                ctx.save();

                ctx.globalAlpha = warpFade;

                drawWarp(
                    0.92 -
                    smooth * 0.54
                );

                ctx.restore();
            }
        }

        else {
            // First final frame: remember when the lightweight fade begins.
            if (finalSceneFadeStart === 0) {
                finalSceneFadeStart = now;
            }

            const finalFadeT =
                Math.min(
                    1,
                    (now - finalSceneFadeStart) / 700
                );

            const finalFade =
                finalFadeT *
                finalFadeT *
                (3 - 2 * finalFadeT);

            // V58: decorations belong to the living galaxy only.
            // They fade in with the galaxy and remain completely hidden
            // on Welcome and during the early warp.
            if (spaceDecor) {
                spaceDecor.classList.add("galaxy-visible");
                spaceDecor.style.opacity =
                    Math.max(
                        0,
                        Math.min(1, (finalFadeT - 0.18) / 0.82)
                    ).toFixed(3);
            }

            /*
               V53 SMOOTH HEART HANDOFF

               The cached heart used during warp and the live crystal heart
               are not switched in a single frame anymore.

               Instead:
               - galaxy motion continues normally
               - dynamic stars fade in as before
               - cached heart slowly fades OUT
               - live heart/orbits slowly fade IN

               This removes the visible "heart suddenly gets brighter" cut.
            */
            const heartBlendT =
                Math.min(
                    1,
                    (now - finalSceneFadeStart) / 1600
                );

            const heartBlend =
                heartBlendT *
                heartBlendT *
                (3 - 2 * heartBlendT);

            ctx.clearRect(0, 0, width, height);

            // Galaxy keeps exactly the same living motion throughout.
            drawLivingGalaxyLayer(
                ctx,
                now,
                1
            );

            const centerX = width / 2;
            const centerY = height * 0.43;

            /*
               Cached heart fades out very gently.
               Keep a tiny overlap with the live heart so brightness
               never drops or jumps between the two versions.
            */
            if (heartBlend < 1) {
                ctx.save();

                ctx.globalAlpha =
                    Math.pow(
                        1 - heartBlend,
                        0.72
                    );

                ctx.drawImage(
                    transitionHeartCanvas,
                    0,
                    0,
                    width,
                    height
                );

                ctx.restore();
            }

            /*
               Live crystal heart fades in gradually.
               No instant change in glow/brightness.
            */
            if (heartBlend > 0.002) {
                ctx.save();

                ctx.globalAlpha = heartBlend;

                drawHeartOrbits(
                    centerX,
                    centerY
                );

                drawHeart(
                    centerX,
                    centerY
                );

                ctx.restore();
            }

            // Other lightweight animated elements keep their normal fade.
            ctx.save();
            ctx.globalAlpha = finalFade;

            drawDynamicStars();
            drawSparkleStars();
            drawShootingStar(now);

            ctx.restore();

            if (!titleShown && finalFadeT > 0.72) {
                titleShown = true;
                galaxyTitle.classList.add("show");
            }

            if (!memoriesShown && finalFadeT > 0.88) {
                memoriesShown = true;
                document.body.classList.add("galaxy-memories-ready", "v713-galaxy-ready");

                memoryStars.forEach((star, index) => {
                    setTimeout(() => {
                        star.classList.add("show");
                    }, index * 130);
                });
            }
        }
    }

    requestAnimationFrame(universeAnimation);
}

/* =========================================================
   RESIZE
========================================================= */

let resizeTimer = null;

window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
        resizeCanvas();

        if (galaxyReady) {
            drawStaticBackground();
            createDynamicStars();
            createSparkleStars();
            createHeart();
            buildTransitionSceneCache();
            createWarpStars();
        }
    }, 250);
});

/* =========================================================
   MEMORY STARS
========================================================= */


/* ==================================================
   V71.2 — CLEAN 5-MEMORY COMPLETION SYSTEM
   This is global code, NOT inside startUniverse().
================================================== */
const v712Collected = new Set();
const v712Progress = document.querySelector("#memory-progress-v712 span");
const v712HeartReady = document.getElementById("heart-ready-v712");
const v712HeartButton = document.getElementById("final-heart-button-v712");
const v712Ending = document.getElementById("ending-v712");
const v712EndingBack = document.getElementById("ending-back-v712");

function v712CollectMemory(star) {
    const index = Array.from(memoryStars).indexOf(star);
    if (index < 0 || v712Collected.has(index)) return;

    v712Collected.add(index);
    star.classList.add("v712-collected");

    const r = star.getBoundingClientRect();
    const light = document.createElement("span");
    light.className = "v712-energy";
    light.style.setProperty("--sx", `${r.left + r.width / 2}px`);
    light.style.setProperty("--sy", `${r.top + r.height / 2}px`);
    document.body.appendChild(light);
    setTimeout(() => light.remove(), 900);

    const count = v712Collected.size;
    if (v712Progress) v712Progress.textContent = `${count}/5`;

    if (count === 5) {
        setTimeout(() => {
            v712HeartReady?.classList.add("show");
            v712HeartButton?.classList.add("ready");
        }, 750);
    }
}

v712HeartButton?.addEventListener("click", () => {
    if (v712Collected.size !== 5 || !document.body.classList.contains("galaxy-memories-ready")) return;
    v712HeartReady?.classList.remove("show");
    v712HeartButton.classList.remove("ready");
    v712Ending?.classList.add("show");
});

v712EndingBack?.addEventListener("click", () => {
    v712Ending?.classList.remove("show");
    v712HeartReady?.classList.add("show");
    v712HeartButton?.classList.add("ready");
});

memoryStars.forEach(star => {
    star.addEventListener("click", () => {
        if (!document.body.classList.contains("galaxy-memories-ready") ||
            !star.classList.contains("show")) return;
        v712CollectMemory(star);
        if (star.dataset.special === "first-meeting" && firstMeetingModal) {
            firstMeetingModal.classList.add("show");
            firstMeetingModal.setAttribute("aria-hidden", "false");
            return;
        }
        if (star.dataset.special === "life-letter" && loveStoryModal) {
            loveStoryModal.classList.add("show");
            loveStoryModal.setAttribute("aria-hidden", "false");
            return;
        }

        if (star.dataset.special === "care-note" && careNoteModal) {
            careNoteModal.classList.add("show");
            careNoteModal.setAttribute("aria-hidden", "false");
            return;
        }

        if (star.dataset.special === "birthday-wish" && birthdayWishModal) {
            birthdayBefore?.classList.add("active");
            birthdayAfter?.classList.remove("active");
            birthdayWishModal.classList.add("show");
            birthdayWishModal.setAttribute("aria-hidden", "false");
            return;
        }

        if (star.dataset.special === "song-video" && songVideoModal) {
            songVideoModal.classList.add("show");
            songVideoModal.setAttribute("aria-hidden", "false");
            songVideoEnding?.classList.remove("show");
            return;
        }

        messageText.textContent = star.dataset.message;
        starMessage.style.display = "flex";
    });
});

function hideFirstMeeting() {
    if (!firstMeetingModal) return;
    firstMeetingModal.classList.remove("show");
    firstMeetingModal.setAttribute("aria-hidden", "true");
}
if (closeFirstMeeting) closeFirstMeeting.addEventListener("click", hideFirstMeeting);
if (firstMeetingModal) firstMeetingModal.addEventListener("click", event => {
    if (event.target === firstMeetingModal) hideFirstMeeting();
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && firstMeetingModal?.classList.contains("show")) hideFirstMeeting();
});

function hideSongVideo() {
    if (!songVideoModal) return;
    songVideoModal.classList.remove("show");
    songVideoModal.setAttribute("aria-hidden", "true");
    if (songVideoPlayer) {
        songVideoPlayer.pause();
        songVideoPlayer.currentTime = 0;
    }
    songVideoEnding?.classList.remove("show");
}

if (closeSongVideo) {
    closeSongVideo.addEventListener("click", hideSongVideo);
}
if (songVideoModal) {
    songVideoModal.addEventListener("click", event => {
        if (event.target === songVideoModal) hideSongVideo();
    });
}

/* Placeholder button for now. When assets/song-surprise.mp4 is added,
   add class "has-real-video" to #song-video-player-wrap and the video
   will use the native play/pause/time controls automatically. */
if (openSongSurprise) {
    openSongSurprise.addEventListener("click", () => {
        openSongSurprise.textContent = "รอคลิปเค้าก่อนน้าา 🤭❤️";
        setTimeout(() => {
            openSongSurprise.textContent = "▶ เปิดดูเซอร์ไพรส์";
        }, 1700);
    });
}

if (songVideoPlayer) {
    songVideoPlayer.addEventListener("ended", () => {
        songVideoEnding?.classList.add("show");
        songVideoEnding?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
}

function hideBirthdayWish() {
    if (!birthdayWishModal) return;
    birthdayWishModal.classList.remove("show");
    birthdayWishModal.setAttribute("aria-hidden", "true");
}

function launchBirthdayConfetti() {
    if (!birthdayConfetti) return;
    birthdayConfetti.innerHTML = "";

    // Small amount = smooth even on phones.
    for (let i = 0; i < 26; i++) {
        const piece = document.createElement("span");
        piece.className = "birthday-confetti-piece";

        const angle = (Math.PI * 2 * i) / 26;
        const distance = 105 + (i % 5) * 17;

        piece.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
        piece.style.setProperty("--y", `${Math.sin(angle) * distance - 25}px`);
        piece.style.setProperty("--r", `${(i * 67) % 360 + 180}deg`);
        piece.style.setProperty("--hue", `${(i * 43) % 360}`);

        birthdayConfetti.appendChild(piece);
    }

    setTimeout(() => {
        if (birthdayConfetti) birthdayConfetti.innerHTML = "";
    }, 1100);
}

if (blowCandles) {
    blowCandles.addEventListener("click", () => {
        blowCandles.disabled = true;
        blowCandles.textContent = "ฟู่ววว~ ✨";

        // Brief pause makes the blow feel intentional, then reveal the wish.
        setTimeout(() => {
            birthdayBefore?.classList.remove("active");
            birthdayAfter?.classList.add("active");
            launchBirthdayConfetti();

            if (birthdayWishModal) {
                const card = birthdayWishModal.querySelector(".birthday-wish-card");
                if (card) card.scrollTop = 0;
            }

            blowCandles.disabled = false;
            blowCandles.textContent = "เป่า 🎂";
        }, 650);
    });
}

if (closeBirthdayWish) {
    closeBirthdayWish.addEventListener("click", hideBirthdayWish);
}

if (birthdayWishModal) {
    birthdayWishModal.addEventListener("click", event => {
        if (event.target === birthdayWishModal) hideBirthdayWish();
    });
}

function hideCareNote() {
    if (!careNoteModal) return;
    careNoteModal.classList.remove("show");
    careNoteModal.setAttribute("aria-hidden", "true");
}

if (closeCareNote) {
    closeCareNote.addEventListener("click", hideCareNote);
}

if (careNoteModal) {
    careNoteModal.addEventListener("click", event => {
        if (event.target === careNoteModal) hideCareNote();
    });
}

function hideLoveStory() {
    if (!loveStoryModal) return;
    loveStoryModal.classList.remove("show");
    loveStoryModal.setAttribute("aria-hidden", "true");
}

if (closeLoveStory) {
    closeLoveStory.addEventListener("click", hideLoveStory);
}

if (loveStoryModal) {
    loveStoryModal.addEventListener("click", event => {
        if (event.target === loveStoryModal) hideLoveStory();
    });
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && loveStoryModal?.classList.contains("show")) {
        hideLoveStory();
    }
    if (event.key === "Escape" && careNoteModal?.classList.contains("show")) {
        hideCareNote();
    }
    if (event.key === "Escape" && birthdayWishModal?.classList.contains("show")) {
        hideBirthdayWish();
    }
    if (event.key === "Escape" && songVideoModal?.classList.contains("show")) {
        hideSongVideo();
    }
});

closeMessage.addEventListener("click", () => {
    starMessage.style.display = "none";
});

starMessage.addEventListener("click", event => {
    if (event.target === starMessage) {
        starMessage.style.display = "none";
    }
});

/* V32.7 CLOUDY SPIRAL: V34+ overrides removed intentionally. */
