//This module generates and manages the heatmap overlay

export function generateHeatmapOverlay(clickedLayers) {
    const heatmapData = clickedLayers.reduce((acc, layerName) => {
        acc[layerName] = (acc[layerName] || 0) + 1;
        return acc;
    }, {});

    figma.ui.postMessage({ type: 'display-heatmap', heatmapData });
}
