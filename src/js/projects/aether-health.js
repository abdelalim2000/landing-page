export function initAetherHealth() {
  console.log("Aether Health Story Init");
  return () => {
    console.log("Aether Health Cleanup");
  };
}
