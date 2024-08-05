"use client";
import { Spinner } from "@nextui-org/spinner";
const LoadingCustom = ({ style }) => {
  return (
    <div className="flex justify-center">
      <Spinner color="primary" />
    </div>
  );
};

export default LoadingCustom;
