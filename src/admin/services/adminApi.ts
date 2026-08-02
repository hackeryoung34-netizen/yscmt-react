import api from "../../services/api";

const adminApi = {
  getDashboard() {
    return api.get("dashboard/admin/");
  },
};

export default adminApi;
