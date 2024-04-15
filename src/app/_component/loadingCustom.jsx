"use client";

const LoadingCustom = ({ style }) => {
  return (
    <span
      className={`loading loading-spinner ${
        style ? style : "loading-lg"
      } self-center`}
    ></span>
  );
};

export default LoadingCustom;
