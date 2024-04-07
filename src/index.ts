import fs from 'fs';
import PDFDocument from 'pdfkit'

try {
    // reads file content in utf8 encoding
    const fileContent = fs.readFileSync('../test-folder/script.js', 'utf8')
    console.log(fileContent)
} catch (error: any) {
    console.error(`Error reading file: ${error.message}`)
}

// Create a new PDF document object
const doc = new PDFDocument({ size: 'A4' })
console.log(doc)

// create pdf document
doc.pipe(fs.createWriteStream('output.pdf'))

// Define table headers
const headers = ["Name", "Age"]

// Define row data
const rowData = [
    ["Alice", "23"],
    ["Bob", "30"],
    ["Bob", "30"]
]

const columnHeight = 30
let heightPoint = 20

const columnWidth = 200;
let widthPoint = 20

doc.moveTo(20, 20)
.lineTo(220, 20)

for(let i = 0; i<rowData.length; i++) {
    doc.moveTo(220, heightPoint)
    doc.lineTo(220, heightPoint + columnHeight)
    .lineTo(20, heightPoint + columnHeight) 
    .lineTo(20, heightPoint) 
    heightPoint += columnHeight
}
    
doc.stroke()

// finalise the pdf and end the stream
doc.end()