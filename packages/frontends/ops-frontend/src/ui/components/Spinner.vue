<template>
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="insideCircleOnly">
        <circle cx="50" cy="50" r="50" />
      </clipPath>
    </defs>
    <circle cx="50" cy="50" r="50" clip-path="url(#insideCircleOnly)" />
  </svg>
</template>

<style scoped>
svg {
  width: 1em;
  height: 1em;
  border-radius: 50%;
}

circle {
  fill: transparent;
  stroke: currentColor;
  stroke-width: 50%;
  stroke-dasharray: calc(3.1415 * 75%);
  stroke-dashoffset: calc(3.1415 * 50%);
  transform-origin: center;
  animation: spin-inside 2s linear infinite, spin-outside 1s linear infinite;
}

@keyframes spin-inside {
  0% {
    stroke-dashoffset: calc(3.1415 * 75%);
  }
  100% {
    stroke-dashoffset: calc(3.1415 * -75%);
  }
}

@keyframes spin-outside {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
