import express from "express";

const router = express.Router();
const workflowObject = {
  nodes: [
    {
      id: "1",
      type: "schedule",
      data: {
        label: "Schedule",
        startTime: "26 Jun 2023 7:16:00 CST",
        intervalInMinutes: "1",
        output: "schedule output",
      },
      position: {
        x: 0,
        y: 50,
      },
      sourcePosition: "right",
    },
    {
      id: "2",
      type: "extract",
      data: {
        prev: "1",
        label: "Extract",
        url: "https://dog.ceo/api/breeds/list/all",
        httpVerb: "GET",
        jsonBody: {},
        output: "",
      },
      position: {
        x: 210,
        y: 90,
      },
      targetPosition: "left",
    },
    {
      id: "3",
      type: "transform",
      data: {
        prev: "2",
        label: "Transform",
        jsCode: "",
        output: "",
      },
      position: {
        x: 425,
        y: 5,
      },
      targetPosition: "left",
    },
    {
      id: "4",
      type: "load",
      data: {
        prev: "3",
        label: "Load",
        userName: "postgres",
        password: "password",
        port: "5432",
        sqlCode: "INSERT INTO breed() VALUES()",
        output: "",
      },
      position: {
        x: 650,
        y: 75,
      },
      targetPosition: "left",
    },
  ],
  edges: [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: false,
      style: {
        stroke: "#000033",
      },
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      animated: false,
      style: {
        stroke: "#000033",
      },
    },
    {
      id: "e3-4",
      source: "3",
      target: "4",
      animated: false,
      style: {
        stroke: "#000033",
      },
    },
  ],
};

router.get("/workflows/:id", (req, res) => {
  res.status(200).json(workflowObject);
});

router.put("/workflows/:id", (req, res) => {
  res.status(200).json(req.body);
});

router.post("/execute/node", (req, res) => {
  res.status(200).send("test");
});

router.post("/execute/workflow/:id", (req, res) => {
  console.log("Got the request");
  console.log(req.body.nodes[0].position);

  const newWorkflowObject = {
    nodes: [
      {
        id: "1",
        type: "schedule",
        data: {
          label: "Schedule",
          startTime: "26 Jun 2023 7:16:00 CST",
          intervalInMinutes: "1",
          output: "",
        },
        position: {
          x: 0,
          y: 50,
        },
        sourcePosition: "right",
      },
      {
        id: "2",
        type: "extract",
        data: {
          prev: "1",
          label: "Extract",
          url: "https://dog.ceo/api/breeds/list/all",
          httpVerb: "GET",
          jsonBody: {},
          output: "extraction output",
        },
        position: {
          x: 210,
          y: 90,
        },
        targetPosition: "left",
      },
      {
        id: "3",
        type: "transform",
        data: {
          prev: "2",
          label: "Transform",
          jsCode: "",
          output: "transformation output",
        },
        position: {
          x: 425,
          y: 5,
        },
        targetPosition: "left",
      },
      {
        id: "4",
        type: "load",
        data: {
          prev: "3",
          label: "Load",
          userName: "postgres",
          password: "password",
          port: "5432",
          sqlCode: "INSERT INTO breed() VALUES()",
          output: "load output",
        },
        position: {
          x: 650,
          y: 75,
        },
        targetPosition: "left",
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        animated: false,
        style: {
          stroke: "#000033",
        },
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        animated: false,
        style: {
          stroke: "#000033",
        },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        animated: false,
        style: {
          stroke: "#000033",
        },
      },
    ],
  };

  res.status(200).send(newWorkflowObject);
});

export default router;
