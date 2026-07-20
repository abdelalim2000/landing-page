export function initWork() {
  console.log("Initializing Work Page...");
  return () => {
    console.log("Cleaning up Work Page...");
  };
}
