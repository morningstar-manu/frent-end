import { useQuery, useQueryClient } from "react-query";
import { useEffect } from "react";
import { AppointmentService } from "../_helpers";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useWeekManager } from "../utils/dateUtils";
import { TextInput } from "flowbite-react";
dayjs.extend(isoWeek);

export const AppointmentWeek = () => {
  const { week, handleWeekChange } = useWeekManager();
  const queryClient = useQueryClient();

  // Fetch appointments
  const { data, error, isLoading, isError, isFetching } = useQuery(
    ["appointmentsByWeek", week],
    () =>
      AppointmentService.getAllAppointmentsByWeek(week)
        .then((response) => response.data)
        .catch((err) => console.log("err", err)),
    { cacheTime: 6000, refetchOnMount: true, refetchOnWindowFocus: true }
  );

  useEffect(() => {
    if (isError && error.response && error.response.status === 201) {
      queryClient.invalidateQueries(["appointmentsByWeek", week]);
    }
  }, [isError, error, queryClient, week]);

  const { employees = [] } = data ?? {};

  const filteredEmployees = employees?.map(({ week, ...employee }) => ({
    ...employee,
    week: week?.slice(1, 6),
  }));
  // Afficher le résultat
  const calculateTotal = (sales) => {
    return sales.reduce((total, sale) => total + sale, 0);
  };

  const handleWeek = (e) => {
    const newWeek = e.target.value;
    handleWeekChange(newWeek);
    // setWeek(newWeek);
  };



  return (
    <div className="bg-gray-100 p-4">
      <div className="grid grid-cols-6 gap-6">
        <TextInput
          type="week"
          name="week"
          id="week"
          value={week}
          onChange={handleWeek}
        // className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Performance des agents de la semaine
          </h2>

          <table
            className="w-full border border-gray-900 text-gray-700"
            style={{ zIndex: "9999" }}
          >
            <thead>
              <tr>
                <th className="px-4 py-2 font-bold">Agent</th>
                {/* <th className="px-4 py-2 bg-blue-200 font-bold">Dimanche</th> */}
                <th className="px-4 py-2 bg-blue-200 font-bold">Lundi</th>
                <th className="px-4 py-2 bg-blue-200 font-bold">Mardi</th>
                <th className="px-4 py-2 bg-blue-200 font-bold">Mercredi</th>
                <th className="px-4 py-2 bg-blue-200 font-bold">Jeudi</th>
                <th className="px-4 py-2 bg-blue-200 font-bold">Vendredi</th>
                {/* <th className="px-4 py-2 bg-blue-200 font-bold">Samedi</th> */}
                <th className="px-4 py-2 bg-blue-200 font-bold">
                  Total semaine
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees?.map((employee, index) => (
                <tr key={index}>
                  <td className="border  border-gray-900 px-6 py-2 bg-gray-200">
                    <p className="text-lg font-bold">{employee.name} </p>
                  </td>
                  {employee?.week?.map((sale, dayIndex) => (
                    <td
                      key={dayIndex}
                      className={`border border-gray-900 px-4 py-2 ${sale > 2 ? "bg-green-200" : "bg-yellow-200"
                        }`}
                    >
                      {/* <p className="font-bold  text-2xl text-center">{sale} </p>  */}
                      <p
                        className={`font-bold text-2xl text-center ${sale === 0 ? "text-red-500" : ""
                          }`}
                      >
                        {sale}
                      </p>
                    </td>
                  ))}

                  <td
                    className={`border px-4 border-gray-900 py-2 font-bold ${calculateTotal(employee?.week) > 14 ? "bg-blue-200" : ""
                      }`}
                  >
                    <div className="flex flex-row-reverse  justify-center items-center">
                      {calculateTotal(employee?.week) > 14 && (
                        <span className="badge-badge-star ml-1">★</span>
                      )}
                      <p className="font-bold text-2xl text-center">
                        {calculateTotal(employee?.week)}
                      </p>
                    </div>
                  </td>

                  {/* <td
                    className={`border px-4 border-gray-900 py-2 font-bold ${
                      calculateTotal(employee?.week) > 14
                        ? "bg-blue-200"
                        : ""
                    }`}
                  >
                    <p className="font-bold text-2xl text-center">
                      {calculateTotal(employee?.week)}
                    </p>
                    {calculateTotal(employee?.week) > 14 && (
                      <span className="badge-badge-star">★</span>
                    )}
                  </td> */}
                  {/* <td className="border px-4 border-gray-900 py-2 font-bold">
                    <p className="font-bold  text-2xl text-center ">
                      {calculateTotal(employee?.week)}
                    </p>
                  </td> */}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {filteredEmployees?.length > 0 && (
                <tr>
                  <td className="border border-gray-900 px-4 py-2 font-bold text-2xl text-start">
                    Total
                  </td>

                  {filteredEmployees[0].week?.map((_, dayIndex) => (
                    <td
                      key={dayIndex}
                      className={`border border-gray-900 px-4 py-2 font-bold ${filteredEmployees.reduce(
                        (total, employee) => total + employee.week[dayIndex],
                        0
                      ) > 14
                          ? "bg-green-200"
                          : "bg-yellow-200"
                        }`}
                    >
                      <p className="font-bold text-2xl font-bold text-center">
                        {filteredEmployees?.reduce(
                          (total, employee) => total + employee.week[dayIndex],
                          0
                        )}
                      </p>
                    </td>
                  ))}
                  <td className="border border-gray-900 px-4 py-2 ">
                    <p className="font-bold text-2xl text-red-500 font-bold text-center">
                      {calculateTotal(
                        employees?.reduce(
                          (sales, employee) => sales.concat(employee.week),
                          []
                        )
                      )}
                    </p>
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>
      )}
      {isFetching ? <span>Fetching...</span> : null}
    </div>
  );
};
