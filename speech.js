import {updateOpeningSpeech,stopOpeningSpeech,startOpeningText} from './opening-performance.js?v=month7';
import {setMusicDucked} from './music.js?v=month7';
// Offline dubbed clips only. No TTS server or AI connection during play.
let enabled=false,audio=null,frame=0,scene=null,text='',speaker='미아',revision=0,latest='',timer=0;
const bank=fetch('assets/audio/manifest.json?v=voice5').then(r=>{if(!r.ok)throw Error('voice manifest');return r.json();}).catch(()=>({}));
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
export function voiceEnabled(){return enabled;}
export function stopSpeech(){
 revision++;clearTimeout(timer);cancelAnimationFrame(frame);frame=0;
 setMusicDucked(false);
 if(audio){audio.pause();audio.onended=null;audio.onerror=null;audio=null;}
 if(scene){stopOpeningSpeech(scene);scene.classList.remove('is-speaking','text-speaking');scene.style.setProperty('--mouth-open','0');}
}
function mouth(amount,time=0){if(scene&&speaker!=='미아'){updateOpeningSpeech(scene,time,amount);return;}if(scene&&!reduced()){scene.classList.add('is-speaking');scene.style.setProperty('--mouth-open',String(amount));}}
function silentSpeech(){
 if(!scene||document.hidden||reduced())return;
 if(speaker!=='미아'){startOpeningText(scene);const current=scene;timer=setTimeout(()=>stopOpeningSpeech(current),12000);return;}
 scene.classList.add('is-speaking','text-speaking');
 const current=scene;timer=setTimeout(()=>{current.classList.remove('is-speaking','text-speaking');},Math.min(4500,Math.max(1400,text.length*70)));
}
export async function replaySpeech(){
 stopSpeech();if(!scene||!text||document.hidden)return;
 const ticket=revision,current=scene;
 if(!enabled){silentSpeech();return;}
 const clips=await bank;if(ticket!==revision||current!==scene||document.hidden)return;
 const clip=clips[text];if(!clip||(clip.speaker||'미아')!==speaker){current.dataset.voiceStatus='음성을 찾을 수 없어요';silentSpeech();return;}
 audio=new Audio('assets/audio/'+clip.file);const playing=audio;
 current.dataset.voiceStatus='재생 중';
 const finish=()=>{if(ticket!==revision)return;stopSpeech();current.dataset.voiceStatus='재생 완료';};
 playing.onended=finish;playing.onerror=()=>{finish();current.dataset.voiceStatus='다시 듣기를 눌러 주세요';};
 try{await playing.play();if(ticket!==revision){playing.pause();return;}setMusicDucked(true);const tick=()=>{
  if(ticket!==revision||playing.paused)return;
  mouth(clip.mouth[Math.floor(playing.currentTime/clip.step)]||0,playing.currentTime);
  frame=requestAnimationFrame(tick);
 };tick();}catch{if(ticket===revision){finish();current.dataset.voiceStatus='다시 듣기를 눌러 주세요';}}
}
export function mountSpeech(root){
 const next=root.querySelector('.scene');
 const line=next?.querySelector('.bubble-copy')||next?.querySelector('.bubble');
 const nextSpeaker=next?.dataset.speaker||'미아';
 const raw=line?.textContent.trim()||'';
 const nextText=raw.startsWith(nextSpeaker)?raw.slice(nextSpeaker.length).trim():raw;
 const identity=nextSpeaker+'\n'+nextText,changed=identity!==latest;
 stopSpeech();scene=next;text=nextText;speaker=nextSpeaker;latest=identity;
 if(changed&&nextText)replaySpeech();
}
export function toggleVoice(){enabled=!enabled;replaySpeech();return enabled;}
if(typeof document!=='undefined')document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSpeech();});
