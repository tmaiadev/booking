export default function className(stylesObject) {
    return Object.entries(stylesObject)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(' ');
}