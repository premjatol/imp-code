"use client";

import React, { useEffect, useState } from "react";
import SubHeader from "./components/SubHeader";
import { useTranslation } from "react-i18next";
import { usePlansStore } from "@/stores/plans/usePlansStore";
import { useParams } from "next/navigation";
import FolderListView from "./components/FolderListView";

export default function Plans() {
  const [showFilters, setShowFilters] = useState(false);

  const { t } = useTranslation();

  return (
    <div>
      <SubHeader filters={{ showFilters, setShowFilters }} />
      <div
        className={`px-6 py-4 ${showFilters ? "h-[calc(100vh-155px)]" : "h-[calc(100vh-108px)]"} overflow-y-auto`}
      >
        <FolderListView />
      </div>
    </div>
  );
}
