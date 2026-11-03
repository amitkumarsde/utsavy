// Tanpura (Indian drone) music made in the browser with the Web Audio API.
// No audio file needed: four strings are plucked again and again in a loop.

const SA = 138.59 // C#3 — a common tanpura tuning
const STRINGS = [SA * 0.75, SA, SA, SA / 2]
const GAPS = [0.95, 0.95, 0.95, 1.7]

// Fake room echo (reverb) made from fading random noise.
function buildImpulse(ctx, seconds = 3.2) {
  const length = Math.floor(ctx.sampleRate * seconds)
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate)
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel)
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.6)
    }
  }
  return impulse
}

function buildWave(ctx) {
  const size = 32
  const real = new Float32Array(size)
  const imag = new Float32Array(size)
  for (let n = 1; n < size; n++) {
    // Extra strength in the middle overtones gives the buzzy tanpura sound.
    const bump = n > 5 && n < 13 ? 1.6 : 1
    imag[n] = (bump / Math.pow(n, 0.85)) * (n % 2 ? 1 : 0.8)
  }
  return ctx.createPeriodicWave(real, imag)
}

// Returns `start()` and `stop()` controls for the music.
export function createTanpura() {
  let ctx = null
  let master = null
  let wave = null
  let reverb = null
  let timer = null
  let nextTime = 0
  let step = 0

  function setup() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return false
    ctx = new AudioCtx()
    wave = buildWave(ctx)

    master = ctx.createGain()
    master.gain.value = 0

    const tone = ctx.createBiquadFilter()
    tone.type = 'lowpass'
    tone.frequency.value = 4200

    reverb = ctx.createConvolver()
    reverb.buffer = buildImpulse(ctx)
    const wet = ctx.createGain()
    wet.gain.value = 0.55

    master.connect(tone)
    tone.connect(ctx.destination)
    tone.connect(reverb)
    reverb.connect(wet)
    wet.connect(ctx.destination)
    return true
  }

  // Plays one string: quick attack, slow fade, and a filter sweep for the buzz.
  function pluck(freq, time) {
    const voice = ctx.createGain()
    voice.gain.setValueAtTime(0.0001, time)
    voice.gain.exponentialRampToValueAtTime(0.32, time + 0.02)
    voice.gain.exponentialRampToValueAtTime(0.0001, time + 5.2)

    const jawari = ctx.createBiquadFilter()
    jawari.type = 'lowpass'
    jawari.Q.value = 7
    jawari.frequency.setValueAtTime(450, time)
    jawari.frequency.exponentialRampToValueAtTime(3200, time + 1.1)
    jawari.frequency.exponentialRampToValueAtTime(700, time + 4.5)

    ;[-4, 3].forEach((detune) => {
      const osc = ctx.createOscillator()
      osc.setPeriodicWave(wave)
      osc.frequency.value = freq
      osc.detune.value = detune
      osc.connect(jawari)
      osc.start(time)
      osc.stop(time + 5.4)
    })

    jawari.connect(voice)
    voice.connect(master)
  }

  // Queues the next plucks a little ahead of time so the loop never stutters.
  function schedule() {
    while (nextTime < ctx.currentTime + 0.4) {
      const index = step % STRINGS.length
      pluck(STRINGS[index], nextTime)
      nextTime += GAPS[index]
      step++
    }
  }

  return {
    async start() {
      if (!ctx && !setup()) return false
      await ctx.resume()
      nextTime = ctx.currentTime + 0.1
      step = 0
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 2)
      clearInterval(timer)
      timer = setInterval(schedule, 120)
      schedule()
      return true
    },
    stop() {
      if (!ctx) return
      clearInterval(timer)
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8)
      setTimeout(() => ctx && ctx.state === 'running' && !timer && ctx.suspend(), 900)
      timer = null
    },
  }
}
