// Utility helpers for SLAB DASH
(function () {
  function clamp(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  function randRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function hasPassedPlatform(playerX, platformX, platformWidth) {
    return playerX > platformX + platformWidth;
  }

  window.utils = { clamp, randRange, hasPassedPlatform };
})();


