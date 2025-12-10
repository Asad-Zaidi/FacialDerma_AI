// import React from "react";
// import { BsShieldCheck } from "react-icons/bs";
// import suggestionsData from "../Assets/treatmentSuggestions.json";

// const getTreatmentData = (label) => {
//   if (!label) return null;
//   return suggestionsData.skin_conditions.find(
//     (condition) => condition.name.toLowerCase() === label.toLowerCase()
//   );
// };

// const Treatment = ({ prediction }) => {
//   if (!prediction?.predicted_label) return null;

//   const treatmentData = getTreatmentData(prediction.predicted_label);

//   return (
//     <>
//       <div className="flex items-center gap-2 w-full">
//         <span className="w-1 h-8 bg-gradient-to-b from-gray-700 to-gray-500 rounded-full"></span>
//         <h4 className="text-base md:text-lg font-semibold text-gray-800">
//           Recommended Treatment Options
//         </h4>
//       </div>
//       <p className="text-xs text-gray-600 -mt-2">
//         Based on AI analysis and dermatological guidelines
//       </p>
//       <ul className="space-y-3 text-gray-700 text-xs md:text-sm w-full">
//         {(treatmentData?.treatments || []).map((tip, idx) => (
//           <li
//             key={idx}
//             className="flex items-start gap-3 bg-gradient-to-r from-gray-50 to-white p-3.5 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-300 border border-gray-100 hover:border-gray-300 hover:shadow-md group"
//           >
//             <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-500 text-white rounded-full flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-transform duration-200">
//               {idx + 1}
//             </span>
//             <span className="leading-relaxed pt-0.5">{tip}</span>
//           </li>
//         ))}
//       </ul>

//       <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 rounded-xl w-full mt-4 shadow-lg">
//         <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
//           <BsShieldCheck /> Next Steps
//         </h5>
//         <p className="text-xs leading-relaxed opacity-90">
//           Schedule a consultation with a dermatologist for personalized
//           treatment. Download your PDF report to share with your healthcare
//           provider.
//         </p>
//       </div>
//     </>
//   );
// };

// export default Treatment;


import React from "react";
import { BsShieldCheck } from "react-icons/bs";
import suggestionsData from "../Assets/treatmentSuggestions.json";

const getTreatmentData = (label) => {
  if (!label) return null;
  return suggestionsData.skin_conditions.find(
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

const Treatment = ({ prediction }) => {
  if (!prediction?.predicted_label) return null;

  const treatmentData = getTreatmentData(prediction.predicted_label);

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
                style={{ textDecoration: "none" }}
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

export default Treatment;
