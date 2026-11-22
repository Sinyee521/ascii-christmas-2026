'use strict';
const canvas=document.getElementById('scene'),ctx=canvas.getContext('2d');
const audio=document.getElementById('bgm'),movie=document.getElementById('movie');
const pause=document.getElementById('pause'),music=document.getElementById('music');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let time=reduced?10:0,last=performance.now(),playing=!reduced,musicOn=false;
const options={};
let lastDrawKey='';
audio.volume=movie.volume=0.8;
function setPlaying(value){playing=value;pause.textContent=playing?'暂停':'播放';if(!playing)audio.pause();}
async function playMusic(){try{audio.currentTime=time%20;await audio.play();musicOn=true;music.textContent='关闭音乐';setPlaying(true);}catch{musicOn=false;music.textContent='点击播放音乐';}}
function frame(now){
  const dt=Math.min((now-last)/1000,.25);last=now;
  if(playing){if(musicOn&&!audio.paused)time=audio.currentTime;else time+=dt;}
  options.message=document.getElementById('message').value;
  options.speed=+document.getElementById('speed').value;
  options.snow=document.getElementById('snow').checked;
  const drawKey=[Math.floor(time*30),options.message,options.speed,options.snow].join('|');
  if(drawKey!==lastDrawKey){AsciiChristmas.render(ctx,time,options);lastDrawKey=drawKey;}
  document.getElementById('clock').textContent='00:'+String(Math.floor(time%20)).padStart(2,'0')+' / 00:20 · 循环播放';
  requestAnimationFrame(frame);
}
setPlaying(playing);requestAnimationFrame(frame);
pause.onclick=async()=>{if(playing)setPlaying(false);else{setPlaying(true);if(musicOn)await playMusic();}};
document.getElementById('restart').onclick=async()=>{time=0;audio.currentTime=0;setPlaying(true);if(musicOn)await playMusic();};
music.onclick=async()=>{if(musicOn){audio.pause();musicOn=false;music.textContent='开启音乐';}else await playMusic();};
document.getElementById('volume').oninput=e=>{audio.volume=movie.volume=+e.target.value;};
document.getElementById('watch').onclick=()=>{
  setPlaying(false);document.getElementById('videoWrap').style.display='block';
  movie.play().catch(()=>{});movie.scrollIntoView({behavior:'smooth',block:'center'});
};
movie.addEventListener('play',()=>setPlaying(false));
