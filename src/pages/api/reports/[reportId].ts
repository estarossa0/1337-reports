import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma/client";
import * as yup from "yup";

const schema = yup.object().shape({
  body: yup.object().required(),
  author: yup.string().required().max(12),
  byStaff: yup.boolean().required(),
});

const getHandler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ errorMessage: "Not logged in" });
  if (Date.now() > Date.parse(session.expires))
    return res.status(401).json({ errorMessage: "Session expired" });

  const reportId = req.query.reportId;
  const userId = req.query.userId;

  if (
    !reportId ||
    reportId instanceof Array ||
    !userId ||
    userId instanceof Array
  )
    return res
      .status(422)
      .json({ errorMessage: "Request param are not valid" });

  const report = await prisma.report.findUnique({
    where: { id: parseInt(reportId) },
    include: { comment: true },
  });
  if (!report || (report.reporter !== userId && report.staff !== userId))
    return res.status(404).json({ errorMessage: "Not found" });

  return res.status(200).json(report);
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ errorMessage: "Not logged in" });
  if (Date.now() > Date.parse(session.expires))
    return res.status(401).json({ errorMessage: "Session expired" });

  const reportId = req.query.reportId;
  const data = req.body;
  const valid = schema.isValidSync(data);

  if (!reportId || reportId instanceof Array || !valid)
    return res
      .status(422)
      .json({ errorMessage: "Request param are not valid" });

  const id = parseInt(reportId);

  const addedComment = await prisma.comment.create({
    data: {
      author: data.author,
      body: JSON.stringify(data.body),
      report: { connect: { id: id } },
      byStaff: data.byStaff,
    },
  });

  if (!addedComment)
    return res.status(500).json({ message: "Could not create comment" });

  return res.status(200).json("hey");
};

const report = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (req.method === "GET") return await getHandler(req, res);
  if (req.method === "POST") return await postHandler(req, res);
  return res.status(405).end();
};

export { report as default };
