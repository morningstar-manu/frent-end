import React from "react";
import { AppointmentWeek } from "../appointments/AppointmentWeek";
import { FullScreen } from "../utils/Fullscreen";
// import SwitchPage from "../appointments/SwitchPage";
import { Clock } from "../utils/dateUtils";
// import DailyOrdersTable from "../appointments/DailyOrdersTables";

export default function ManagerPage() {
  return (
    <>
      <div className="flex flex-col item-center">
        <p className="text-x1 font-semibold leading-tight mb-4">
          Welcome Manager
        </p>
      </div>
      <div className="w-full flex justify-center">
        <FullScreen>
           <Clock />
          <AppointmentWeek />
          {/* <DailyOrdersTable/> */}
          {/* <SwitchPage/> */}
        </FullScreen>
      </div>
    </>
  );
}
