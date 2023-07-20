// import { updateNodes } from "../../models/workflowsService.js";
import {
  throwNDErrorAndUpdateDB,
  throwEXErrorAndUpdateDB,
} from "../../utils/errors.js";
import { nodeInputvalidation } from "../../utils/nodeInput.js";
import axios from "axios";
import {
  runAPI,
  sendAPIWithoutOAuth,
  sendAPIWithOAuth,
} from "../../utils/apiExec.js";
jest.mock("../../models/workflowService.js");

const mockWorkflowObjNoOAuth = {
  id: 20,
  name: "test2",
  active: false,
  nodes: [
    {
      id: "04a391a9-18b1-4673-a4fb-0947476bd072",
      type: "extractApi",
      position: {
        x: 660,
        y: -120,
      },
      data: {
        label: "Extract API node",
        output: "",
        url: "https://dog.ceo/api/breeds/list/all",
        json: {},
        httpVerb: "GET",
      },
      width: 300,
      height: 67,
      selected: true,
      dragging: false,
      positionAbsolute: {
        x: 660,
        y: -120,
      },
    },
  ],
  created_at: "2023-07-20T14:34:39.769Z",
  updated_at: "2023-07-20T16:37:17.807Z",
  edges: [],
  settings: null,
  static_data: null,
  start_time: null,
  error: {
    name: "WorkflowError",
    message: "Nodes can not be empty",
  },
};

const mockApiNodeNoOAuth = mockWorkflowObj.nodes[0];

test("get data from api endpoint without oauth", async () => {
  const res = await sendAPIWithoutOAuth(
    mockApiNodeNoOAuth,
    mockWorkflowObjNoOAuth
  );
  expect(res.status).toBe(200);
});
