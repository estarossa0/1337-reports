import axios from "axios";
import { FormValues } from "../components/submit/submit-form";
import { AxiosRequestHeaders } from "axios";
import { Content } from "@tiptap/core";

const createReport = async (value: FormValues) => {
  return axios.post("/api/reports/", value);
};

const createComment = async ({
  reportId,
  body,
  author,
  byStaff,
}: {
  reportId: string;
  body: Content;
  author: string;
  byStaff: boolean;
}) => {
  return axios
    .post(`/api/reports/${reportId}`, { body, author, byStaff })
    .then(({ data }) => data);
};

const getReports = async (
  userId: string,
  anonymous: boolean,
  headers?: AxiosRequestHeaders,
  isStaff = false,
) => {
  return axios
    .get("/api/reports", {
      baseURL: process.env.BASE_URL,
      params: { userId, anonymous, isStaff },
      headers: headers || {},
    })
    .then(({ data }) => data);
};

const getReport = async (
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

export { createReport, getReports, getReport, createComment };
