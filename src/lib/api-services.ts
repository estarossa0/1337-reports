import axios from "axios";
import { FormValues } from "../components/submit/submit-form";
import { AxiosRequestHeaders } from "axios";

const createReport = (value: FormValues) => {
  return axios.post("/api/reports/", value);
};

const getReports = (
  userId: string,
  anonymous: boolean,
  headers?: AxiosRequestHeaders,
) => {
  return axios
    .get("/api/reports", {
      baseURL: process.env.BASE_URL,
      params: { userId, anonymous },
      headers: headers || {},
    })
    .then(({ data }) => data);
};

const getReport = (
  reportId: string,
  userId: string,
  headers?: AxiosRequestHeaders,
) => {
  return axios
    .get(`/api/reports/${reportId}`, {
      baseURL: process.env.BASE_URL,
      params: { userId },
      headers: headers || {},
    })
    .then(({ data }) => data);
};

export { createReport, getReports, getReport };
