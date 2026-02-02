import React from "react";
import { Link } from "react-router-dom";
import { AppointmentAllList } from "../appointments/AppointmentAllList";

export default function AdminPage() {
  return (
    <>
   
    <div className="flex flex-col items-center ">
      <p className="text-3xl font-semibold leading-tight mb-4">Welcome Admin</p>
      <div className="border rounded-lg p-1">
        <Link to="../users" className="text-gray-500 hover:text-blue-600">
          Manage users ➜
        </Link>
      </div>

    </div>
      <div className="mt-4">
        <AppointmentAllList />
      </div>

      </>

  );
}
