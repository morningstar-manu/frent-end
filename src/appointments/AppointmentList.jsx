import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient } from "react-query";
import { Spinner } from "flowbite-react";
import { AppointmentService } from "../_helpers";
import dayjs from "dayjs";
import { convertirEnFrancais, getBackgroundColor } from "../utils/statusStyle";
import {
  HiUser,
  HiPhone,
  HiLocationMarker,
  HiCalendar,
  HiUserCircle,
} from "react-icons/hi";

const formatCommercialName = (name) => {
  if (!name) return "";
  const words = name.split("-");
  const formattedName = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return formattedName;
};

export const AppointmentList = ({ refreshList }) => {
  // State
  const currentDate = new Date();
  const formattedDate = dayjs(currentDate).format("YYYY-MM");
  const [selectedDate, setSelectedDate] = useState(formattedDate);

  const page = 1;
  const limit = 100;

  // Redux
  const authUser = useSelector((state) => state.auth?.user);
  const userId = authUser?.id;

  // Query appointments
  const queryClient = useQueryClient();

  // Fetch appointments
  const { data, isLoading, isError, error } = useQuery(
    ["appointmentByUserId", userId, selectedDate, page, limit],
    () =>
      AppointmentService.getAppointmentsByUserId(
        userId,
        selectedDate,
        page,
        limit
      )
        .then((response) => response.data)
        .catch((err) => console.log("err", err)),
    { cacheTime: 6000, refetchOnMount: true, refetchOnWindowFocus: true }
  );

  useEffect(() => {
    if (isError && error?.response && error.response.status === 201) {
      queryClient.invalidateQueries([
        "appointmentByUserId",
        userId,
        selectedDate,
      ]);
    }
  }, [isError, error, queryClient, userId, selectedDate, refreshList]);

  // Appointments data
  const appointments = data?.appointments?.docs || [];

  const sortedAppointments = Array.isArray(appointments)
    ? [...appointments]
    : [];
  sortedAppointments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Event handlers
  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
  };

  return (
    <div className="p-6">
      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <HiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="month"
              min="2023-01"
              value={selectedDate}
              onChange={handleDateChange}
              className="input-field pl-10 w-48"
            />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {sortedAppointments.length}
          </span>{" "}
          rendez-vous
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="xl" />
            <p className="text-sm text-muted-foreground">
              Chargement des rendez-vous...
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && sortedAppointments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <HiCalendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">
            Aucun rendez-vous
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Aucun rendez-vous trouve pour cette periode
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && sortedAppointments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header px-4 py-3 text-left">#</th>
                <th className="table-header px-4 py-3 text-left">Date</th>
                <th className="table-header px-4 py-3 text-left">Patient</th>
                <th className="table-header px-4 py-3 text-left">Telephone</th>
                <th className="table-header px-4 py-3 text-left">Adresse</th>
                <th className="table-header px-4 py-3 text-left">
                  Date Programmee
                </th>
                <th className="table-header px-4 py-3 text-left">Commercial</th>
                <th className="table-header px-4 py-3 text-left">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedAppointments.map((appointment, index) => (
                <tr
                  key={appointment._id}
                  className="hover:bg-muted/50 transition-colors group"
                >
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-foreground">
                      {dayjs(appointment.createdAt).format("DD/MM")}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <HiUser className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">
                        {appointment.name?.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <HiPhone className="w-4 h-4" />
                      <span className="whitespace-nowrap">
                        {appointment.phone_1 && appointment.phone_2
                          ? `${appointment.phone_1} / ${appointment.phone_2}`
                          : appointment.phone_1 || appointment.phone_2 || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground max-w-[150px]">
                      <HiLocationMarker className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {appointment.address?.toLowerCase() || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <HiCalendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground font-medium">
                        {dayjs(appointment.date).format("DD/MM/YY")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {appointment.time}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <HiUserCircle className="w-4 h-4" />
                      <span className="whitespace-nowrap">
                        {formatCommercialName(appointment.commercial)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`status-badge ${getBackgroundColor(
                        appointment.status
                      )}`}
                    >
                      {convertirEnFrancais(appointment.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
