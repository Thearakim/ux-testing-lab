//This module handles tracking clicks on layer

import { debounce } from './utils.js';

export function trackClick(layer, clickedLayers, sessionData, debounceTimeout) {
    clickedLayers.push(layer.name);
    sessionData.push({
        layerName: layer.name,
        time: new Date().toISOString(),
    });

    debounce(() => {
        figma.notify(`Automatically logged click on: ${layer.name}`, { timeout: 1000 });
    }, 300)();

    figma.ui.postMessage({ type: 'update-click-history', clickedLayers });
}

export function clearHistory(clickedLayers, sessionData) {
    clickedLayers.length = 0;
    sessionData.length = 0;
    figma.notify('Click history cleared.');
    figma.ui.postMessage({ type: 'clear-history' });
}
