// 수학 표기 — 분수는 세로로 보여주고, 세로로 입력받는다. (SPEC 5절)
const MathFmt = {
  // ---------- 표시 ----------
  escape(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },

  fracHTML(n, d) {
    return '<span class="frac"><span class="frac-n">' + this.escape(n) +
           '</span><span class="frac-d">' + this.escape(d) + '</span></span>';
  },

  mixedHTML(w, n, d) {
    return '<span class="mixed"><span class="mixed-w">' + this.escape(w) + '</span>' +
           this.fracHTML(n, d) + '</span>';
  },

  // 문장 속의 3/4, 2 3/4 를 진짜 분수 모양으로 바꿔서 HTML로 돌려준다.
  // km/h 처럼 글자가 붙은 것은 건드리지 않는다.
  renderText(text) {
    if (text === null || text === undefined) return '';
    let out = this.escape(text);
    out = out.replace(/(^|[^\w가-힣.\/])(\d+)\s+(\d+)\/(\d+)(?![\w가-힣.\/])/g,
      (m, pre, w, n, d) => pre + this.mixedHTML(w, n, d));
    out = out.replace(/(^|[^\w가-힣.\/])(\d+)\/(\d+)(?![\w가-힣.\/])/g,
      (m, pre, n, d) => pre + this.fracHTML(n, d));
    return out.replace(/\n/g, '<br>');
  },

  // 정답 하나를 보기 좋게
  renderAnswer(answer, unit) {
    const body = this.renderText(String(answer == null ? '' : answer));
    const u = unit ? ' <span class="unit">' + this.escape(unit) + '</span>' : '';
    return body + u;
  },

  // ---------- 입력 ----------
  // type: integer | decimal | fraction | mixed
  buildInput(type, unit) {
    const box = (cls, ph) =>
      '<input type="text" inputmode="decimal" class="ans-box ' + cls + '" ' +
      'placeholder="' + (ph || '') + '" autocomplete="off">';
    let inner = '';

    if (type === 'fraction') {
      inner = '<span class="frac-input">' +
                box('in-num') +
                '<span class="frac-bar"></span>' +
                box('in-den') +
              '</span>';
    } else if (type === 'mixed') {
      inner = '<span class="mixed-input">' +
                box('in-whole') +
                '<span class="frac-input">' +
                  box('in-num') +
                  '<span class="frac-bar"></span>' +
                  box('in-den') +
                '</span>' +
              '</span>';
    } else if (type === 'decimal') {
      inner = '<span class="dec-input">' +
                box('in-int') +
                '<span class="dec-dot">.</span>' +
                box('in-frac') +
              '</span>';
    } else {
      inner = box('in-int');
    }

    const u = unit ? '<span class="unit-label">' + this.escape(unit) + '</span>' : '';
    return '<div class="answer-row">' + inner + u + '</div>';
  },

  // 위젯에서 값을 읽어 "3/4", "2 3/4", "1.25", "42" 형태 문자열로
  readInput(root, type) {
    const val = sel => {
      const el = root.querySelector(sel);
      return el ? el.value.trim() : '';
    };

    if (type === 'fraction') {
      const n = val('.in-num'), d = val('.in-den');
      if (!n || !d) return '';
      return n + '/' + d;
    }
    if (type === 'mixed') {
      const w = val('.in-whole'), n = val('.in-num'), d = val('.in-den');
      if (!n || !d) return '';
      // 정수칸을 비우고 가분수로 넣어도 된다 (SPEC 4절)
      return w ? (w + ' ' + n + '/' + d) : (n + '/' + d);
    }
    if (type === 'decimal') {
      const i = val('.in-int'), f = val('.in-frac');
      if (!i && !f) return '';
      if (!f) return i || '0';
      return (i || '0') + '.' + f;
    }
    return val('.in-int');
  },

  clearInput(root) {
    root.querySelectorAll('.ans-box').forEach(el => { el.value = ''; });
  },

  focusFirst(root) {
    const el = root.querySelector('.ans-box');
    if (el) el.focus();
  }
};
