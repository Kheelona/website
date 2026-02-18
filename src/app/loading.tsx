"use client";
import Lottie from "lottie-react";
import animationData from "./loading.json";

export default function Loader() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
}
