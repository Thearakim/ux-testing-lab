//This is the entry point of your plugin, handling the UI and event messages

import { trackClick, clearHistory } from './clickTracker.js';
import { generateHeatmapOverlay } from './heatmap.js';
import { exportClickData } from './exporter.js';
import { debounce } from './utils.js';

figma.showUI(__html__);
figma.ui.resize(450, 600);

let clickedLayers = [];
let sessionData = [];
let debounceTimeout;

// Automatically track clicks on selected layers
figma.on('selectionchange', () => {
    const selection = figma.currentPage.selection;
    if (selection.length > 0) {
        const layer = selection[0];
        trackClick(layer, clickedLayers, sessionData, debounceTimeout);
    }
});

// Message handler to manage interactions from the UI
figma.ui.onmessage = (msg) => {
    if (msg.type === 'log-click') {
        const selection = figma.currentPage.selection;
        if (selection.length > 0) {
            const layer = selection[0];
            trackClick(layer, clickedLayers, sessionData, debounceTimeout);
        } else {
            figma.notify('Please select a layer to log the click.');
        }
    } else if (msg.type === 'generate-heatmap') {
        generateHeatmapOverlay(clickedLayers);
    } else if (msg.type === 'clear-history') {
        clearHistory(clickedLayers, sessionData);
    } else if (msg.type === 'export-data') {
        exportClickData(clickedLayers);
    }
};
