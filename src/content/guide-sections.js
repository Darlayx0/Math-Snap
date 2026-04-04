import { CORRECT_SCORE, RACE_TARGET } from '../config/constants.js';
import { GAME_MODES } from '../config/modes.js';
import { PATTERN_RUSH_MODE } from '../config/pattern-rush.js';

export function getGuideSections() {
  return [
    {
      id: 'overview',
      icon: 'spark',
      label: 'Overview',
      title: 'Cara kerja Math Snap',
      lead: 'Panduan ringkas untuk memahami flow permainan dalam beberapa detik.',
      highlights: [
        [GAME_MODES.sprint.label, 'Mode arcade klasik dengan target skor tertinggi dalam countdown 60 detik.'],
        [GAME_MODES.race10.label, `Mode clear challenge untuk menuntaskan ${RACE_TARGET} soal benar secepat mungkin.`],
        [GAME_MODES[PATTERN_RUSH_MODE].label, 'Mode sequence-reading untuk menebak angka berikutnya dari deret pola yang dibuat procedural.'],
      ],
      tips: [
        'Mulai dari difficulty yang nyaman lalu naik bertahap.',
        'Gunakan Sprint untuk skor, Race 10 untuk clear speed, Overdrive untuk escalation brutal, dan Pattern Rush untuk pattern recognition cepat.',
      ],
    },
    {
      id: 'scoring',
      icon: 'trophy',
      label: 'Scoring',
      title: 'Sistem skor dan bonus',
      lead: 'Skor bukan hanya soal benar atau salah, tetapi juga soal kecepatan menjaga momentum.',
      highlights: [
        [`Base score +${CORRECT_SCORE}`, 'Setiap jawaban benar selalu memberi skor dasar yang sama besar.'],
        ['Bonus dari combo', 'Semakin cepat menjawab saat combo aktif, bonus tambahannya semakin tinggi.'],
        ['Race 10 tetap pakai skor', 'Walau mode ini mengejar waktu terbaik, skor dan combo tetap dihitung penuh.'],
      ],
      tips: [
        'Jawaban cepat saat combo tinggi paling efektif untuk mengejar skor.',
        'Di Pattern Rush, tiap level combo membuka bonus cepat sampai +12 lagi, lalu turun 1 poin setiap detik.',
      ],
    },
    {
      id: 'combo',
      icon: 'bolt',
      label: 'Combo',
      title: 'Combo, timer, dan penalti',
      lead: 'Combo adalah inti permainan cepat ini. Ia memberi tekanan sekaligus peluang bonus besar.',
      highlights: [
        ['Combo naik saat benar', 'Setiap jawaban benar menaikkan multiplier dan me-reset timer combo.'],
        ['Ring combo adalah indikator waktu', 'Saat ring menipis, berarti waktu menjaga combo hampir habis.'],
        ['Salah menghapus momentum', 'Jawaban salah membuat combo kembali ke nol dan skor tidak bertambah.'],
      ],
      tips: [
        'Perhatikan ring combo, bukan hanya angka skor.',
        'Kecepatan stabil lebih kuat daripada buru-buru lalu sering salah.',
      ],
    },
    {
      id: 'controls',
      icon: 'guide',
      label: 'Controls',
      title: 'Kontrol di desktop dan mobile',
      lead: 'Kontrol dibuat cepat dan sederhana agar fokus tetap di perhitungan.',
      highlights: [
        ['Desktop', 'Gunakan keyboard lalu tekan Enter untuk submit jawaban.'],
        ['Mobile', 'Gunakan keypad bawaan game yang sudah disesuaikan untuk angka, negatif, dan desimal saat division.'],
        ['Pattern Rush', 'Input khusus integer non-negatif; tombol negatif dan desimal tidak dipakai di mode ini.'],
      ],
      tips: [
        'Mode division menerima jawaban desimal.',
        'Jika bermain di layar kecil, fokuskan pandangan ke soal dan HUD atas.',
      ],
    },
    {
      id: 'records',
      icon: 'target',
      label: 'Records',
      title: 'Record dan progres bermain',
      lead: 'Setiap pilihan difficulty menyimpan progresnya sendiri sehingga perkembangan Anda mudah dipantau.',
      highlights: [
        ['Sprint records', 'Menyimpan Best Score, Most Correct, dan High Combo untuk tiap operation + difficulty.'],
        ['Race 10 records', 'Menyimpan Best Score, Best Time, dan High Combo secara terpisah dari mode Sprint.'],
        ['Pattern Rush records', 'Menyimpan Best Score, Most Correct, dan High Combo per difficulty tanpa memakai operation klasik.'],
      ],
      tips: [
        'Gunakan reset progress hanya jika benar-benar ingin menghapus semua catatan Sprint, Race 10, Overdrive, dan Pattern Rush.',
        'Bandingkan record per difficulty untuk melihat peningkatan kemampuan Anda.',
      ],
    },
    {
      id: 'patternrush',
      icon: 'chart',
      label: 'Pattern Rush',
      title: 'Mekanik Mode Pattern Rush',
      lead: 'Baca deret angka, pahami family polanya, lalu masukkan angka berikutnya secara manual secepat mungkin.',
      highlights: [
        ['90 detik tetap', 'Pattern Rush selalu dimainkan dengan timer global 90 detik tanpa bonus atau penalti waktu.'],
        ['Rule engine procedural', 'Sequence dibuat dari family arithmetic, geometric, alternating, second-difference, odd/even, dan Fibonacci-like ringan.'],
        ['Combo 12 detik', 'Jawaban benar memberi base score +100. Saat chain berlanjut, tiap level combo membuka bonus sampai +12 tambahan yang turun 1 poin per detik.'],
      ],
      tips: [
        'Saat salah, soal tetap sama. Gunakan kesempatan itu untuk membaca ulang pola dengan cepat.',
        'Difficulty tinggi membuka family lebih banyak, sequence lebih panjang, dan angka yang jauh lebih besar.',
      ],
    },
    {
      id: 'overdrive',
      icon: 'bolt',
      label: 'Overdrive',
      title: 'Mekanik Mode Overdrive',
      lead: 'Raih skor tanpa batas di mana soal semakin sulit seiring bertambahnya skor.',
      highlights: [
        ['Waktu Bonus (+5s)', 'Mulai dengan 60 detik. Jawaban benar menambah 5 detik (maksimal tabungan waktu 3 menit).'],
        ['Escalation Level', 'Setiap kelipatan skor 1000, level berevolusi dan range angka pada soal akan membesar.'],
        ['Difficulty = Multiplier', 'Pilihan Difficulty menentukan multiplier kelipatan kenaikan range soal pada tiap level (Easy 1.5x hingga Master 12x).'],
      ],
      tips: [
        'Semakin tinggi difficulty, semakin ekstrem angka di level tinggi.',
        'Jaga combo demi meraih milestone 1000 poin lebih cepat.',
      ],
    },
  ];
}
