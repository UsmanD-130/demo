import path from 'path';
import fs from 'fs';
import os from 'os';
import { convert } from 'pdf-poppler';

export async function convertPDFToImage(buffer) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdf-'));
  const tempPdfPath = path.join(tempDir, 'input.pdf');
  fs.writeFileSync(tempPdfPath, buffer);

  const options = {
    format: 'jpeg',
    out_dir: tempDir,
    out_prefix: 'page',
    page: null // convert all pages
  };

  await convert(tempPdfPath, options);

  const imageFiles = fs.readdirSync(tempDir)
    .filter(file => file.endsWith('.jpg'))
    .map(file => path.join(tempDir, file));

  return imageFiles;
}
