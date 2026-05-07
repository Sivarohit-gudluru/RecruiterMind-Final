export default function Comparison({
  compare,
  onClose
}) {

  return (

    <div className="
      fixed
      inset-0
      bg-black/70
      flex
      items-center
      justify-center
      z-50
    ">

      <div className="
        bg-white
        w-[90%]
        max-w-5xl
        rounded-3xl
        p-8
      ">

        <div className="
          flex
          justify-between
          items-center
          mb-8
        ">

          <h1 className="
            text-3xl
            font-bold
          ">
            Candidate Comparison
          </h1>

          <button
            onClick={onClose}
            className="
              bg-red-500
              text-white
              px-4
              py-2
              rounded-xl
            "
          >
            Close
          </button>

        </div>

        <div className="
          grid
          md:grid-cols-2
          gap-6
        ">

          {compare.map((c, i) => (

            <div
              key={i}
              className="
                border
                rounded-2xl
                p-6
              "
            >

              <h2 className="
                text-2xl
                font-bold
                mb-4
              ">
                {c.name}
              </h2>

              <div className="
                space-y-3
              ">

                <p>
                  <strong>Score:</strong>
                  {" "}
                  {c.score}%
                </p>

                <p>
                  <strong>Role:</strong>
                  {" "}
                  {c.role}
                </p>

                <p>
                  <strong>Recommendation:</strong>
                  {" "}
                  {c.recommendation}
                </p>

                <div>

                  <strong>
                    Strengths:
                  </strong>

                  <ul className="
                    list-disc
                    ml-5
                    mt-2
                  ">

                    {c.strengths?.map(
                      (s, idx) => (

                        <li key={idx}>
                          {s}
                        </li>

                      )
                    )}

                  </ul>

                </div>

                <div>

                  <strong>
                    Gaps:
                  </strong>

                  <ul className="
                    list-disc
                    ml-5
                    mt-2
                  ">

                    {c.gaps?.map(
                      (g, idx) => (

                        <li key={idx}>
                          {g}
                        </li>

                      )
                    )}

                  </ul>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}