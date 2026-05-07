import { useState } from "react";

import {
  X,
  Download,
  Send,
} from "lucide-react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import emailjs from "@emailjs/browser";

import {
  Document,
  Page,
  pdfjs,
} from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function Report({
  candidate,
  onClose,
}) {

  const [numPages, setNumPages] =
    useState(null);

  const [email, setEmail] =
    useState("");

  const [sending, setSending] =
    useState(false);

  if (!candidate) return null;

  const onDocumentLoadSuccess =
    ({ numPages }) => {

      setNumPages(numPages);

    };

  const downloadPDF =
    async () => {

      const report =
        document.getElementById(
          "report-content"
        );

      const canvas =
        await html2canvas(
          report,
          {
            scale: 2,
            useCORS: true,
          }
        );

      const imgData =
        canvas.toDataURL(
          "image/png"
        );

      const pdf =
        new jsPDF(
          "p",
          "mm",
          "a4"
        );

      const pdfWidth = 190;

      const pdfHeight =
        (
          canvas.height *
          pdfWidth
        ) / canvas.width;

      pdf.addImage(
        imgData,
        "PNG",
        10,
        10,
        pdfWidth,
        pdfHeight
      );

      pdf.save(
        `${candidate.name}_RecruitMind_Report.pdf`
      );
    };

  const sendEmailReport =
  async () => {

    if (!email) {

      alert(
        "Please enter recruiter email"
      );

      return;

    }

    try {

      setSending(true);

      await emailjs.send(

        import.meta.env
          .VITE_EMAIL_SERVICE,

        import.meta.env
          .VITE_EMAIL_TEMPLATE,

        {

          to_email: email,

          candidate_name:
            candidate.name,

          role:
            candidate.role,

          score:
            candidate.score,

          recommendation:
            candidate.recommendation,

          summary:
            candidate.summary

        },

        import.meta.env
          .VITE_EMAIL_PUBLIC

      );

      alert(
        "Report sent successfully"
      );

      setEmail("");

    } catch (err) {

      console.log(

        "EMAIL ERROR:",

        err

      );

      alert(

        "Failed to send email"

      );

    } finally {

      setSending(false);

    }

};

  return (

    <div className="
      fixed
      inset-0
      bg-black/90
      z-50
      overflow-y-auto
    ">

      <div className="
        min-h-screen
        grid
        lg:grid-cols-2
        gap-6
        p-6
      ">

        {/* LEFT — RESUME */}

        <div className="
          bg-[#111]
          rounded-3xl
          p-5
          overflow-y-auto
          h-[95vh]
          border
          border-white/5
        ">

          <div className="
            flex
            justify-between
            items-center
            mb-6
          ">

            <h2 className="
              text-3xl
              font-bold
              text-white
            ">
              Resume Preview
            </h2>

            <button
              onClick={onClose}
              className="
                text-gray-400
                hover:text-white
              "
            >

              <X size={28} />

            </button>

          </div>

          <div className="
            flex
            justify-center
          ">

            <Document
              file={
                candidate.resumeFile
              }
              onLoadSuccess={
                onDocumentLoadSuccess
              }
              loading={
                <div className="
                  text-gray-400
                  mt-10
                ">
                  Loading Resume...
                </div>
              }
            >

              {
                Array.from(
                  new Array(numPages),
                  (_, index) => (

                    <div
                      key={index}
                      className="
                        mb-6
                        shadow-2xl
                      "
                    >

                      <Page
                        pageNumber={
                          index + 1
                        }
                        width={550}
                      />

                    </div>

                  )
                )
              }

            </Document>

          </div>

        </div>

        {/* RIGHT — REPORT */}

        <div
          id="report-content"
          className="
            bg-[#0f0f0f]
            text-white
            rounded-3xl
            p-8
            space-y-8
            shadow-2xl
            overflow-y-auto
            h-[95vh]
            border
            border-white/5
          "
        >

          {/* HEADER */}

          <div className="
            flex
            justify-between
            items-start
            gap-4
          ">

            <div>

              <h1 className="
                text-5xl
                font-bold
                break-words
              ">
                {candidate.name}
              </h1>

              <p className="
                mt-4
                text-gray-400
                text-lg
              ">
                {candidate.role}
              </p>

            </div>

            <div className="
              text-right
            ">

              <p className="
                text-gray-400
                text-lg
              ">
                Overall Match
              </p>

              <h2 className="
                text-7xl
                font-bold
                text-green-400
              ">
                {candidate.score || 0}%
              </h2>

              <div className="
                mt-3
                px-4
                py-2
                rounded-full
                bg-green-500/10
                text-green-400
                text-sm
                font-semibold
                inline-block
              ">
                {
                  candidate.recommendation
                }
              </div>

            </div>

          </div>

          {/* SECTION SCORES */}

          <Card title="Section Scores">

            {
              Object.entries(
                candidate.section_scores || {}
              ).map(
                ([key, value], index) => (

                  <div
                    key={index}
                    className="mb-7"
                  >

                    <div className="
                      flex
                      justify-between
                      mb-3
                    ">

                      <span className="
                        capitalize
                        text-lg
                      ">
                        {
                          key.replace(
                            "_",
                            " "
                          )
                        }
                      </span>

                      <span className="
                        font-bold
                      ">
                        {value}%
                      </span>

                    </div>

                    <div className="
                      w-full
                      bg-[#2a2a2a]
                      h-4
                      rounded-full
                    ">

                      <div
                        className="
                          bg-purple-500
                          h-4
                          rounded-full
                          transition-all
                          duration-700
                        "
                        style={{
                          width: `${value}%`,
                        }}
                      />

                    </div>

                  </div>

                )
              )
            }

          </Card>

          {/* SKILLS */}

          <div className="
            grid
            md:grid-cols-3
            gap-6
          ">

            <SkillBox
              title="Strong Skills"
              data={
                candidate.skills?.strong
              }
              color="green"
            />

            <SkillBox
              title="Moderate Skills"
              data={
                candidate.skills?.medium
              }
              color="yellow"
            />

            <SkillBox
              title="Missing Skills"
              data={
                candidate.skills?.weak
              }
              color="red"
            />

          </div>

          {/* SUMMARY */}

          <Card title="Recruiter Summary">

            <p className="
              text-gray-300
              leading-loose
              text-lg
            ">
              {candidate.summary}
            </p>

          </Card>

          {/* EMAIL SHARE */}

          <Card title="Share Report">

            <div className="
              flex
              flex-col
              md:flex-row
              gap-4
            ">

              <input
                type="email"
                placeholder="
                Recruiter Email
                "
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="
                  flex-1
                  bg-[#111]
                  border
                  border-white/10
                  rounded-xl
                  px-5
                  py-4
                  text-white
                  outline-none
                "
              />

              <button
                onClick={
                  sendEmailReport
                }
                disabled={sending}
                className="
                  bg-blue-600
                  hover:bg-blue-700
                  px-6
                  py-4
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  gap-2
                  font-semibold
                  transition-all
                "
              >

                <Send size={18} />

                {
                  sending
                    ? "Sending..."
                    : "Send Report"
                }

              </button>

            </div>

          </Card>

          {/* DOWNLOAD */}

          <div className="
            flex
            justify-end
          ">

            <button
              onClick={downloadPDF}
              className="
                bg-green-500
                hover:bg-green-600
                px-6
                py-4
                rounded-xl
                flex
                items-center
                gap-3
                text-lg
                font-semibold
                transition-all
              "
            >

              <Download size={20} />

              Download Report

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

/* CARD */

const Card = ({
  title,
  children,
}) => (

  <div className="
    bg-[#181818]
    rounded-2xl
    p-7
  ">

    <h2 className="
      text-3xl
      font-bold
      mb-8
    ">
      {title}
    </h2>

    {children}

  </div>

);

/* SKILLS */

const SkillBox = ({
  title,
  data,
  color,
}) => {

  const colors = {

    green:
      "text-green-400 bg-green-500/10 border border-green-500/20",

    yellow:
      "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20",

    red:
      "text-red-400 bg-red-500/10 border border-red-500/20",
  };

  return (

    <div className="
      bg-[#181818]
      rounded-2xl
      p-7
    ">

      <h2 className="
        text-2xl
        font-bold
        mb-6
      ">
        {title}
      </h2>

      <div className="
        flex
        flex-wrap
        gap-3
      ">

        {
          data?.length > 0 ? (

            data.map(
              (skill, index) => (

                <div
                  key={index}
                  className={`
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    ${colors[color]}
                  `}
                >
                  {skill}
                </div>

              )
            )

          ) : (

            <div className="
              text-gray-500
            ">
              No skills detected
            </div>

          )
        }

      </div>

    </div>

  );
};