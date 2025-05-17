import React, { useEffect, useState, useContext } from 'react';
import Header from '../Nav_Bar/Header';
import Footer from '../Nav_Bar/Footer';
import { AuthContext } from '../contexts/AuthContext';
import '../Styles/History.css';

const History = () => {
    const [history, setHistory] = useState([]);
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/predictions/history', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const data = await res.json();
                setHistory(data);
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        };

        if (accessToken) fetchHistory();
    }, [accessToken]);

    return (
        <div className="history-wrapper">
            <Header />
            <main className="history-container">
                <h1>Prediction History</h1>
                {history.length === 0 ? (
                    <p>No analysis history found.</p>
                ) : (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Label</th>
                                <th>Confidence</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.predicted_label}</td>
                                    <td>{(item.confidence_score * 100).toFixed(2)}%</td>
                                    <td>{new Date(item.timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default History;
