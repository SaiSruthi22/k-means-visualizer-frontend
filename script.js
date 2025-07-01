// script.js

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let points = [];
let centroids = [];
const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#1abc9c", "#e67e22", "#34495e", "#7f8c8d", "#c0392b"];

function generatePoints(num = 100) {
  points = [];
  for (let i = 0; i < num; i++) {
    points.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      cluster: null
    });
  }
  draw();
}

function getRandomCentroids(k) {
  centroids = [];
  for (let i = 0; i < k; i++) {
    centroids.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    });
  }
}

function assignClusters() {
  points.forEach(point => {
    let minDist = Infinity;
    let cluster = 0;
    centroids.forEach((centroid, i) => {
      const dist = Math.hypot(point.x - centroid.x, point.y - centroid.y);
      if (dist < minDist) {
        minDist = dist;
        cluster = i;
      }
    });
    point.cluster = cluster;
  });
}

function updateCentroids() {
  centroids = centroids.map((_, i) => {
    const clusterPoints = points.filter(p => p.cluster === i);
    const x = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length || 0;
    const y = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length || 0;
    return { x, y };
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw points
  points.forEach(p => {
    ctx.fillStyle = colors[p.cluster] || "#bdc3c7";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
    ctx.fill();
  });

  // Draw centroids
  centroids.forEach((c, i) => {
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.arc(c.x, c.y, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.stroke();
  });
}

function runKMeans() {
  const k = parseInt(document.getElementById("clusters").value);
  if (!k || k < 1) return;

  getRandomCentroids(k);
  let iterations = 5;

  function iterate() {
    if (iterations-- <= 0) return;
    assignClusters();
    updateCentroids();
    draw();
    setTimeout(iterate, 500);
  }

  iterate();
}

generatePoints();
