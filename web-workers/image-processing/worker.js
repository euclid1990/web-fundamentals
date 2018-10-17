/**
 * Get pixel that represented by four one-byte values RGBA (red, green, blue, and alpha)
 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
 * @param {!Number} x, y, width.
 */
function getColorForCoord(x, y, width) {
  const red = ((y * width) + x) * 4;
  return { r: red, g: red + 1, b: red + 2, a: red + 3 };
}

/**
 * Convert color image to grey scale
 */
function greyscale(rgba) {
  // Calculate the luminance of an Image
  const avg = (0.299 * rgba.r) + (0.587 * rgba.g) + (0.114 * rgba.b);
  rgba.r = avg;
  rgba.g = avg;
  rgba.b = avg;
  return rgba;
};

/**
 * Handles incoming messages in the web worker.
 * In this case: increases each pixel's red color by 20%.
 * @param {!Object} d Incoming data.
 */
addEventListener('message', (d) => {
  const imageData = d.data;
  const w = imageData.width;
  const h = imageData.height;
  const data = imageData.data;

  // Iterate pixel rows and columns to change red color of each.
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let rgbaI = getColorForCoord(x, y, w);
      let rgba = { r: data[rgbaI.r], g: data[rgbaI.g], b: data[rgbaI.b], a: data[rgbaI.a] };
      rgba = greyscale(rgba);
      data[rgbaI.r] = rgba.r;
      data[rgbaI.g] = rgba.g;
      data[rgbaI.b] = rgba.b;
    }
  }
  postMessage(imageData, [imageData.data.buffer]);
});
