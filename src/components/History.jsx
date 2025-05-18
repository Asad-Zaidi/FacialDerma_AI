// components/History.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function History() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/predictions", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setHistory(res.data);
            } catch (err) {
                console.error("Error fetching prediction history:", err);
            }
        };
        fetchPredictions();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Prediction History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {history.map((item) => (
                    <div key={item._id} className="border rounded p-3 shadow">
                        <img
                            src={`http://localhost:8000${item.imageUrl}`}
                            alt="analysis"
                            className="w-full h-48 object-cover rounded mb-2"
                        />
                        <p><strong>Prediction:</strong> {item.result.predicted_label}</p>
                        <p><strong>Confidence:</strong> {item.result.confidence_score}</p>
                        <p><strong>Date:</strong> {new Date(item.createdAt).toLocaleString()}</p>
                        <a
                            href={`http://localhost:8000${item.imageUrl}`}
                            download
                            className="text-blue-600 underline mt-2 inline-block"
                        >
                            Download Image
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
