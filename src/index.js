"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var PDFDocument = require('pdfkit');
try {
    // reads file content in utf8 encoding
    var fileContent = fs_1.default.readFileSync('../test-folder/script.js', 'utf8');
    console.log(fileContent);
}
catch (error) {
    console.error("Error reading file: ".concat(error.message));
}
// Create a new PDF document object
var doc = new PDFDocument({ size: 'A4' });
console.log(doc);
// create pdf document
doc.pipe(fs_1.default.createWriteStream('output.pdf'));
// Define table headers
var headers = ["Name", "Age"];
// Define row data
var rowData = [
    ["Alice", "23"],
    ["Bob", "30"],
    ["Bob", "30"]
];
var columnHeight = 30;
var heightPoint = 20;
var columnWidth = 200;
var widthPoint = 20;
doc.moveTo(20, 20)
    .lineTo(220, 20);
for (var i = 0; i < rowData.length; i++) {
    doc.moveTo(220, heightPoint);
    doc.lineTo(220, heightPoint + columnHeight)
        .lineTo(20, heightPoint + columnHeight)
        .lineTo(20, heightPoint);
    heightPoint += columnHeight;
}
doc.stroke();
// finalise the pdf and end the stream
doc.end();
