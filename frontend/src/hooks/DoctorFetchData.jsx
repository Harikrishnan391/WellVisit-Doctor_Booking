import { useState, useEffect } from "react";
import { docToken } from "../config.js";

const DoctorFetchData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${docToken}` },
      });

      console.log(res);
      const result = await res.json();
      console.log(result, "result");

      if (!res.ok) {
        throw new Error(result.message);
      }

      setData(result.data);
      setResult(result);
      setLoading(false);
    } catch (error) {
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
    result,
  };
};

export default DoctorFetchData;
