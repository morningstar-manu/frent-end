export function convertirEnFrancais(status) {
  switch (status) {
    case "pending":
      return "En attente";
    case "confirmed":
      return "Confirmé";
    case "cancelled":
      return "Annulé";
    case "not-interested":
      return "Non intéressé";
    case "to-be-reminded":
      return "À rappeler";
    case "longest-date":
      return "Date éloignée";
    default:
      return status;
  }
}

export function getBackgroundColor(status) {
  switch (status) {
    case "pending":
      return "text-amber-700 bg-amber-50 border border-amber-200";
    case "confirmed":
      return "text-emerald-700 bg-emerald-50 border border-emerald-200";
    case "cancelled":
      return "text-red-700 bg-red-50 border border-red-200";
    case "not-interested":
      return "text-slate-700 bg-slate-100 border border-slate-200";
    case "to-be-reminded":
      return "text-sky-700 bg-sky-50 border border-sky-200";
    case "longest-date":
      return "text-violet-700 bg-violet-50 border border-violet-200";
    default:
      return "text-slate-600 bg-slate-50 border border-slate-200";
  }
}

export function getStatusIcon(status) {
  switch (status) {
    case "pending":
      return "clock";
    case "confirmed":
      return "check-circle";
    case "cancelled":
      return "x-circle";
    case "not-interested":
      return "minus-circle";
    case "to-be-reminded":
      return "bell";
    case "longest-date":
      return "calendar";
    default:
      return "help-circle";
  }
}
