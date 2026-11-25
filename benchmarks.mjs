export function llm({ requests, inputTokens, cachedPercent, outputTokens, inputRate, cachedRate, outputRate }) {
  const cached = cachedPercent / 100;
  const effectiveInputRate = (1 - cached) * inputRate + cached * cachedRate;
  return requests * (inputTokens * effectiveInputRate + outputTokens * outputRate) / 1_000_000;
}

export function voice({ calls, callSeconds, pauses, pauseSeconds, threshold, activeRate, standbyRate }) {
  const standbySeconds = Math.min(callSeconds, pauses * Math.max(0, pauseSeconds - threshold));
  return calls * ((callSeconds - standbySeconds) * activeRate + standbySeconds * standbyRate) / 60;
}

export function agent({ tasks, turns, failurePercent, attemptCost }) {
  return tasks * turns * attemptCost / (1 - failurePercent / 100);
}

export function photoPages({ photos, perPage }) {
  return Math.ceil(photos / perPage);
}

export function moq({ minimum, caseSize }) {
  const cases = Math.ceil(minimum / caseSize);
  return { units: cases * caseSize, cases };
}

export function gtin({ code }) {
  if (!/^(?:[0-9]{8}|[0-9]{12,14})$/.test(code)) {
    throw new RangeError("Expected a complete GTIN with 8, 12, 13, or 14 digits.");
  }
  const payload = [...code.slice(0, -1)].reverse();
  const sum = payload.reduce((total, digit, index) => total + Number(digit) * (index % 2 === 0 ? 3 : 1), 0);
  const checkDigit = (10 - sum % 10) % 10;
  return { valid: checkDigit === Number(code.at(-1)), checkDigit };
}
