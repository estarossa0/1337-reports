import axios from "axios";
import { FormValues } from "../components/submit/submit-form";

const createReport = (value: FormValues) => {
  return axios.post("/api/reports/", value);
};

export { createReport };
