/**
 * Intro sound design, synthesised at runtime.
 *
 * The rumble of a ten-tonne door and the crack of a stone seal are generated
 * with the Web Audio API rather than shipped as files — it keeps the payload
 * at zero bytes and lets the sounds be shaped precisely against the animation
 * timings. Everything is created on demand and disposed when it finishes.
 */

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Shared noise source — the raw material for stone, dust and rumble. */
function noiseBuffer(ac: AudioContext, seconds: number) {
  const len = Math.floor(ac.sampleRate * seconds);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    // Brown noise: heavier and more "geological" than white
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buf;
}

/**
 * The doors moving: a long, low, swelling rumble with a slow filter sweep.
 * `seconds` should match the door animation so sound and motion end together.
 */
export function playRumble(seconds = 4.2, gain = 0.55) {
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime;

  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac, seconds);

  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(90, t0);
  lp.frequency.linearRampToValueAtTime(320, t0 + seconds * 0.45);
  lp.frequency.linearRampToValueAtTime(70, t0 + seconds);
  lp.Q.value = 1.1;

  // A sub-bass sine underneath gives it weight on real speakers
  const sub = ac.createOscillator();
  sub.type = "sine";
  sub.frequency.setValueAtTime(34, t0);
  sub.frequency.linearRampToValueAtTime(26, t0 + seconds);

  const subGain = ac.createGain();
  subGain.gain.setValueAtTime(0.0001, t0);
  subGain.gain.exponentialRampToValueAtTime(gain * 0.6, t0 + 0.5);
  subGain.gain.exponentialRampToValueAtTime(0.0001, t0 + seconds);

  const out = ac.createGain();
  out.gain.setValueAtTime(0.0001, t0);
  out.gain.exponentialRampToValueAtTime(gain, t0 + 0.35);
  out.gain.setValueAtTime(gain, t0 + seconds * 0.6);
  out.gain.exponentialRampToValueAtTime(0.0001, t0 + seconds);

  src.connect(lp).connect(out).connect(ac.destination);
  sub.connect(subGain).connect(ac.destination);

  src.start(t0);
  sub.start(t0);
  src.stop(t0 + seconds);
  sub.stop(t0 + seconds);
  src.onended = () => {
    src.disconnect();
    lp.disconnect();
    out.disconnect();
    subGain.disconnect();
  };
}

/** The seal splitting: a sharp transient with a short stony tail. */
export function playCrack(gain = 0.5) {
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime;
  const dur = 0.9;

  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac, dur);

  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(1800, t0);
  bp.frequency.exponentialRampToValueAtTime(180, t0 + dur);
  bp.Q.value = 0.8;

  const out = ac.createGain();
  out.gain.setValueAtTime(gain, t0);
  out.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  src.connect(bp).connect(out).connect(ac.destination);
  src.start(t0);
  src.stop(t0 + dur);
  src.onended = () => {
    src.disconnect();
    bp.disconnect();
    out.disconnect();
  };
}

/** Dust and grit falling away after the break. */
export function playDust(gain = 0.22) {
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime;
  const dur = 2.6;

  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac, dur);

  const hp = ac.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.setValueAtTime(2200, t0);
  hp.frequency.exponentialRampToValueAtTime(700, t0 + dur);

  const out = ac.createGain();
  out.gain.setValueAtTime(0.0001, t0);
  out.gain.exponentialRampToValueAtTime(gain, t0 + 0.18);
  out.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  src.connect(hp).connect(out).connect(ac.destination);
  src.start(t0);
  src.stop(t0 + dur);
  src.onended = () => {
    src.disconnect();
    hp.disconnect();
    out.disconnect();
  };
}
