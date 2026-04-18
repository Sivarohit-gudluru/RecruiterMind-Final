import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function App() {
  const [files, setFiles] = useState([]);
  const [jd, setJd] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!files.length || !jd) {
      alert("Upload resumes + enter JD");
      return;
    }

    setLoading(true);
    let temp = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jd", jd);

      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        temp.push({
          name: file.name,
          score: data.data.score,
          matches: data.data.matches,
          missing: data.data.missing,
          role: data.data.role,
        });
      }
    }

    temp.sort((a, b) => b.score - a.score);
    setResults(temp);
    setLoading(false);
  };

  const top3 = results.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex justify-center">

      <div className="w-full max-w-6xl px-6 py-10 space-y-8">

        {/* TITLE */}
        <h1 className="text-3xl font-semibold text-center">
          RecruitMind Dashboard
        </h1>

        {/* INPUT CARD */}
        <div className="bg-[#111827] p-6 rounded-xl shadow-md space-y-4">
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={(e) => setFiles([...e.target.files])}
            className="w-full p-3 bg-[#1f2937] rounded"
          />

          <textarea
            placeholder="Paste Job Description..."
            className="w-full p-3 bg-[#1f2937] rounded h-28"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />

          <button
            onClick={handleAnalyze}
            className="w-full bg-indigo-600 hover:bg-indigo-700 p-3 rounded font-medium"
          >
            {loading ? "Analyzing..." : "Analyze Candidates"}
          </button>
        </div>

        {/* TOP 3 */}
        {top3.length > 0 && (
          <div>
            <h2 className="mb-3 text-lg font-medium">Top Candidates</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {top3.map((c, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg ${
                    i === 0
                      ? "bg-green-600/20 border border-green-400"
                      : "bg-[#111827]"
                  }`}
                >
                  <p className="text-sm text-gray-400">#{i + 1}</p>
                  <h3 className="font-semibold truncate">{c.name}</h3>
                  <p className="text-xl font-bold">{c.score}%</p>
                  <p className="text-sm text-gray-400">{c.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GRAPH */}
        {results.length > 0 && (
          <div className="bg-[#111827] p-6 rounded-xl">
            <h2 className="mb-4 text-lg font-medium">Score Comparison</h2>
            <div className="w-full h-64">
              <ResponsiveContainer>
                <BarChart data={results}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* RESULTS LIST */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">All Candidates</h2>

            <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
              {results.map((res, idx) => (
                <div
                  key={idx}
                  className="bg-[#111827] p-4 rounded-lg space-y-2"
                >
                  <div className="flex justify-between">
                    <p className="font-medium truncate">{res.name}</p>
                    <p className="font-semibold">{res.score}%</p>
                  </div>

                  <p className="text-sm text-gray-400">
                    {res.role}
                  </p>

                  {/* MATCHED */}
                  <div className="flex flex-wrap gap-2">
                    {res.matches.slice(0, 8).map((m, i) => (
                      <span
                        key={i}
                        className="bg-green-600 px-2 py-1 rounded text-xs"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* MISSING */}
                  <div className="flex flex-wrap gap-2">
                    {res.missing.slice(0, 8).map((m, i) => (
                      <span
                        key={i}
                        className="bg-red-600 px-2 py-1 rounded text-xs"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}