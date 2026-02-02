import { useQuery, useQueryClient } from "react-query";
import { useEffect } from "react";
import { AppointmentService } from "../_helpers";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useWeekManager } from "../utils/dateUtils";
import { Spinner } from "flowbite-react";
import { HiCalendar, HiStar, HiTrendingUp } from "react-icons/hi";
dayjs.extend(isoWeek);

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

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
    if (isError && error?.response && error.response.status === 201) {
      queryClient.invalidateQueries(["appointmentsByWeek", week]);
    }
  }, [isError, error, queryClient, week]);

  const { employees = [] } = data ?? {};

  const filteredEmployees = employees?.map(({ week, ...employee }) => ({
    ...employee,
    week: week?.slice(1, 6),
  }));

  const calculateTotal = (sales) => {
    return sales?.reduce((total, sale) => total + sale, 0) || 0;
  };

  const handleWeek = (e) => {
    const newWeek = e.target.value;
    handleWeekChange(newWeek);
  };

  const getCellStyle = (value) => {
    if (value === 0) return "bg-destructive/10 text-destructive";
    if (value >= 3) return "bg-success/10 text-success";
    return "bg-warning/10 text-warning";
  };

  return (
    <div className="space-y-6">
      {/* Week Selector */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <HiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="week"
            name="week"
            id="week"
            value={week}
            onChange={handleWeek}
            className="input-field pl-10 w-48"
          />
        </div>
        {isFetching && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner size="sm" />
            Mise a jour...
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="xl" />
            <p className="text-sm text-muted-foreground">
              Chargement des donnees...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center py-8">
          <p className="text-destructive">
            Erreur: {error?.message || "Une erreur est survenue"}
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="table-header px-4 py-3 text-left min-w-[150px]">
                  Agent
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="table-header px-4 py-3 text-center min-w-[100px]"
                  >
                    {day}
                  </th>
                ))}
                <th className="table-header px-4 py-3 text-center min-w-[120px]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEmployees?.map((employee, index) => {
                const total = calculateTotal(employee?.week);
                const isTopPerformer = total > 14;
                return (
                  <tr
                    key={index}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {employee.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">
                          {employee.name}
                        </span>
                        {isTopPerformer && (
                          <HiStar className="w-5 h-5 text-warning" />
                        )}
                      </div>
                    </td>
                    {employee?.week?.map((sale, dayIndex) => (
                      <td key={dayIndex} className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-bold text-lg ${getCellStyle(
                            sale
                          )}`}
                        >
                          {sale}
                        </span>
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center">
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${
                          isTopPerformer
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {isTopPerformer && <HiTrendingUp className="w-4 h-4" />}
                        <span className="text-xl">{total}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {filteredEmployees?.length > 0 && (
              <tfoot>
                <tr className="bg-muted/70 font-semibold">
                  <td className="px-4 py-3 text-foreground">Total equipe</td>
                  {filteredEmployees[0]?.week?.map((_, dayIndex) => {
                    const dayTotal = filteredEmployees.reduce(
                      (total, employee) => total + (employee.week?.[dayIndex] || 0),
                      0
                    );
                    return (
                      <td key={dayIndex} className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-bold text-lg ${
                            dayTotal >= 15
                              ? "bg-success/20 text-success"
                              : "bg-warning/20 text-warning"
                          }`}
                        >
                          {dayTotal}
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-xl">
                      {calculateTotal(
                        employees?.reduce(
                          (sales, employee) => sales.concat(employee.week || []),
                          []
                        )
                      )}
                    </span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredEmployees?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <HiCalendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">
            Aucune donnee
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Aucune donnee disponible pour cette semaine
          </p>
        </div>
      )}
    </div>
  );
};
