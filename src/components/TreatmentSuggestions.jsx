import React, { useState, useEffect } from "react";
import { BsShieldCheck } from "react-icons/bs";
import { apiGetTreatmentSuggestions } from '../api/api';

const getTreatmentData = (label, conditions) => {
  if (!label || !conditions) return null;
  return conditions.find(
    (condition) => condition.name.toLowerCase() === label.toLowerCase()
  );
};

const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-3 w-full ">
    <span className="w-2 h-8 bg-gradient-to-b from-gray-600 to-gray-400 rounded-full shadow-sm"></span>
    <h4 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
      {title}
    </h4>
  </div>
);

const TreatmentSuggestions = ({ prediction }) => {
  const [allConditions, setAllConditions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGetTreatmentSuggestions();
        setAllConditions(response.data || []);
      } catch (error) {
        console.error('Error fetching treatment suggestions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!prediction?.predicted_label) return null;
  if (loading) return <div className="text-center py-4">Loading treatment suggestions...</div>;

  const treatmentData = getTreatmentData(prediction.predicted_label, allConditions);

  return (
    <>
      {/* ==================== TREATMENTS ==================== */}
      <SectionTitle title="Recommended Treatment Options" />

      <ul className="space-y-1 text-gray-700 text-xs md:text-sm w-full mt-2">
        {(treatmentData?.treatments || []).map((tip, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <span className="leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>

      {/* ==================== PREVENTION ==================== */}
      <SectionTitle title="Prevention Tips" />

      <ul className="space-y-1 text-gray-700 text-xs md:text-sm w-full mt-2">
        {(treatmentData?.prevention || []).map((tip, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <span className="leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>

      {/* ==================== RESOURCES ==================== */}
      <SectionTitle title="Trusted Dermatology Resources" />

      <ul className="space-y-1 bg-white px-3 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs md:text-sm w-full mt-2">
        {(treatmentData?.resources || []).map((item, idx) => {
          const parts = item.split("https://");
          const title = parts[0].trim();
          const url = "https://" + parts[1];

          return (
            <li
              key={idx}
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-700"
              >
                {title}
              </a>
            </li>
          );
        })}
      </ul>



      {/* ==================== NEXT STEPS ==================== */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 rounded-xl w-full mt-6 shadow-lg">
        <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <BsShieldCheck /> Next Steps
        </h5>
        <p className="text-xs leading-relaxed opacity-90">
          Schedule a consultation with a dermatologist for personalized
          treatment. Download your PDF report to share with your healthcare
          provider.
        </p>
      </div>
    </>
  );
};

export default TreatmentSuggestions;
