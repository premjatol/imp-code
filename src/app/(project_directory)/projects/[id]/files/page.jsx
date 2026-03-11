"use client";

import React, { useEffect } from "react";
import SubHeader from "./components/SubHeader";
import FilesList from "./components/FilesList";
import { useParams } from "next/navigation";
import useFilesStore from "@/stores/files/useFilesStore";

export default function Files() {
  const { setProjectId } = useFilesStore();
  const { id } = useParams();

  useEffect(() => {
    setProjectId(id);
  }, [id]);

  return (
    <>
      <SubHeader />
      <div className="px-6 py-4 h-[calc(100vh-106px)] overflow-y-auto">
        <FilesList />
      </div>
    </>
  );
}
