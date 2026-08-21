// 정답 판정 — 값만 맞으면 정답 (SPEC 4절)
const Validator = {
  // "2 3/4" | "11/4" | "1.25" | "42"  ->  숫자
  toNumber(input) {
    if (input === null || input === undefined) return null;
    const s = String(input).trim().replace(/\s+/g, ' ');
    if (!s) return null;

    let m = s.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);          // 대분수
    if (m) {
      const den = parseInt(m[3], 10);
      if (den === 0) return null;
      const w = parseInt(m[1], 10);
      const frac = parseInt(m[2], 10) / den;
      return w < 0 ? w - frac : w + frac;
    }

    m = s.match(/^(-?\d+)\/(\d+)$/);                       // 분수 (약분 안 해도 됨)
    if (m) {
      const den = parseInt(m[2], 10);
      if (den === 0) return null;
      return parseInt(m[1], 10) / den;
    }

    m = s.match(/^-?\d+(\.\d+)?$/);                        // 정수 / 소수
    if (m) return parseFloat(s);

    return null;
  },

  // 초연이가 넣은 값과 정답을 비교한다.
  // 표기 형태가 달라도(가분수/대분수/약분 전후/소수) 값이 같으면 정답.
  checkAnswer(userAnswer, correctAnswer) {
    const a = this.toNumber(userAnswer);
    const b = this.toNumber(correctAnswer);
    if (a === null || b === null) return false;

    // 분수끼리는 곱셈으로 정확히 비교 (부동소수점 오차 회피)
    const fa = this.toFraction(userAnswer);
    const fb = this.toFraction(correctAnswer);
    if (fa && fb) return fa.n * fb.d === fb.n * fa.d;

    return Math.abs(a - b) < 1e-6;
  },

  // 분수/대분수를 {n, d} 로. 소수는 null.
  toFraction(input) {
    if (input === null || input === undefined) return null;
    const s = String(input).trim().replace(/\s+/g, ' ');

    let m = s.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
    if (m) {
      const w = parseInt(m[1], 10), n = parseInt(m[2], 10), d = parseInt(m[3], 10);
      if (d === 0) return null;
      const total = Math.abs(w) * d + n;
      return { n: (w < 0 ? -total : total), d: d };
    }

    m = s.match(/^(-?\d+)\/(\d+)$/);
    if (m) {
      const d = parseInt(m[2], 10);
      if (d === 0) return null;
      return { n: parseInt(m[1], 10), d: d };
    }

    m = s.match(/^-?\d+$/);
    if (m) return { n: parseInt(s, 10), d: 1 };

    return null;
  },

  isBlank(v) {
    return !v || !String(v).trim();
  }
};
