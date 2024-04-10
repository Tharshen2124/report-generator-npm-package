import fs from 'fs';
import PDFDocument from 'pdfkit'

try {
  // reads file content in utf8 encoding
  const fileContent = fs.readFileSync('../test-folder/script.js', 'utf8')
} catch (error: any) {
  console.error(`Error reading file: ${error.message}`)
}

// Create a new PDF document object
// A4 size is 595.28 x 841.89
const doc = new PDFDocument({ size: 'A4' })

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

const headerTexts = [
  { 
    text: "Test", 
    x: 25, 
    y: 24 
  },
  { 
    text: "Expected Result", 
    x: 125, 
    y: 24 
  },
  { 
    text: "Actual Result", 
    x: 255, 
    y: 24 
  },
  { 
    text: "Pass", 
    x: 390, 
    y: 24 
  }
]

const columnHeaderPoints = [
  { x: 20, y: 20 },
  { x: 170, y: 20 },
  { x: 320, y: 20 },
  { x: 470, y: 20 },
  { x: 575, y: 20 }
]

const headerColumnHeight = 20
const yStarterPoint = 20

// create header row
for(let i=0; i<columnHeaderPoints.length-1; i++) 
{
  doc.moveTo(columnHeaderPoints[i].x, columnHeaderPoints[i].y)
    .lineTo(columnHeaderPoints[i+1].x, yStarterPoint)
    .lineTo(columnHeaderPoints[i+1].x, yStarterPoint + headerColumnHeight)  
    .lineTo(columnHeaderPoints[i].x, yStarterPoint + headerColumnHeight)
    .lineTo(columnHeaderPoints[i].x, yStarterPoint)
    .fillAndStroke("#d9d9d9", "#000")
    .fontSize(12)
    .fillColor('black')

  const value = Math.round(doc.widthOfString(headerTexts[i].text))
  doc.text(headerTexts[i].text, headerTexts[i].x, headerTexts[i].y)  
}
    
doc.stroke()

// finalise the pdf and end the stream
doc.end()