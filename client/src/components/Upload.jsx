import { useState } from "react";

function Upload() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file || !jd) {
      alert("Please upload resume and add job description");npm install -D tailwindcss@3 postcss autoprefixer
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jd", jd);

    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data.data);

    } catch (error) {
      console.error(error);
      alert("Error analyzing resume");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] to-[#020617] flex items-center justify-center text-white">

    <div className="w-full max-w-2xl p-8 bg-[#111827] rounded-2xl shadow-2xl">

      <h1 className="text-3xl font-bold mb-6 text-center">
        RecruitMind AI
      </h1>

      {/* File Upload */}
      <div className="mb-4">
        <input
          type="file"
          className="w-full text-sm text-gray-300"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {/* JD Input */}
      <textarea
        placeholder="Paste Job Description..."
        className="w-full p-3 mb-4 bg-[#1F2937] rounded-lg text-sm focus:outline-none"
        rows={6}
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      />

      {/* Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700 transition"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {/* RESULT */}
      {result && (
        <div className="mt-6 p-4 bg-[#020617] rounded-lg">

          <h2 className="text-xl font-semibold">
            ATS Score: {result.score}%
          </h2>

          <p className="mt-2 text-gray-400">
            Verdict: {result.report.verdict}
          </p>

          <div className="mt-4">
            <p className="text-green-400 font-semibold">Matched Skills</p>
            <p className="text-sm">{result.matched.join(", ")}</p>
          </div>

          <div className="mt-3">
            <p className="text-red-400 font-semibold">Missing Skills</p>
            <p className="text-sm">{result.missing.join(", ")}</p>
          </div>

        </div>
      )}
    </div>
  </div>
);
}
export default Upload;
