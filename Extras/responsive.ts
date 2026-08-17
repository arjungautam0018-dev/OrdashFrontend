import { Dimensions, PixelRatio } from "react-native";

const BASE_WIDTH  = 360; // base design width in dp (720px / 2x density = 360dp)
const BASE_HEIGHT = 800; // base design height in dp (1600px / 2x density = 800dp)

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Scale relative to design width
const scaleW = SCREEN_W / BASE_WIDTH;
const scaleH = SCREEN_H / BASE_HEIGHT;

/**
 * Scale a horizontal/width dimension
 */
export const sw = (size: number): number =>
    Math.round(PixelRatio.roundToNearestPixel(size * scaleW));

/**
 * Scale a vertical/height dimension
 */
export const sh = (size: number): number =>
    Math.round(PixelRatio.roundToNearestPixel(size * scaleH));

/**
 * Scale font size — uses the smaller axis scale to avoid text overflow
 */
export const sf = (size: number): number => {
    const scale = Math.min(scaleW, scaleH);
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Uniform scale (width-based) for padding, margin, borderRadius etc.
 */
export const s = sw;

export { SCREEN_W, SCREEN_H };
