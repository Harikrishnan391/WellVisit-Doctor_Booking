import { useEffect, useState } from "react";
import { token} from "../config.js";
console.log("token")

const userFetchData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log(url)
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
    
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      setData(result.data);
      setLoading(false);
    } catch (error) {
      console.log(error,"error")
      setLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    fetchData,
    refetch,
  };
};

export default userFetchData;
