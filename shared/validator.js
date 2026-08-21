// Answer validation and grading logic
const Validator = {
  // Check answer based on type
  checkAnswer(userAnswer, correctAnswer, answerType) {
    const sanitized = this.sanitizeAnswer(userAnswer, answerType);
    const correct = this.sanitizeAnswer(correctAnswer, answerType);

    if (!sanitized || !correct) {
      return false;
    }

    switch (answerType) {
      case 'integer':
        return sanitized === correct;

      case 'decimal':
        return Math.abs(parseFloat(sanitized) - parseFloat(correct)) < 0.0001;

      case 'fraction':
        return this.compareFractions(sanitized, correct);

      case 'mixed':
        // Accept both mixed number form and improper fraction form
        return this.compareMixedOrFraction(sanitized, correct);

      default:
        return sanitized === correct;
    }
  },

  sanitizeAnswer(answer, type) {
    if (!answer || typeof answer !== 'string') return null;
    answer = answer.trim();

    switch (type) {
      case 'integer':
        return /^-?\d+$/.test(answer) ? answer : null;

      case 'decimal':
        return /^-?\d+(\.\d+)?$/.test(answer) ? answer : null;

      case 'fraction':
        return /^\d+\/\d+$/.test(answer) ? answer : null;

      case 'mixed':
        // Accept formats like "2 3/4" or improper "11/4"
        return /^(\d+\s)?\d+\/\d+$/.test(answer) ? answer : null;

      default:
        return answer;
    }
  },

  compareFractions(frac1, frac2) {
    const [num1, den1] = frac1.split('/').map(Number);
    const [num2, den2] = frac2.split('/').map(Number);

    // Cross multiply: num1/den1 == num2/den2 if num1*den2 == num2*den1
    return num1 * den2 === num2 * den1;
  },

  compareMixedOrFraction(mixed1, mixed2) {
    const frac1 = this.toImproperFraction(mixed1);
    const frac2 = this.toImproperFraction(mixed2);

    if (!frac1 || !frac2) return false;
    return this.compareFractions(frac1, frac2);
  },

  toImproperFraction(input) {
    // Input can be "2 3/4" or "11/4"
    const mixedMatch = input.match(/^(\d+)\s+(\d+)\/(\d+)$/);
    if (mixedMatch) {
      const whole = parseInt(mixedMatch[1]);
      const num = parseInt(mixedMatch[2]);
      const den = parseInt(mixedMatch[3]);
      return `${whole * den + num}/${den}`;
    }

    const fracMatch = input.match(/^(\d+)\/(\d+)$/);
    if (fracMatch) {
      return input;
    }

    return null;
  },

  // Get next attempt limit message
  getAttemptMessage(attempts, maxAttempts) {
    if (attempts >= maxAttempts) {
      return '더 이상 시도할 수 없습니다.';
    }
    const remaining = maxAttempts - attempts;
    return `${remaining}회 남음`;
  }
};
