export default function getBgColor(position: number, total: number) {
    if (total <= 1) return 'hsl(120, 65%, 55%)';

    const startHue = 120;
    const endHue = 0;
    const hue = startHue + ((endHue - startHue) * (position - 1)) / (total - 1);

    return `hsl(${hue}, 65%, 55%)`;
}

export function getBorderColor(position: number, total: number) {
    if (total <= 1) return 'hsl(120, 65%, 55%)';

    const startHue = 120;
    const endHue = 0;
    const hue = startHue + ((endHue - startHue) * (position - 1)) / (total - 1);

    return `hsl(${hue}, 65%, 70%)`;
}