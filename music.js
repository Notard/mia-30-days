const files = {
  title: 'assets/music/title.mp3',
  home: 'assets/music/home.mp3',
  riverside: 'assets/music/riverside.mp3',
};

const players = new Map();
let enabled = false;
let ducked = false;
let context = 'title';
let active = null;
let leaving = null;
let animation = 0;
let revision = 0;

const level = () => (ducked ? 0.055 : 0.21);

function player(key) {
  if (!players.has(key)) {
    const audio = new Audio(files[key]);
    audio.loop = true;
    audio.preload = 'none';
    audio.volume = 0;
    players.set(key, audio);
  }
  return players.get(key);
}

function fade(duration = 450) {
  cancelAnimationFrame(animation);
  const next = active;
  const old = leaving;
  const startNext = next?.volume || 0;
  const startOld = old?.volume || 0;
  const goal = enabled && !document.hidden ? level() : 0;
  const start = performance.now();
  function step(now) {
    const amount = Math.min(1, (now - start) / duration);
    const smooth = amount * amount * (3 - 2 * amount);
    if (next) next.volume = startNext + (goal - startNext) * smooth;
    if (old) old.volume = startOld * (1 - smooth);
    if (amount < 1) animation = requestAnimationFrame(step);
    else {
      animation = 0;
      if (old) { old.pause(); if (leaving === old) leaving = null; }
      if (!goal) next?.pause();
    }
  }
  animation = requestAnimationFrame(step);
}

async function playContext() {
  const ticket = ++revision;
  const next = player(context);
  if (active !== next) {
    if (leaving) { leaving.pause(); leaving = null; }
    leaving = active;
    active = next;
    next.volume = 0;
  }
  try {
    await next.play();
    if (ticket !== revision || !enabled || document.hidden) { next.pause(); return; }
    fade(leaving ? 650 : 350);
  } catch {
    if (ticket !== revision) return;
    enabled = false;
    next.pause();
    leaving?.pause();
    leaving = null;
    window.dispatchEvent(new Event('musicchange'));
  }
}

export function musicEnabled() { return enabled; }
export function toggleMusic() {
  enabled = !enabled;
  if (enabled) playContext();
  else { revision++; fade(280); }
  return enabled;
}
export function setMusicDucked(value) {
  if (ducked === value) return;
  ducked = value;
  if (enabled && active) fade(220);
}
export function mountMusic(root, screen, state) {
  const next = screen === 'game' && state?.phase !== 'end'
    ? root.querySelector('.outdoor-activity') ? 'riverside' : 'home'
    : 'title';
  if (context === next) return;
  context = next;
  if (enabled && !document.hidden) playContext();
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    revision++;
    cancelAnimationFrame(animation);
    animation = 0;
    active?.pause();
    if (active) active.volume = 0;
    leaving?.pause();
    leaving = null;
  }
  else if (enabled) playContext();
});
