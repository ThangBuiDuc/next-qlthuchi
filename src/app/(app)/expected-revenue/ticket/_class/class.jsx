"use client";
import { listContext } from "../content";
import { useContext } from "react";
const Class = () => {
  const { listSearch, selectPresent } = useContext(listContext);
  console.log(listSearch);
  return <div>Class</div>;
};

export default Class;
