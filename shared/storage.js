// Storage management for Chobly Math
const Storage = {
  // Parent app storage
  saveParentProblemSet(problemSet) {
    const sets = this.getParentProblemSets();
    sets.unshift({
      ...problemSet,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isNew: true
    });
    sets.splice(5); // Keep last 5
    localStorage.setItem('chobly_parent_problems', JSON.stringify(sets));
    return sets[0].id;
  },

  getParentProblemSets() {
    const data = localStorage.getItem('chobly_parent_problems');
    return data ? JSON.parse(data) : [];
  },

  getParentProblemSet(id) {
    const sets = this.getParentProblemSets();
    return sets.find(p => p.id === id);
  },

  markParentProblemRead(id) {
    const sets = this.getParentProblemSets();
    const problem = sets.find(p => p.id === id);
    if (problem) {
      problem.isNew = false;
      localStorage.setItem('chobly_parent_problems', JSON.stringify(sets));
    }
  },

  // Kid app storage
  saveKidSession(problemSetId, photoUrl, aiResponse) {
    const session = {
      id: Date.now().toString(),
      problemSetId,
      photoUrl,
      aiResponse,
      problems: this.parseProblems(aiResponse),
      attemptCounts: {},
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(`chobly_kid_session_${session.id}`, JSON.stringify(session));
    return session.id;
  },

  getKidSession(sessionId) {
    const data = localStorage.getItem(`chobly_kid_session_${sessionId}`);
    return data ? JSON.parse(data) : null;
  },

  updateKidSessionAttempt(sessionId, problemIndex, attempts) {
    const session = this.getKidSession(sessionId);
    if (session) {
      session.attemptCounts[problemIndex] = attempts;
      localStorage.setItem(`chobly_kid_session_${sessionId}`, JSON.stringify(session));
    }
  },

  // Encoding/Decoding for sharing
  encodeShareData(data) {
    const json = JSON.stringify(data);
    return 'CHOBLY-1:' + btoa(json);
  },

  decodeShareData(encoded) {
    if (!encoded.startsWith('CHOBLY-1:')) return null;
    try {
      return JSON.parse(atob(encoded.slice(9)));
    } catch (e) {
      return null;
    }
  },

  parseProblems(aiResponse) {
    // Parse problems from AI response
    // Expected format contains problem objects with question, answer, unit, etc.
    try {
      const match = aiResponse.match(/\[.*\]/s);
      if (match) {
        const problems = JSON.parse(match[0]);
        return Array.isArray(problems) ? problems : [];
      }
    } catch (e) {
      console.error('Failed to parse problems:', e);
    }
    return [];
  }
};
