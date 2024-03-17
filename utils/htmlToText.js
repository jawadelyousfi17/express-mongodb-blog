htmlToText = (html) =>  html.replace(/<[^>]*>|[\r\n]/g, ' ').replace(/\s{2,}/g, ' ')

function getFirst5Words(str) {
    const words = str.split(/\s+/);
    const first5Words = words.slice(0, 5);
    return first5Words.join(' ');
}
function removeEmptyElements(array) {
    return array.filter(element => {
        // Remove elements that are null, undefined, empty strings, or empty arrays
        return element !== null && element !== undefined &&
               !(typeof element === 'string' && element.trim() === '') &&
               !(Array.isArray(element) && element.length === 0);
    });
}
module.exports = {htmlToText , getFirst5Words , removeEmptyElements }
