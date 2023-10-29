"use client"

// React ChartJS 2 Charting Library.
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Stats() {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },

            title: {
                display: false,
            },
        },
        maintainAspectRatio: false
    };

    const labels = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
    const values = [30, 30, 30, 30, 30, 30, 30, 30, 70, 70, 70, 70, 50, 50, 50, 50, 90, 90, 90, 30, 30, 30, 30, 30]

    const data = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: values.map((value) => value > 50 ? "rgba(255, 99, 132, 0.5)" : "rgba(53, 162, 235, 0.5)")
            }
        ]
    }

    return (
        <div>
            <div className="tw-h-[50vh] tw-w-full">
                <h1 className="tw-text-4xl tw-font-bold tw-text-center">Daily Stress Score</h1>
                <Bar options={options} data={data}/>
            </div>

            <div className="tw-grid tw-grid-cols-2 tw-justify-items-center tw-items-center tw-mt-10">
                <div>
                    <h3 className="tw-text-2xl tw-font-semibold">Latest Sleep Score:</h3>
                    <h4 className="tw-text-xl tw-text-center">79</h4>
                    <h5 className="tw-text-sm tw-text-center">05/13/2023 18:54</h5>
                </div>
                <div>
                    <h3 className="tw-text-2xl tw-font-semibold">Latest Stress Score:</h3>
                    <h4 className="tw-text-xl tw-text-center">35</h4>
                    <h5 className="tw-text-sm tw-text-center">05/13/2023 18:54</h5>
                </div>
            </div>

            <div className="tw-mt-10">
                <h1 className="tw-text-4xl tw-font-bold">Recommendations:</h1>
                <ul className="tw-text-xl">
                    <li>Take a 5 minute breather</li>
                    <li>Have a 10 minute powernap</li>
                    <li>Consider taking the time to meditate</li>
                </ul>
            </div>
        </div> 
    );
}