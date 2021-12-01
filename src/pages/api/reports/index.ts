import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { FormValues } from "../../../components/submit/submit-form";
import prisma from "../../../lib/prisma/client";
import * as yup from "yup";

const schema = yup.object().shape({
  title: yup.string().max(70).min(5).required(),
  anonymous: yup.boolean().required(),
  staff: yup.string().oneOf(["staff"]).required(),
  description: yup.object().nullable(),
});

const index = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ errorMessage: "Not logged in" });
  if (Date.now() > Date.parse(session.expires))
    return res.status(401).json({ errorMessage: "Session expired" });

  const data: FormValues = req.body;

  const valid = schema.isValidSync(data);

  if (!valid)
    return res.status(422).json({ errorMessage: "Request body is not valid" });

  const response = await prisma.report
    .create({
      data: {
        anonymous: data.anonymous,
        title: data.title,
        withDescription: !!data.description,
        from: "me",
        Description: data.description ? JSON.stringify(data.description) : null,
        to: data.staff,
      },
    })
    .then((newReport) => res.status(200).json({ reportId: newReport.id }))
    .catch(() => {
      return res.status(500).json({ errorMessage: "Failed to create report." });
    });
  return response;
};

export default index;
