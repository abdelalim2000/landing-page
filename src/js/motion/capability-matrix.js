export function initCapabilityMatrix() {
  const container = document.querySelector('.capability-matrix-container');
  if (!container) return () => {};

  const rows = container.querySelectorAll('.matrix-row');
  const nodes = container.querySelectorAll('.matrix-node:not(.empty)');

  // Hover interactions for rows
  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      // Dim all nodes first
      nodes.forEach(n => {
        const dot = n.querySelector('span');
        if (dot) dot.style.opacity = '0.05';
      });

      // Highlight nodes in this row
      const rowNodes = row.querySelectorAll('.matrix-node:not(.empty)');
      rowNodes.forEach(n => {
        const dot = n.querySelector('span');
        if (dot) {
          dot.style.opacity = '1';
          dot.style.transform = 'scale(1.2)';
        }
      });
    });

    row.addEventListener('mouseleave', () => {
      // Reset all nodes to base state (opacity 0.2, scale 1)
      nodes.forEach(n => {
        const dot = n.querySelector('span');
        if (dot) {
          dot.style.opacity = '0.2';
          dot.style.transform = 'scale(1)';
        }
      });
    });
  });

  return () => {
    // cleanup not strictly necessary for simple mouse listeners if DOM is replaced, but good practice
  };
}
