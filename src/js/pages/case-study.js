export async function initCaseStudy() {
  const project = document.body.dataset.project;
  console.log(`Initializing Case Study: ${project}`);

  let projectCleanup = null;

  try {
    if (project === "aether-health") {
      const module = await import('../projects/aether-health.js');
      if (module.initAetherHealth) projectCleanup = module.initAetherHealth();
    } else if (project === "quantum-finance") {
      const module = await import('../projects/quantum-finance.js');
      if (module.initQuantumFinance) projectCleanup = module.initQuantumFinance();
    } else if (project === "nova-logistics") {
      const module = await import('../projects/nova-logistics.js');
      if (module.initNovaLogistics) projectCleanup = module.initNovaLogistics();
    }
  } catch (error) {
    console.error(`Error loading project module: ${project}`, error);
  }

  return () => {
    console.log(`Cleaning up Case Study: ${project}`);
    if (projectCleanup) projectCleanup();
  };
}
