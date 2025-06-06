export function playSuccessSound(): void {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()

  function tone(freq: number, delay: number, duration: number, gainValue: number) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)

    gain.gain.setValueAtTime(0, ctx.currentTime + delay)
    gain.gain.linearRampToValueAtTime(gainValue, ctx.currentTime + delay + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime + delay)
    osc.stop(ctx.currentTime + delay + duration)
  }

  tone(880, 0, 0.25, 0.5) // A5
  tone(1320, 0.05, 0.2, 0.3) // E6
}

export function playErrorSound(): void {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()

  function tone(freq: number, delay: number, duration: number, gainValue: number) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)

    gain.gain.setValueAtTime(0, ctx.currentTime + delay)
    gain.gain.linearRampToValueAtTime(gainValue, ctx.currentTime + delay + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime + delay)
    osc.stop(ctx.currentTime + delay + duration)
  }

  tone(220, 0, 0.3, 0.5) // A3
  tone(110, 0.1, 0.3, 0.4) // A2, drop for dramatic feel
}
