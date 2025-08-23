import { useState } from "react";
import axios from "axios"


export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    console.log(formData,"formData")
    formData.append("file", file);
    console.log(file,"file")

    const res = await axios.post("http://localhost:8000/api/file/generate-summary", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(res,"res")

    setSummary(res.data);
  };

  return (
    <div>
      <h2>Upload CIBIL Report</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">View Summary</button>
      </form>

      {summary && (
        <pre>{JSON.stringify(summary, null, 2)}</pre>
      )}
    </div>
  );
}
