"use client";

import { useState } from "react";
import SubHeader from "./components/SubHeader";
import AnnotationToolComp from "./annotation_tool/AnnotationToolComp ";
import useContextStore from "@/stores/useContextStore";
import TaskList from "./components/TaskList";

export default function AnnotationTool() {
  const { isCollapsed } = useContextStore();

  const [showFilters, setShowFilters] = useState(false);

  return (
    <div
      className={`${isCollapsed ? "w-[calc(100vw-60px)]" : "w-[calc(100vw-240px)]"}`}
    >
      <SubHeader showFilters={showFilters} setShowFilters={setShowFilters} />
      <div
        className={`mx-6 my-2 flex ${showFilters ? "h-[calc(100vh-168px)]" : "h-[calc(100vh-120px)]"}  duration-400`}
      >
        <div className={`rounded-l-md overflow-hidden w-full`}>
          <AnnotationToolComp />
        </div>
        
        {/* Task list */}
        <TaskList />
      </div>
    </div>
  );
}
