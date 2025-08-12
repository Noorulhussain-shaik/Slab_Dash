(function () {
  const { clamp, randRange, hasPassedPlatform } = window.utils || {};
  const results = document.getElementById('results');

  function log(name, ok, msg = '') {
    const el = document.createElement('div');
    el.className = ok ? 'ok' : 'fail';
    el.textContent = `${ok ? '✓' : '✗'} ${name}${msg ? ' — ' + msg : ''}`;
    results.appendChild(el);
  }

  function approx(a, b, eps = 1e-9) { return Math.abs(a - b) <= eps; }

  // Tests
  try {
    // clamp
    log('clamp: below min', clamp(-5, 0, 10) === 0);
    log('clamp: above max', clamp(99, 0, 10) === 10);
    log('clamp: in range', clamp(5, 0, 10) === 5);

    // randRange
    let rrOk = true;
    for (let i = 0; i < 1000; i++) {
      const v = randRange(2, 3);
      if (!(v >= 2 && v <= 3)) { rrOk = false; break; }
    }
    log('randRange: within [min,max]', rrOk);

    // hasPassedPlatform
    log('hasPassedPlatform: before edge', hasPassedPlatform(100, 80, 30) === false);
    log('hasPassedPlatform: at edge', hasPassedPlatform(110, 80, 30) === false);
    log('hasPassedPlatform: past edge', hasPassedPlatform(111, 80, 30) === true);

    // Additional edge checks
    log('hasPassedPlatform: zero width', hasPassedPlatform(1, 0, 0) === true);
    log('hasPassedPlatform: negative width (safe)', hasPassedPlatform(0, 0, -10) === true);

    const s = document.createElement('div');
    s.className = 'summary';
    s.textContent = 'Done.';
    results.appendChild(s);
  } catch (err) {
    log('Runtime error', false, String(err));
  }
})();


