import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get("dashboard/")
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        YSCMT Dashboard
      </h1>

      <pre>
        {JSON.stringify(stats, null, 2)}
      </pre>
    </div>
  );
}
