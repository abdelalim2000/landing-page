export function initQuantumFinance() {
  console.log("Quantum Finance Story Init");
  return () => {
    console.log("Quantum Finance Cleanup");
  };
}
