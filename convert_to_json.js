const fs = require('fs');
const path = './temp_extracted_lieux.js';

try {
    let content = fs.readFileSync(path, 'utf8');

    // Naive strip of variable declaration to get the array literal
    // Looking for [ ... ]
    const start = content.indexOf('[');
    const end = content.lastIndexOf(']');

    if (start !== -1 && end !== -1) {
        let arrayStr = content.substring(start, end + 1);

        // Use eval to parse the JS array literal
        // Check for safety? It's our own file (mostly).
        const data = eval(arrayStr);

        console.log(JSON.stringify(data, null, 2));
    } else {
        console.error("Could not find array brackets [] in file.");
        process.exit(1);
    }

} catch (e) {
    console.error("Error parsing JS:", e.message);
    process.exit(1);
}
