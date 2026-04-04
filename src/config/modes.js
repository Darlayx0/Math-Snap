import { PATTERN_RUSH_MODE } from './pattern-rush.js';

export const GAME_MODES = {
  sprint: {
    label: 'Sprint 60s',
    icon: 'time',
    menuDesc: 'Kumpulkan skor setinggi mungkin dalam countdown 60 detik.',
    resultTitle: "Time's Up!",
  },
  race10: {
    label: 'Race 10',
    icon: 'target',
    menuDesc: 'Selesaikan 10 soal benar secepat mungkin sambil menjaga combo.',
    resultTitle: 'Race Complete!',
  },
  overdrive: {
    label: 'Overdrive',
    icon: 'bolt',
    menuDesc: 'Mulai 60s, +5s per benar, cap 3 menit. Soal berevolusi tiap kelipatan skor 1000.',
    resultTitle: 'Overdrive Complete!',
  },
  [PATTERN_RUSH_MODE]: {
    label: 'Pattern Rush',
    icon: 'chart',
    menuDesc: 'Baca pola angka, tebak angka berikutnya, dan jaga combo 12 detik secepat mungkin.',
    resultTitle: 'Pattern Rush Complete!',
  },
};
