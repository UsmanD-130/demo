
import axios from "axios";

async function sendToPythonService(pdfBuffer) {
  const response = await axios.post('http://localhost:8000/process-pdf', pdfBuffer, {
    headers: { 'Content-Type': 'application/pdf' }
  });
  return response.data;
}

export default sendToPythonService;
