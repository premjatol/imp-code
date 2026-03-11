"use client";

import SubHeader from "./components/SubHeader";
import MediaLibrary from "./components/MediaLibrary";

export default function Photos() {
  return (
    <>
      <div>
        <SubHeader />
        <div className="px-6 py-4 h-[calc(100vh-106px)] overflow-y-auto">
          <MediaLibrary />
        </div>
      </div>
    </>
  );
}
