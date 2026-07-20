export function initNovaLogistics() {
  console.log("Nova Logistics Story Init");
  return () => {
    console.log("Nova Logistics Cleanup");
  };
}
