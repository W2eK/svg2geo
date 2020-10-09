module.exports = function parseCircle({ cx, cy }) {
  return {
    geometry: {
      x: +cx || 0,
      y: +cy || 0
    },
    type: 'point'
  };
};
