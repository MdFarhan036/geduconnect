import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function CompareUniversities() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let slugs = searchParams.getAll("v");

    // ✅ Fallback to localStorage if no query params
    if (!slugs.length) {
      const stored =
        JSON.parse(localStorage.getItem("compareList")) || [];
      slugs = stored.map((u) => u.slug);
    }

    if (!slugs.length) {
      setLoading(false);
      return;
    }

    api
      .get(`/public/compare?slugs=${slugs.join(",")}`)
      .then((res) => {
        const cleaned = res.data.map((u) => ({
          ...u,
          extra_data:
            typeof u.extra_data === "string"
              ? JSON.parse(u.extra_data)
              : u.extra_data || {}
        }));

        setData(cleaned);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchParams]);

  const clearComparison = () => {
    localStorage.removeItem("compareList");
    setData([]);
    navigate("/");
  };

  if (loading) return <div className="container">Loading...</div>;

  if (!data.length)
    return (
      <div className="container">
        <h2>No universities selected</h2>
      </div>
    );

  return (
    <div className="compare-container">
      <div className="compare-header">
        <h1>University Comparison</h1>

        <button className="clear-btn" onClick={clearComparison}>
          Clear Comparison
        </button>
      </div>

      <div className="compare-table">

        {/* HEADER ROW */}
        <div className="compare-row header">
          <div>Feature</div>
          {data.map((u) => (
            <div key={u.id}>{u.name}</div>
          ))}
        </div>

        {/* LOCATION */}
        <CompareRow
          label="Location"
          data={data}
          field={(u) => u.extra_data?.location}
        />

        {/* ESTABLISHED */}
        <CompareRow
          label="Established"
          data={data}
          field={(u) => u.extra_data?.established}
        />

        {/* NAAC */}
        <CompareRow
          label="NAAC Grade"
          data={data}
          field={(u) => u.extra_data?.naac_grade}
        />

        {/* HIGHEST PACKAGE */}
        <CompareRow
          label="Highest Package"
          data={data}
          field={(u) =>
            u.extra_data?.placement?.highest_package
              ? `₹ ${u.extra_data.placement.highest_package}`
              : "-"
          }
        />

        {/* AVERAGE PACKAGE */}
        <CompareRow
          label="Average Package"
          data={data}
          field={(u) =>
            u.extra_data?.placement?.average_package
              ? `₹ ${u.extra_data.placement.average_package}`
              : "-"
          }
        />

      </div>
    </div>
  );
}

/* ================= REUSABLE ROW COMPONENT ================= */
function CompareRow({ label, data, field }) {
  return (
    <div className="compare-row">
      <div>{label}</div>
      {data.map((u) => (
        <div key={u.id}>{field(u) || "-"}</div>
      ))}
    </div>
  );
}