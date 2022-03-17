export default function(stylesObject) {
    return Object.entries(stylesObject)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(' ');
}