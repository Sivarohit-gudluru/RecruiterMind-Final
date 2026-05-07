import { useState, useEffect } from "react";

import Report from "./Report";
import Comparison from "./Comparison";
import Login from "./Login";

import {
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";

import {
  auth,
  db
} from "./firebase";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#8b5cf6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
];

const Sidebar = () => (

  <div className="w-64 bg-white border-r h-screen p-5 space-y-6">

    <h2 className="text-2xl font-bold">
      RecruitMind
    </h2>

    <div className="space-y-5 text-gray-600">

      <div>🏠 Dashboard</div>
      <div>📄 Candidates</div>
      <div>📊 Analytics</div>
      <div>⚙️ Settings</div>

    </div>

  </div>

);

const Topbar = ({
  user,
  handleLogout
}) => (

  <div className="flex justify-between items-center mb-8">

    <h1 className="text-3xl font-bold">
      AI Recruitment Dashboard
    </h1>

    <div className="flex items-center gap-4">

      <input
        placeholder="Search..."
        className="border px-4 py-2 rounded-xl"
      />

      <div className="
        bg-purple-100
        px-4
        py-2
        rounded-xl
        text-purple-700
        font-semibold
      ">
        {user?.email}
      </div>

      <button
        onClick={handleLogout}
        className="
          bg-red-500
          text-white
          px-4
          py-2
          rounded-xl
        "
      >
        Logout
      </button>

    </div>

  </div>

);

export default function App() {

  const [user, setUser] =
    useState(null);

  const [files, setFiles] =
    useState([]);

  const [jd, setJd] =
    useState("");

  const [results, setResults] =
    useState([]);

  const [compare, setCompare] =
    useState([]);

  const [selectedCandidate,
    setSelectedCandidate] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [history, setHistory] =
    useState([]);

  // AUTO LOGIN
  useEffect(() => {

    const unsub =
      onAuthStateChanged(
        auth,
        (currentUser) => {

          setUser(currentUser);

        }
      );

    return () => unsub();

  }, []);

  // LOAD HISTORY
  useEffect(() => {

    if (!user) return;

    const fetchHistory =
      async () => {

        try {

          const q = query(
            collection(db, "history"),
            where(
              "user",
              "==",
              user.email
            )
          );

          const snap =
            await getDocs(q);

          let temp = [];

          snap.forEach((doc) => {

            temp.push(doc.data());

          });

          setHistory(temp);

        } catch (err) {

          console.log(err);

        }

      };

    fetchHistory();

  }, [user]);

  // LOGOUT
  const handleLogout =
    async () => {

      await signOut(auth);

    };

  // LOGIN PAGE
  if (!user) {

    return (
      <Login onLogin={() => {}} />
    );

  }

  // ANALYZE
  const handleAnalyze =
    async () => {

      if (!files.length || !jd) {

        alert(
          "Upload resumes and enter JD"
        );

        return;

      }

      setLoading(true);

      let temp = [];

      for (let file of files) {

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        formData.append(
          "jd",
          jd
        );

        try {

          const res =
            await fetch(
              "http://127.0.0.1:8000/analyze",
              {
                method: "POST",
                body: formData,
              }
            );

          const data =
            await res.json();

          if (data.success) {

            const candidate = {

              rank:
                temp.length + 1,

              name:
                file.name.replace(
                  ".pdf",
                  ""
                ),

              score:
                data.data.score,

              role:
                data.data.role,

              recommendation:
                data.data.recommendation || "",

              summary:
                data.data.summary || "",

              strengths:
                data.data.strengths || [],

              gaps:
                data.data.gaps || [],

              skills:
                data.data.skills || {},

              section_scores:
                data.data.section_scores || {},

              resumeUrl:
                URL.createObjectURL(file),

              resumeFile:
                file
            };

            temp.push(candidate);

            // SAVE HISTORY
            await addDoc(
              collection(
                db,
                "history"
              ),
              {

                user:
                  user.email,

                candidate:
                  file.name,

                score:
                  data.data.score,

                role:
                  data.data.role,

                recommendation:
                  data.data.recommendation,

                createdAt:
                  new Date()
              }
            );

          }

        } catch (err) {

          console.log(err);

        }

      }

      temp.sort(
        (a, b) =>
          b.score - a.score
      );

      temp = temp.map(
        (c, i) => ({
          ...c,
          rank: i + 1,
        })
      );

      setResults(temp);

      setLoading(false);

    };

  const avg =
    results.length > 0
      ? Math.round(
          results.reduce(
            (a, b) =>
              a + b.score,
            0
          ) / results.length
        )
      : 0;

  const pieData = [

    {
      name: "High",
      value:
        results.filter(
          (r) =>
            r.score >= 75
        ).length,
    },

    {
      name: "Medium",
      value:
        results.filter(
          (r) =>
            r.score >= 50 &&
            r.score < 75
        ).length,
    },

    {
      name: "Low",
      value:
        results.filter(
          (r) =>
            r.score < 50
        ).length,
    },
  ];

  console.log(results);
  console.log(history);
  console.log(user);

  return (

    <div className="
      flex
      bg-[#f5f5f7]
      min-h-screen
    ">

      <Sidebar />

      <div className="
        flex-1
        p-8
      ">

        <Topbar
          user={user}
          handleLogout={handleLogout}
        />

        {/* INPUT */}

        <div className="
          bg-white
          p-6
          rounded-2xl
          shadow
          mb-8
          space-y-4
        ">

          <input
            type="file"
            multiple
            onChange={(e) =>
              setFiles([
                ...e.target.files,
              ])
            }
            className="w-full"
          />

          <textarea
            placeholder="Paste Job Description..."
            className="
              w-full
              border
              p-4
              rounded-xl
              h-32
            "
            value={jd}
            onChange={(e) =>
              setJd(e.target.value)
            }
          />

          <button
            onClick={handleAnalyze}
            className="
              bg-purple-600
              text-white
              px-6
              py-3
              rounded-xl
            "
          >

            {loading
              ? "Analyzing..."
              : "Analyze Candidates"}

          </button>

        </div>

        {/* METRICS */}

        <div className="
          grid
          md:grid-cols-4
          gap-5
          mb-8
        ">

          <MetricCard
            title="Total Candidates"
            value={results.length}
          />

          <MetricCard
            title="Average Score"
            value={`${avg}%`}
          />

          <MetricCard
            title="Top Score"
            value={`${results[0]?.score || 0}%`}
          />

          <MetricCard
            title="Best Candidate"
            value={results[0]?.name || "-"}
          />

        </div>

        {/* CHARTS */}

        <div className="
          grid
          md:grid-cols-2
          gap-6
          mb-8
        ">

          <ChartCard title="Candidate Ranking">

            <ResponsiveContainer>

              <BarChart data={results}>

                <XAxis dataKey="rank" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="score"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </ChartCard>

          <ChartCard title="Score Distribution">

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={110}
                >

                  {pieData.map(
                    (entry, index) => (

                      <Cell
                        key={index}
                        fill={COLORS[index]}
                      />

                    )
                  )}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </ChartCard>

        </div>

        {/* HISTORY */}

        <div className="
          bg-white
          p-6
          rounded-2xl
          shadow
          mb-8
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-5
          ">
            Recruiter History
          </h2>

          <div className="space-y-4">

            {history?.length === 0 && (

              <p className="text-gray-500">
                No history found
              </p>

            )}

            {history?.map((h, i) => (

              <div
                key={i}
                className="
                  border
                  rounded-xl
                  p-4
                  flex
                  justify-between
                  items-center
                "
              >

                <div>

                  <p className="
                    font-semibold
                    text-lg
                  ">
                    {h.candidate}
                  </p>

                  <p className="text-gray-500">
                    {h.role}
                  </p>

                </div>

                <div className="text-right">

                  <p className="
                    text-2xl
                    font-bold
                  ">
                    {h.score}%
                  </p>

                  <p className="
                    text-purple-600
                    text-sm
                  ">
                    {h.recommendation}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* RESULTS */}

        <div className="space-y-4">

          {results?.map((r, i) => (

            <div
              key={i}
              className="
                bg-white
                p-5
                rounded-2xl
                shadow
                flex
                justify-between
                items-center
              "
            >

              <div>

                <p className="
                  font-bold
                  text-lg
                ">
                  #{r.rank} {r.name}
                </p>

                <p className="text-gray-500">
                  {r.role}
                </p>

                <p className="
                  text-sm
                  text-purple-600
                ">
                  {r.recommendation}
                </p>

              </div>

              <div className="
                flex
                items-center
                gap-5
              ">

                <div className="text-right">

                  <p className="
                    text-3xl
                    font-bold
                  ">
                    {r.score}%
                  </p>

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    Match Score
                  </p>

                </div>

                <button
                  onClick={() =>
                    setCompare([
                      ...compare,
                      r
                    ])
                  }
                  className="
                    bg-blue-600
                    text-white
                    px-4
                    py-2
                    rounded-xl
                  "
                >
                  Compare
                </button>

                <button
                  onClick={() =>
                    setSelectedCandidate(r)
                  }
                  className="
                    bg-purple-600
                    text-white
                    px-5
                    py-3
                    rounded-xl
                  "
                >
                  View Report
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      {selectedCandidate && (

        <Report
          candidate={selectedCandidate}
          onClose={() =>
            setSelectedCandidate(null)
          }
        />

      )}

      {compare?.length >= 2 && (

        <Comparison
          compare={compare.slice(0, 2)}
          onClose={() =>
            setCompare([])
          }
        />

      )}

    </div>

  );
}

const MetricCard = ({
  title,
  value
}) => (

  <div className="
    bg-white
    p-5
    rounded-2xl
    shadow
  ">

    <p className="text-gray-500">
      {title}
    </p>

    <h2 className="
      text-3xl
      font-bold
      mt-2
    ">
      {value}
    </h2>

  </div>

);

const ChartCard = ({
  title,
  children
}) => (

  <div className="
    bg-white
    p-6
    rounded-2xl
    shadow
    h-96
  ">

    <h3 className="
      text-xl
      font-semibold
      mb-4
    ">
      {title}
    </h3>

    <div className="h-80">
      {children}
    </div>

  </div>

);