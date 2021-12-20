import { FormValues } from "../components/submit/submit-form";
import { Content } from "@tiptap/core";
import { IncomingHttpHeaders } from "http";

export interface fetchError {
  code: string;
  message: string;
}

const createReport = async (value: FormValues) => {
  return fetch(`/api/reports`, {
    method: "POST",
    body: JSON.stringify(value),
  }).then(async (response) => {
    const responseBody = await response.json();
    if (!response.ok)
      throw {
        code: response.status,
        message: responseBody?.errorMessage
          ? responseBody?.errorMessage
          : undefined,
      };
    return responseBody;
  });
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
  return fetch(`/api/reports/${reportId}`, {
    method: "POST",
    body: JSON.stringify({ body, author, byStaff }),
  }).then(async (response) => {
    const responseBody = await response.json();
    if (!response.ok)
      throw {
        code: response.status,
        message: responseBody?.errorMessage
          ? responseBody?.errorMessage
          : undefined,
      };
    return responseBody;
  });
};

const getReports = async (
  userId: string,
  anonymous: boolean,
  headers?: IncomingHttpHeaders,
  isStaff = false,
) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/reports?` +
      `userId=${userId}&` +
      `anonymous=${anonymous}&` +
      `isStaff=${isStaff}`,
    {
      headers: headers ? { cookie: headers.cookie } : {},
      method: "GET",
    },
  ).then(async (response) => {
    const responseBody = await response.json();
    if (!response.ok)
      throw {
        code: response.status,
        message: responseBody?.errorMessage
          ? responseBody?.errorMessage
          : undefined,
      };
    return responseBody;
  });
};

const getReport = async (
  reportId: string,
  userId: string,
  headers?: IncomingHttpHeaders,
) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/reports/${reportId}?userId=${userId}`,
    {
      headers: headers ? { cookie: headers.cookie } : {},
      method: "GET",
    },
  ).then(async (response) => {
    const responseBody = await response.json();
    if (!response.ok)
      throw {
        code: response.status,
        message: responseBody?.errorMessage
          ? responseBody?.errorMessage
          : undefined,
      };
    return responseBody;
  });
};

export { createReport, getReports, getReport, createComment };
