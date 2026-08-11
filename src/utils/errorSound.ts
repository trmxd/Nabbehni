let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextConstructor = window.AudioContext
    ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextConstructor) return null;

  try {
    audioContext ??= new AudioContextConstructor();
    return audioContext;
  } catch {
    return null;
  }
}

export function unlockErrorSound(): void {
  const context = getAudioContext();
  if (context?.state === 'suspended') void context.resume().catch(() => undefined);
}

function playTone(context: AudioContext, frequency: number, start: number, duration: number, volume: number) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export async function playErrorSound(): Promise<void> {
  const context = getAudioContext();
  if (!context) return;

  try {
    if (context.state === 'suspended') await context.resume();
    if (context.state !== 'running') return;
    const start = context.currentTime + 0.02;
    playTone(context, 659.25, start, 0.2, 0.045);
    playTone(context, 783.99, start + 0.11, 0.24, 0.035);
  } catch {
    // بعض المتصفحات تمنع الصوت قبل أول تفاعل؛ يبقى التنبيه البصري متاحًا.
  }
}
