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
        return "text-green-900 bg-green-200";
      case "confirmed":
        return "text-blue-900 bg-blue-200";
      case "cancelled":
        return "text-red-900 bg-red-200";
      case "not-interested":
        return "text-gray-900 bg-gray-200";
      case "to-be-reminded":
        return "text-yellow-900 bg-yellow-200";
      case "longest-date":
        return "text-purple-900 bg-purple-200";
      default:
        return "";
    }
  }