import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma/client";

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
  });

  if (!report || report.reporter !== userId)
    return res.status(404).json({ errorMessage: "Not found" });

  return res.status(200).json(report);
};

const report = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (req.method === "GET") return await getHandler(req, res);
  return res.status(405).end();
};

export { report as default };
