// Display the UI defined in ui.html
figma.showUI(__html__);

// Resize the plugin window
figma.ui.resize(450, 600);

// Global variables to store clicked layers, session data, and replay control
let clickedLayers = [];
let sessionData = [];
let debounceTimeout;
let replayInterval;
let replayIndex = 0;
let replaySpeed = 1000; // 1-second interval by default

// Function to debounce the notification
function debounce(func, wait) {
    return function (...args) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Automatically track clicks on selected layers
figma.on('selectionchange', () => {
    const selection = figma.currentPage.selection;
    if (selection.length > 0) {
        const layer = selection[0];
        trackClick(layer);
    }
});

function trackClick(layer) {
    clickedLayers.push(layer.name);
    sessionData.push({
        layerName: layer.name,
        time: new Date().toISOString(),
    });

    // Use debounce to control the frequency of notifications
    debounce(() => {
        figma.notify(`Automatically logged click on: ${layer.name}`, { timeout: 1000 });
    }, 300)();

    // Update the plugin's UI with the new click history
    figma.ui.postMessage({ type: 'update-click-history', clickedLayers });
}

// Generate a heatmap based on the number of clicks
function generateHeatmapOverlay() {
    const heatmapData = clickedLayers.reduce((acc, layerName) => {
        acc[layerName] = (acc[layerName] || 0) + 1;
        return acc;
    }, {});

    // Send the heatmap data to the UI for display
    figma.ui.postMessage({ type: 'display-heatmap', heatmapData });
}

// Function to export click data
async function exportClickData() {
    try {
        // Load the necessary font before creating any text nodes
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });

        // Create a new Figma page for the report
        const reportPage = figma.createPage();
        reportPage.name = "UX Click Data Report";
        figma.currentPage = reportPage;

        // Initial Y offset and padding
        let yOffset = 40;
        const padding = 40;

        // Create a text node for the title
        const title = figma.createText();
        title.characters = "UX Interaction Report: Click Data Analysis";
        applyTextStyle(title, { fontFamily: "Inter", fontSize: 32, textAlign: "LEFT" });
        title.x = padding;
        title.y = yOffset;
        reportPage.appendChild(title);

        // Subtitle text node
        yOffset += 50; // Add some spacing
        const subtitle = figma.createText();
        subtitle.characters = "A comprehensive analysis of user interactions.";
        applyTextStyle(subtitle, { fontFamily: "Inter", fontSize: 18, textAlign: "LEFT" });
        subtitle.x = padding;
        subtitle.y = yOffset;
        reportPage.appendChild(subtitle);

        // Summary section title
        yOffset += 80; // Add some spacing
        const summaryTitle = figma.createText();
        summaryTitle.characters = "Summary of Click Data";
        applyTextStyle(summaryTitle, { fontFamily: "Inter", fontSize: 24, textAlign: "LEFT" });
        summaryTitle.x = padding;
        summaryTitle.y = yOffset;
        reportPage.appendChild(summaryTitle);

        // Summary content
        yOffset += 40; // Add some spacing
        const uniqueLayers = new Set(clickedLayers).size;
        const totalClicks = clickedLayers.length;
        const summaryContent = figma.createText();
        summaryContent.characters = `This report captures a total of ${totalClicks} clicks across ${uniqueLayers} unique layers. The analysis provides insights into user behavior and identifies the most interacted elements.`;
        applyTextStyle(summaryContent, { fontFamily: "Inter", fontSize: 16, textAlign: "LEFT" });
        summaryContent.x = padding;
        summaryContent.y = yOffset;
        summaryContent.resize(600, summaryContent.height); // Adjust width and height to fit content
        reportPage.appendChild(summaryContent);

        // Detailed breakdown section title
        yOffset += 80; // Add some spacing
        const breakdownTitle = figma.createText();
        breakdownTitle.characters = "Detailed Breakdown of Interactions";
        applyTextStyle(breakdownTitle, { fontFamily: "Inter", fontSize: 24, textAlign: "LEFT" });
        breakdownTitle.x = padding;
        breakdownTitle.y = yOffset;
        reportPage.appendChild(breakdownTitle);

        // Iterate over each unique layer and add to the breakdown
        yOffset += 40; // Add some spacing
        const layerCounts = clickedLayers.reduce((acc, layer) => {
            acc[layer] = (acc[layer] || 0) + 1;
            return acc;
        }, {});

        for (const [layerName, count] of Object.entries(layerCounts)) {
            const layerDetail = figma.createText();
            layerDetail.characters = `Layer: ${layerName}\nClicks: ${count}`;
            applyTextStyle(layerDetail, { fontFamily: "Inter", fontSize: 16, textAlign: "LEFT" });
            layerDetail.x = padding;
            layerDetail.y = yOffset;
            layerDetail.resize(600, layerDetail.height); // Adjust width and height to fit content
            reportPage.appendChild(layerDetail);

            yOffset += 50;
        }

        // Heatmap section
        yOffset += 40; // Add some spacing
        const heatmapTitle = figma.createText();
        heatmapTitle.characters = "Heatmap of Click Interactions";
        applyTextStyle(heatmapTitle, { fontFamily: "Inter", fontSize: 24, textAlign: "LEFT" });
        heatmapTitle.x = padding;
        heatmapTitle.y = yOffset;
        reportPage.appendChild(heatmapTitle);

        const heatmapDescription = figma.createText();
        heatmapDescription.characters = "The heatmap below shows the distribution of clicks across different layers. Warmer colors indicate higher interaction frequencies.";
        applyTextStyle(heatmapDescription, { fontFamily: "Inter", fontSize: 16, textAlign: "LEFT" });
        heatmapDescription.x = padding;
        heatmapDescription.y = yOffset + 40;
        heatmapDescription.resize(600, heatmapDescription.height); // Adjust width and height to fit content
        reportPage.appendChild(heatmapDescription);

        // Conclusion section
        yOffset += 120; // Add some spacing
        const conclusionTitle = figma.createText();
        conclusionTitle.characters = "Conclusion and Recommendations";
        applyTextStyle(conclusionTitle, { fontFamily: "Inter", fontSize: 24, textAlign: "LEFT" });
        conclusionTitle.x = padding;
        conclusionTitle.y = yOffset;
        reportPage.appendChild(conclusionTitle);

        yOffset += 40; // Add some spacing
        const conclusionContent = figma.createText();
        conclusionContent.characters = "This analysis reveals key interaction hotspots. Consider focusing on these areas to enhance usability and reduce friction.";
        applyTextStyle(conclusionContent, { fontFamily: "Inter", fontSize: 16, textAlign: "LEFT" });
        conclusionContent.x = padding;
        conclusionContent.y = yOffset;
        conclusionContent.resize(600, conclusionContent.height);
        reportPage.appendChild(conclusionContent);

        figma.notify("Click data report has been created successfully.");
    } catch (error) {
        console.error("Error exporting click data:", error);
        figma.notify("Failed to export click data. Please try again.");
    }
}

// Helper function to apply text styles
function applyTextStyle(textNode, style) {
    textNode.fontSize = style.fontSize;
    textNode.fontName = { family: style.fontFamily, style: "Regular" };

    // Set text alignment
    textNode.textAlignHorizontal = style.textAlign.toUpperCase();
    textNode.textAutoResize = "WIDTH_AND_HEIGHT";
}


// Message handler to manage interactions from the UI
figma.ui.onmessage = (msg) => {
    if (msg.type === 'log-click') {
        const selection = figma.currentPage.selection;
        if (selection.length > 0) {
            const layer = selection[0];
            trackClick(layer);
        } else {
            figma.notify('Please select a layer to log the click.');
        }
    } else if (msg.type === 'generate-heatmap') {
        generateHeatmapOverlay();
    } else if (msg.type === 'clear-history') {
        clickedLayers = [];
        sessionData = [];
        figma.notify('Click history cleared.');
        figma.ui.postMessage({ type: 'clear-history' });
    } else if (msg.type === 'clear-heatmap') {
        figma.ui.postMessage({ type: 'clear-heatmap' });
    } else if (msg.type === 'export-data') {
        exportClickData();
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
