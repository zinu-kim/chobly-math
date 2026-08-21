// 저장 / 공유코드 (SPEC 7절, 8절)
const Storage = {
  MAX_HISTORY: 5,

  // ---------- UTF-8 안전 base64 (한글이 들어가므로 btoa 직접 사용 불가) ----------
  b64encode(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    bytes.forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin);
  },

  b64decode(b64) {
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  },

  // ---------- 공유코드 ----------
  // 코드가 길어지지 않도록 키를 짧게 쓴다.
  encodeShareData(problems) {
    const payload = {
      v: 1,
      p: problems.map(p => {
        const o = { q: p.question, a: p.answer, t: p.type || 'integer' };
        if (p.unit) o.u = p.unit;
        if (p.explanation) o.e = p.explanation;
        return o;
      })
    };
    return 'CHOBLY-1:' + this.b64encode(JSON.stringify(payload));
  },

  decodeShareData(raw) {
    if (!raw) return null;
    const text = String(raw).trim().replace(/\s+/g, '');
    const i = text.indexOf('CHOBLY-1:');
    if (i === -1) return null;
    try {
      const data = JSON.parse(this.b64decode(text.slice(i + 9)));
      if (!data || !Array.isArray(data.p) || data.p.length === 0) return null;
      return data.p.map(p => ({
        question: p.q || '',
        answer: p.a == null ? '' : String(p.a),
        unit: p.u || '',
        type: p.t || 'integer',
        explanation: p.e || ''
      }));
    } catch (e) {
      return null;
    }
  },

  // ---------- 공통 이력 (최근 5개, 6번째를 만들면 맨 아래가 사라진다) ----------
  _read(key) {
    try {
      const d = localStorage.getItem(key);
      return d ? JSON.parse(d) : [];
    } catch (e) {
      return [];
    }
  },

  _write(key, list) {
    try {
      localStorage.setItem(key, JSON.stringify(list.slice(0, this.MAX_HISTORY)));
    } catch (e) {
      // 저장 공간이 없으면 조용히 넘어간다 (문제 풀이는 계속 가능해야 함)
    }
  },

  // ---------- 아빠 앱 ----------
  PARENT_KEY: 'chobly_parent_sets',

  saveParentSet(set) {
    const list = this._read(this.PARENT_KEY);
    const entry = Object.assign({
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      isNew: true
    }, set);
    list.unshift(entry);
    this._write(this.PARENT_KEY, list);
    return entry.id;
  },

  getParentSets() {
    return this._read(this.PARENT_KEY);
  },

  // ---------- 초연이 앱 ----------
  KID_KEY: 'chobly_kid_sets',

  saveKidSet(problems) {
    const list = this._read(this.KID_KEY);
    const entry = {
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      isNew: true,
      problems: problems,
      results: {}   // { 문제번호: 'correct' | 'wrong' }
    };
    list.unshift(entry);
    this._write(this.KID_KEY, list);
    return entry.id;
  },

  getKidSets() {
    return this._read(this.KID_KEY);
  },

  getKidSet(id) {
    return this.getKidSets().find(s => s.id === id) || null;
  },

  saveKidResult(id, index, result) {
    const list = this._read(this.KID_KEY);
    const set = list.find(s => s.id === id);
    if (!set) return;
    set.results[index] = result;
    this._write(this.KID_KEY, list);
  },

  markRead(key, id) {
    const list = this._read(key);
    const set = list.find(s => s.id === id);
    if (set && set.isNew) {
      set.isNew = false;
      this._write(key, list);
    }
  },

  // 안 풀었거나 틀린 문제 번호들
  wrongIndexes(set) {
    const out = [];
    set.problems.forEach((_, i) => {
      if (set.results[i] !== 'correct') out.push(i);
    });
    return out;
  }
};
