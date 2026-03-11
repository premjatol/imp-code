import React from "react";
import SubHeader from "./components/SubHeader";
import UsersList from "./components/UsersList";

export default function Users() {
  return (
    <>
      <SubHeader />
      <div className="px-6 py-4 h-[calc(100vh-106px)] overflow-y-auto"> 
        <h4 className="text-lg font-semibold mb-4">Users</h4>
        <UsersList />
      </div>
    </>
  );
}
