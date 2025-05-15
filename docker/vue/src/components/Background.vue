<template>
  <div class="background">
    <svg
      :width="width"
      :height="height"
      style="position: absolute; top: 0; left: 0; z-index: -1;"
    >
      <path
        v-for="(line, index) in lines"
        :key="index"
        :d="line.path"
        stroke="red"
        :stroke-width="line.thickness"
        fill="none"
      />
    </svg>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const width = ref(window.innerWidth);
const height = ref(window.innerHeight);
const lines = ref([]);
const numberOfLines = 33;
const waveAmplitude = 22;

const getSegmentLength = () => {
  return width.value < 600
    ? width.value / 3
    : width.value / 10;
};

const generateWavyLine = () => {
  const startX = -0.1 * width.value;
  const endX = width.value;
  const yOffset = Math.random() * height.value;
  const thickness = Math.random() + Math.random();
  const segmentLength = getSegmentLength();
  const points = [];

  for (let x = startX; x < endX; x += segmentLength) {
    const y =
      yOffset +
      Math.sin((x / width.value) * Math.PI * 2 + Math.random() * Math.PI * 2) *
        waveAmplitude;
    points.push({ x, y });
  }
  // Always add the last point exactly at endX
  const yEnd =
    yOffset +
    Math.sin((endX / width.value) * Math.PI * 2 + Math.random() * Math.PI * 2) *
      waveAmplitude;
  points.push({ x: endX, y: yEnd });

  if (points.length < 4) return { path: '', thickness };

  let path = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }

  return { path, thickness };
};

const generateLines = () => {
  lines.value = Array.from({ length: numberOfLines }, generateWavyLine);
};

const handleResize = () => {
  width.value = window.innerWidth;
  height.value = window.innerHeight;
  generateLines();
};

onMounted(() => {
  generateLines();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style>
.background {
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100vh;
  width: 100vw;
  height: 100vh;
  z-index: -100;
  pointer-events: none;
}
</style>