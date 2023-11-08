"use client";
import moment from "moment";
import { useEffect, useState } from "react";

moment.locale();

const Clock = () => {
  const [time, setTime] = useState(moment().format("DD-MM-YYYY HH:mm:ss"));
  useEffect(() => {
    const interval = setInterval(
      () => setTime(moment().format("DD-MM-YYYY HH:mm:ss")),
      1000
    );

    return () => clearInterval(interval);
  }, [time]);
  return <>{time}</>;
};

export default Clock;
