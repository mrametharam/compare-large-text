// Get the textareas and button
const textarea1 = document.getElementById('primaryCode');
const textarea2 = document.getElementById('secondaryCode');
const compareButton = document.getElementById('compare-button');

// Add event listener to compare button
compareButton.addEventListener('click', compareTextareas);

function compareTextareas() {
    compareStrings(textarea1.value, textarea2.value);
}

// Function to compare textareas
function compareStrings(string1, string2) {
    // Get the contents of the textareas and split them into arrays of lines
    const lines1 = string1.split('\n');
    const lines2 = string2.split('\n');

    // Initialize results array
    const results1 = [];
    const results2 = [];

    // Loop through the lines and compare them
    for (let i = 0; i < Math.max(lines1.length, lines2.length); i++) {
        const line1 = lines1[i];
        const line2 = lines2[i];

        if ((line1 ?? '') === (line2 ?? '')) {
            console.log(1, i, line1, line2);

            results1.push({ line: line1 ?? '', type: 'same', lineNumber: i + 1 });
            results2.push({ line: line2 ?? '', type: 'same', lineNumber: i + 1 });
        }

        else if ((line1 === undefined || line1 === '') && line2 !== '' && line2 !== undefined) {
            console.log(2, i, line1, line2);

            results1.push({ line: '', type: '', lineNumber: i + 1 });
            results2.push({ line: line2, type: 'add', lineNumber: i + 1 });
        }

        else if ((line2 === undefined || line2 === '') && line1 !== '' && line1 !== undefined) {
            console.log(3, i, line1, line2);

            results1.push({ line: line1, type: 'remove', lineNumber: i + 1 });
            results2.push({ line: '', type: '', lineNumber: i + 1 });
        }

        else if (line1 !== line2) {
            console.log(4, i, line1, line2);

            if (calculateDiff(line1, line2) < 0.25) {
                results1.push({ line: highlightDiff(line1 ?? '', line2 ?? '', line1 ?? ''), type: '', lineNumber: i + 1 });
                results2.push({ line: highlightDiff(line1 ?? '', line2 ?? '', line2 ?? ''), type: '', lineNumber: i + 1 });
            }
            else {
                results1.push({ line: line1 ?? '', type: 'diff', lineNumber: i + 1 });
                results2.push({ line: line2 ?? '', type: 'diff', lineNumber: i + 1 });
            }
        }
    }

    // Generate HTML to display the results
    const results1Html = generateResultsHtml(results1);
    const results2Html = generateResultsHtml(results2);

    // Display the results
    const resultsDiv1 = document.getElementById('results1');
    const resultsDiv2 = document.getElementById('results2');

    resultsDiv1.innerHTML = results1Html;
    resultsDiv2.innerHTML = results2Html;
}

// Function to calculate the difference between two lines
function calculateDiff(line1, line2) {
    const length1 = line1 ? line1.length : 0;
    const length2 = line2 ? line2.length : 0;
    const maxLength = Math.max(length1, length2);
    let diff = 0;

    if (length1 < 1 || length2 < 1) {
        return maxLength / maxLength;
    }

    for (let i = 0; i < maxLength; i++) {
        if (line1[i] !== line2[i]) {
            diff++;
        }
    }

    return diff / maxLength;
}

// Function to highlight the differences between two lines
function highlightDiff(line1, line2, linex) {
    let highlightedLine = '';

    const maxLength = Math.max(line1.length, line2.length);

    for (let i = 0; i < maxLength; i++) {
        console.log(line1[i], line2[i]);

        if ((line1[i] ?? '') !== (line2[i] ?? '')) {
            console.log(1, line1[i] ?? '' !== line2[i] ?? '');
            highlightedLine += `<span style="background-color: yellow">${linex[i] ?? ''}</span>`;
        } else {
            console.log(2, line1[i] ?? '' !== line2[i] ?? '');
            highlightedLine += linex[i] ?? '';
        }
    }

    return highlightedLine;
}

// Function to generate HTML to display the results
function generateResultsHtml(results) {
    let html = '';

    for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.type === 'diff') {
            html += `<div style="background-color: lightgray"><span style="font-weight: bold">${result.lineNumber}:</span> ${result.line}</div>`;
        } else if (result.type === 'remove') {
            html += `<div style="background-color: red"><span style="font-weight: bold">${result.lineNumber}:</span> ${result.line}</div>`;
        } else if (result.type === 'add') {
            html += `<div style="background-color: lightgreen"><span style="font-weight: bold">${result.lineNumber}:</span> ${result.line}</div>`;
        } else {
            html += `<div><span style="font-weight: bold">${result.lineNumber}:</span> ${result.line}</div>`;
        }
    }

    return html;
}
