import { FormValues } from "../components/submit/submit-form";
import { Content } from "@tiptap/core";
import { IncomingHttpHeaders } from "http";

const createReport = async (value: FormValues) => {
  return fetch(`/api/reports`, {
    body: JSON.stringify(value),
  }).then(async (response) => {
    if (!response.ok) throw response;
    return await response.json();
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
    body: JSON.stringify({ body, author, byStaff }),
  }).then(async (response) => {
    if (!response.ok) throw response;
    return await response.json();
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
    if (!response.ok) throw response;
    return await response.json();
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
    if (!response.ok) throw response;
    return await response.json();
  });
};

export { createReport, getReports, getReport, createComment };
