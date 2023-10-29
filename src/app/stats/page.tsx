"use client";

// React ChartJS 2 Charting Library.
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useQuery } from "convex/react";
import { Bar } from "react-chartjs-2";
import { getCurrentHourInSanFrancisco } from "../../../convex/stressScores";
import { api } from "../../../convex/_generated/api";
import utc from "dayjs/plugin/utc"; // UTC plugin
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import RecommendedCard from "../components/RecommendedCard";
import SpotifyDrawer from "../components/SpotifyDrawer";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

dayjs.extend(utc);
dayjs.extend(timezone);
export default function Stats() {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },

      title: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  const stressData = useQuery(api.stressScores.getStressScores, {
    hour: getCurrentHourInSanFrancisco(),
  });
  const stressScore = stressData ? stressData[0]?.score : 0;
  const stressLastUpdated = stressData ? stressData[0]?._creationTime : 0;

  const sleepData = useQuery(api.sleepScores.getSleepScores, {
    hour: getCurrentHourInSanFrancisco(),
  });
  const sleepScore = sleepData ? sleepData[0]?.score : 0;
  const sleepLastUpdated = sleepData ? sleepData[0]?._creationTime : 0;

  const pastMetrics = useQuery(api.predictedMetrics.getPredictedMetrics);

  const pastSleepScores = pastMetrics
    ? pastMetrics[0]?.predictedSleepScores
    : [];
  const pastStressScores = pastMetrics
    ? pastMetrics[0]?.predictedStressScores
    : [];

  const dateTimeUTCStress = dayjs(stressLastUpdated);

  const dateTimeSFStress = dateTimeUTCStress.tz("America/Los_Angeles");

  const formattedStressDateTime = dateTimeSFStress.format("YYYY-MM-DD h:mm A");

  const dateTimeUTCSleep = dayjs(sleepLastUpdated);

  const dateTimeSFSleep = dateTimeUTCSleep.tz("America/Los_Angeles");

  const formattedSleep = dateTimeSFSleep.format("YYYY-MM-DD h:mm A");

  //   Convert to San Francisco time
  //   const dateTimeSF = dateTimeUTC.tz("America/Los_Angeles");

  const labels = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];

  const dataSet = pastStressScores.map((value) => value.score);

  const data = {
    labels,
    datasets: [
      {
        data: dataSet,
        backgroundColor: dataSet.map((value) =>
          value > 50 ? "rgba(255, 99, 132, 0.5)" : "rgba(53, 162, 235, 0.5)"
        ),
      },
    ],
  };

  // Recommended Tasks.
  const recommendeds = [
    {
      title: "Take a Breather",
      description:
        "Consider taking the time to sit back and relax before your next big task",
      imageLink:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5eTq3sBaHpSG3iha-L-H1CfmGna5Y0gu6ENcT-3BcIt9ralYeJ-lf2LTOjHkz5hU9uM0&usqp=CAU",
    },
    {
      title: "Powernap",
      description:
        "Taking a well-needed powernap could be the solution to lowering your high stress levels",
      imageLink:
        "https://th.bing.com/th/id/OIP.YJc-kuMwxJVCTV9_WrEaVAHaEa?w=272&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    },
    {
      title: "Meditate",
      description:
        "Meditation is a wonderful method of reconnecting with yourself in a world filled with distractions",
      imageLink:
        "https://th.bing.com/th/id/OIP.ljI8sD3kVR3DCW2YevxW0QHaEj?pid=ImgDet&rs=1",
    },
  ];

  return (
    <div>
      <div className=" tw-mx-auto tw-h-[50vh] tw-w-[80%]">
        <h1 className="tw-text-4xl tw-font-bold tw-text-center">
          Daily Stress Score
        </h1>
        <Bar options={options} data={data} />
      </div>

      <div className="tw-grid tw-grid-cols-2 tw-justify-items-center tw-items-center tw-mt-10">
        <div>
          <h3 className="tw-text-2xl tw-font-semibold">Latest Sleep Score:</h3>
          <h4 className="tw-text-xl tw-text-center">{sleepScore} </h4>
          <h5 className="tw-text-sm tw-text-center">{formattedSleep}</h5>
        </div>
        <div>
          <h3 className="tw-text-2xl tw-font-semibold">Latest Stress Score:</h3>
          <h4 className="tw-text-xl tw-text-center">{stressScore} </h4>
          <h5 className="tw-text-sm tw-text-center">
            {formattedStressDateTime}
          </h5>
        </div>
      </div>

      <div className="tw-mt-10">
        <h1 className="tw-text-4xl tw-font-bold tw-text-center">
          Recommendations
        </h1>
        <div className="tw-grid tw-grid-cols-3 tw-justify-items-center tw-items-center tw-mt-10">
          {recommendeds.map((recommended, index) => {
            return (
              <RecommendedCard
                key={index}
                title={recommended.title}
                description={recommended.description}
                imageLink={recommended.imageLink}
              />
            );
          })}
        </div>
      </div>
      <SpotifyDrawer stress={stressScore} />
    </div>
  );
}
