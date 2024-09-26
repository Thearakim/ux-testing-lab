//This modules contains utility functions that can be reused throughout your code

export function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

export function applyTextStyle(textNode, style) {
    textNode.fontSize = style.fontSize;
    textNode.fontName = { family: style.fontFamily, style: "Regular" };
    textNode.textAlignHorizontal = style.textAlign.toUpperCase();
    textNode.textAutoResize = "WIDTH_AND_HEIGHT";
}
