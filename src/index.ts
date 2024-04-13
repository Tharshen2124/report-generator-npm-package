import fs from 'fs';
import PDFDocument from 'pdfkit'
import { title } from 'process';

function cleanUp(lines: string[], atType: string) {
  const filteredLines = lines.filter((line) => {
    return line.includes(atType)
  })

  const cleanedLines = filteredLines.map((line) => {
    const brokenLines = line.split(':')
    return brokenLines[1];
  })

  return cleanedLines;
}

try {
  // reads file content in utf8 encoding
  console.log("Reading your test files...")
  const fileContent = fs.readFileSync('../test-folder/script.test.js', 'utf8')
  const lines = fileContent.split('\n')
  
  const titles = cleanUp(lines, '@title')
  const descriptions = cleanUp(lines, '@description')

} catch (error: any) {
  console.error(`Error reading file: ${error.message}`)
}

console.log("Test files read, creating document...")

// Create a new PDF document object
// A4 size is 595.28px x 841.89px
const doc = new PDFDocument({ size: 'A4' })

// create pdf document
doc.pipe(fs.createWriteStream('output.pdf'))

const headerTexts = [
  "Test",
  "Expected Result",
  "Actual Result",
  "Pass"
]

const columnHeaderPoints = [
  { x: 20, y: 20 },
  { x: 180, y: 20 },
  { x: 340, y: 20 },
  { x: 490, y: 20 },
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
    
    .font('Times-Bold')
    .fillAndStroke("#d9d9d9", "#000")
    .fontSize(12)
    .fillColor('black')

  doc.text(headerTexts[i], columnHeaderPoints[i].x, 25, {width: (columnHeaderPoints[i+1].x-columnHeaderPoints[i].x), align: 'center'})  
}

doc.stroke()

// finalise the pdf and end the stream
doc.end()

console.log('Your document is ready!')