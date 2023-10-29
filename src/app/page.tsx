"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Box, TextField, Typography, Button } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import { Doc } from "../../convex/_generated/dataModel";
import TaskItem from "./components/TaskItem";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  const sendTasks = useMutation(api.schedule_tasks.send);
  const [input, setInput] = useState("");
  if (!tasks) {
    return <div>Loading...</div>;
  }

  function cleanString(str: string) {
    const stopwords = ["around", "hour", "need", "hours", "Monday", "Mon", "Tuesday", "Tue", "got", "Wednesday", "Wed", "Thursday", "Thu","Friday", "Fri","Saturday", "Sat", "Sunday", "Sun", "pm", "takes", "mon", "am" ,"i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now", "want"];
    const regex = new RegExp(`\\b(${stopwords.join("|")})\\b`, "gi");
    const cleaned = str.replace(regex, '').replace(/\d+/g, '').replace(/\s+/g, ' ').trim();

    return cleaned;
  }

  const handleButtonClick = async () => {
    // Do something when the button is clicked
    console.log('Button clicked, input value:', input);
    let dayoweek = '';
    const regex1 = /\b(?:mon(?:day)?|tue(?:sday)?|wed(?:nesday)?|thu(?:rsday)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?)\b/gi;
    let match1;
    if ((match1 = regex1.exec(input)) !== null) {
        const day = match1[0].toLowerCase();
        console.log(day)
        if (day.startsWith('mon')) {
          dayoweek = '2023-10-30T';
        } else if (day.startsWith('tue')) {
          dayoweek = '2023-10-31T';
        } else if (day.startsWith('wed')) {
          dayoweek = '2023-11-01T';
        } else if (day.startsWith('thu')) {
          dayoweek = '2023-11-02T';
        } else if (day.startsWith('fri')) {
          dayoweek = '2023-11-03T';
        } else if (day.startsWith('sat')) {
          dayoweek = '2023-11-04T';
        } else if (day.startsWith('sun')) {
          dayoweek = '2023-10-29T';
        }
    }

    const time = extractTime(input);
    let timing: string = dayoweek + time + ':00.000Z';
    const date = new Date(timing);
    const newDate = new Date(date.getTime() + (7 * 60 * 60 * 1000));
    const newTimestamp = newDate.toISOString();

    const regex = /(\d+)\s*hours?/;
    const match = input.match(regex);

    const result = cleanString(input);
    const newgex = /(\s?)(am|pm)/gi;
    const final = result.replace(newgex, '');
     
    if (match != null){
      const time_taken = parseInt(match[1], 10);
      await sendTasks({startTime: newTimestamp, deadline: '', isFixed: true, title: final, duration: time_taken, priority: 1});;
    }
    
    setInput('');
  };


  function extractTime(prompt: string): string | null {
    const regex = /(\d+)(?::(\d+)|\s*([APMapm]{2}))/; // This regex will match a time like 2, 2pm, 2:00, or 2:00pm
    const match = prompt.match(regex);

    if (match) {
        console.log(match)
        const hour = parseInt(match[1], 10);  // The hour part is in the first capturing group
        const minute = match[2] ? parseInt(match[2], 10) : 0;  // The minute part is optional and is in the second capturing group
        const period = match[3] ? match[3].toUpperCase() : null;  // The period (AM/PM) is optional and is in the third capturing group

        // Now convert the extracted hour, minute, and period to a time
        let militaryHour = hour;
        if (period) {
            militaryHour = period === 'PM' && hour < 12 ? hour + 12 : hour;
            militaryHour = period === 'AM' && hour === 12 ? 0 : militaryHour;
        }

        // Format the military hour and minute as HH:mm
        const formattedTime = `${militaryHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        return formattedTime;
    }

    return null;  // Return null if no time was found
}


  const istaskStart = (task: Doc<"tasks">, day: string, hour: number) => {
    const taskStartDay = dayjs(task.startTime).format("ddd");
    const taskStartHour = dayjs(task.startTime).hour();
    return taskStartDay === day && taskStartHour === hour;
  };

  const getTaskForTimeSlot = (day: string, hour: number) => {
    const matchedTask = tasks.find((task) => {
      const taskStartDay = dayjs(task.startTime).format("ddd");
      const taskStartHour = dayjs(task.startTime).hour();
      const taskEndHour = Number(taskStartHour) + Number(task.duration); // Explicit conversion
      // console.log(day);

      return (
        taskStartDay === day &&
        Number(taskStartHour) <= hour && // Explicit conversion
        Number(taskEndHour) > hour // Explicit conversion
      );
    });

    return matchedTask;
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="tw-flex tw-flex-row tw-justify-center tw-gap-5">
        <div className="tw-mt-10 tw-w-[250px]  ">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "100%",
            }}
          >
            <Typography variant="h6">Tell Us A New Task:</Typography>

            <div className="tw-flex tw-items-center">
              <TextField
                multiline
                variant="outlined"
                placeholder={"What are you doing today?"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                fullWidth
                sx={{ color: "#fff" }}
              />
              <Button variant="contained" color="primary" onClick={handleButtonClick}>
                Send
              </Button>
            </div>
          </Box>
        </div>
        <div className="">
          <div>
            <h1 className="tw-w-fit tw-text-xl tw-font-bold tw-text-start  tw-mb-4 tw-ml-auto tw-mr-auto tw-mt-3">
              Your Personalized AI Planner
            </h1>
          </div>
          <div className="tw-flex tw-flex-col  tw-px-6 tw-rounded-lg tw-shadow-md tw-overflow-x-auto tw-text-black tw-h-screen">
            <div className="tw-grid tw-grid-cols-25 tw-w-fit tw-ml-auto tw-mr-auto">
              {/* Hour Labels */}
              <div className="tw-sticky tw-top-0 tw-z-[100]  ">
                <div className="tw-flex tw-flex-row tw-w-max tw-justify-between tw-align-center ">
                  <div className="tw-h-12 tw-flex tw-items-center tw-justify-start tw-w-[50px] tw-text-white"></div>
                  <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start ">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className="tw-w-[100px] tw-flex tw-justify-center tw-text-center"
                      >
                        <div className="tw-w-full tw-h-12 tw-text-white ">
                          {day}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  className="tw-flex tw-flex-row tw-w-max tw-justify-between tw-align-center "
                >
                  <div className="tw-h-3 tw-flex tw-items-center tw-justify-start tw-w-[50px]"></div>
                  <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start ">
                    {daysOfWeek.map((day) => {
                      if (day === "Sun") {
                        return (
                          <div
                            key={day}
                            className="tw-w-[100px] tw-flex tw-justify-center tw-text-center "
                          >
                            <div className="tw-w-full tw-h-3  tw-border-l-2"></div>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={day}
                          className="tw-w-[100px] tw-flex tw-justify-center tw-text-center "
                        >
                          <div className="tw-w-full tw-h-3  tw-border-l-2"></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="tw-flex tw-flex-col tw-justify-between tw-w-max">
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <div key={hour} className="tw-flex tw-row tw-items-center">
                    <div className="tw-h-12 tw-flex tw-items-center tw-justify-start tw-w-[50px] tw-text-white">
                      {hour}:00
                    </div>
                    <div className="tw-flex tw-row tw-item-center tw-w-full tw-justify-start">
                      {daysOfWeek.map((day) => {
                        const currentTask = getTaskForTimeSlot(day, hour);
                        const shouldDisplayTitle =
                          currentTask && istaskStart(currentTask, day, hour);

                        if (currentTask) {
                          return (
                            <div
                              className="tw-w-[100px] tw-flex tw-justify-center tw-text-center"
                              key={day}
                            >
                              {/* Content for each hour can be added here */}
                              <div className="tw-w-full tw-h-12  tw-border-l-2 tw-border-gray-200 tw-bg-[#3f50b5] tw-text-white">
                                {shouldDisplayTitle && (
                                  <TaskItem task={currentTask} />
                                )}
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div
                            className="tw-w-[100px] tw-flex tw-justify-center tw-text-center"
                            key={day}
                          >
                            {/* Content for each hour can be added here */}
                            <div className="tw-w-full tw-h-12 tw-border-b-2 tw-border-l-2 tw-text-white  "></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
