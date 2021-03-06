import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { FormValues } from "../../../components/submit/submit-form";
import prisma from "../../../lib/prisma/client";
import * as yup from "yup";
import { validate as uuidValidate } from "uuid";
import { authUser } from "../auth/[...nextauth]";
import staffLogins from "../../../lib/staffLogins";
import { encode } from "@msgpack/msgpack";

const schema = yup.object().shape({
  title: yup.string().max(70).min(5).required(),
  anonymous: yup.boolean().required(),
  staff: yup.string().oneOf(staffLogins).required(),
  description: yup.object().nullable(),
  reporter: yup.string().nullable(),
});

const postHandler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ errorMessage: "Not logged in" });
  if (Date.now() > Date.parse(session.expires))
    return res.status(401).json({ errorMessage: "Session expired" });

  const data: FormValues = req.body;

  let valid = schema.isValidSync(data);
  if (data.anonymous) valid = uuidValidate(data.reporter);

  if (!valid)
    return res.status(422).json({ errorMessage: "Request body is not valid" });

  const user = session.user as authUser;

  let base64Body: string;
  if (data.description) {
    const encoded = encode(data.description);
    const buffered = Buffer.from(
      encoded.buffer,
      encoded.byteOffset,
      encoded.byteLength,
    );
    base64Body = buffered.toString("base64");
  }

  const response = await prisma.report
    .create({
      data: {
        anonymous: data.anonymous,
        title: data.title,
        withDescription: !!data.description,
        reporter: data.anonymous ? data.reporter : user.login,
        description: data.description ? base64Body : null,
        staff: data.staff,
      },
    })
    .then((newReport) => res.status(200).json({ reportId: newReport.id }))
    .catch(() => {
      return res.status(500).json({ errorMessage: "Failed to create report." });
    });
  return response;
};

const getHandler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const session = await getSession({ req });

  if (!session) return res.status(401).json({ errorMessage: "Not logged in" });
  if (Date.now() > Date.parse(session.expires))
    return res.status(401).json({ errorMessage: "Session expired" });
  if (!req.query.userId || !req.query.anonymous)
    return res.status(422).json({ errorMessage: "Request body is not valid" });

  const isStaff = req.query.isStaff === "true";

  const reports = await prisma.report.findMany({
    where: isStaff
      ? { staff: req.query.userId.toString() }
      : { reporter: req.query.userId.toString() },
    include: { _count: { select: { comment: true } } },
  });

  return res.status(200).json(reports);
};

const index = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (req.method === "POST") return await postHandler(req, res);
  if (req.method === "GET") return await getHandler(req, res);
  return res.status(405).end();
};

export default index;
