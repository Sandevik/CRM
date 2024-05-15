export default function (milliSeconds: number): string {
    return `${(milliSeconds / 60) <= 0.5 ? 0 : Math.floor(milliSeconds / 60)}h ${milliSeconds % 60} min`
}