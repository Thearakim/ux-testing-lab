import { trackClick } from './clickTracker.js';
import { generateHeatmapOverlay } from './heatmap.js';
import { exportClickData } from './exporter.js';
import { debounce } from './utils.js';
import { clearHeatmap } from './ui.js'; 

// Display the UI defined in ui.html
figma.showUI(__html__);

// Resize the plugin window
figma.ui.resize(450, 600);

// Global variables to store clicked layers, session data, and debounce control
let clickedLayers = [];
let sessionData = [];
let debounceTimeout;
let replayInterval;
let replayIndex = 0;
let replaySpeed = 1000; // 1-second interval by default

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
    console.log("Received message:", msg); // Debugging line
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
    } else if (msg.type === 'clear-heatmap') {
        clearHeatmap(); 
        figma.notify('Heatmap cleared.'); // Inform the user
    } else if (msg.type === 'export-data') {
        exportClickData(clickedLayers);
    } else if (msg.type === 'start-replay') {
        if (replayInterval) {
            stopReplaySession();
        } else {
            startReplaySession();
        }
        figma.ui.postMessage({ type: replayInterval ? 'replay-stopped' : 'replay-started' });
    } else if (msg.type === 'set-replay-speed') {
        replaySpeed = msg.speed;
        if (replayInterval) {
            stopReplaySession();
            startReplaySession();
        }
    }
};

// Function to clear history
function clearHistory(clickedLayers, sessionData) {
    clickedLayers.length = 0;
    sessionData.length = 0;
    figma.notify('Click history cleared.');
    figma.ui.postMessage({ type: 'clear-history' });
}

function startReplaySession() {
    replayIndex = 0;
    replayInterval = setInterval(() => {
        if (replayIndex < sessionData.length) {
            const click = sessionData[replayIndex];
            const layer = figma.currentPage.findOne(node => node.name === click.layerName);
            if (layer) {
                figma.currentPage.selection = [layer];
                figma.viewport.scrollAndZoomIntoView([layer]);
                figma.notify(`Replaying click on: ${layer.name}`);
            }
            replayIndex++;
        } else {
            stopReplaySession();
        }
    }, replaySpeed);
}

function stopReplaySession() {
    clearInterval(replayInterval);
    replayInterval = null;
    figma.notify("Replay session stopped.");
}