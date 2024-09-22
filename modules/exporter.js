//This module handles exporting the click data report

import { applyTextStyle } from './utils.js';

export async function exportClickData(clickedLayers) {
    try {
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        const reportPage = figma.createPage();
        reportPage.name = "UX Click Data Report";
        figma.currentPage = reportPage;

        let yOffset = 40;
        const padding = 40;

        const title = figma.createText();
        title.characters = "UX Interaction Report: Click Data Analysis";
        applyTextStyle(title, { fontFamily: "Inter", fontSize: 32, textAlign: "LEFT" });
        title.x = padding;
        title.y = yOffset;
        reportPage.appendChild(title);

        // Summary section
        yOffset += 50; // Add some spacing
        const summaryContent = figma.createText();
        const uniqueLayers = new Set(clickedLayers).size;
        const totalClicks = clickedLayers.length;
        summaryContent.characters = `This report captures a total of ${totalClicks} clicks across ${uniqueLayers} unique layers.`;
        applyTextStyle(summaryContent, { fontFamily: "Inter", fontSize: 16, textAlign: "LEFT" });
        summaryContent.x = padding;
        summaryContent.y = yOffset;
        reportPage.appendChild(summaryContent);

        // Detailed breakdown section
        yOffset += 80; // Add some spacing
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
            reportPage.appendChild(layerDetail);
            yOffset += 50;
        }

        figma.notify("Click data report has been created successfully.");
    } catch (error) {
        console.error("Error exporting click data:", error);
        figma.notify("Failed to export click data. Please try again.");
    }
}
