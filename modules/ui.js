// This module manages the UI logic and interaction

export function initUI() {
    // Initialize UI setup if needed
}

// Function to update the click history in the UI
export function updateClickHistory(clickedLayers) {
    figma.ui.postMessage({ type: 'update-click-history', clickedLayers });
}

// Function to display the heatmap in the UI
export function displayHeatmap(heatmapData) {
    figma.ui.postMessage({ type: 'display-heatmap', heatmapData });
}

// Function to clear the heatmap in the UI
export function clearHeatmap() {
    figma.ui.postMessage({ type: 'clear-heatmap' });
}
