import { RequestHandler } from "express";

const getServerHeartbeat: RequestHandler = (
  _,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __,
) => {
  res.status(200).send({
    date: [
      new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
      new Intl.DateTimeFormat("en", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date()),
    ].join("_"),
  });
};

export { getServerHeartbeat };
