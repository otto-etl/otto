import "dotenv/config";
import { updateNodes } from "../../models/workflowsService.js";
import { throwNDErrorAndUpdateDB } from "../../utils/errors.js";
import { sendAPIWithoutOAuth, runAPI } from "../../utils/apiExec.js";
jest.mock("../../utils/nodeInput.js");
jest.mock("../../models/workflowsService.js");
jest.mock("../../utils/errors.js");

const mockWorkflowObj = {
  id: 20,
  name: "test2",
  active: false,
  nodes: [
    {
      id: "1",
      type: "extractApi",
      data: {
        label: "Extract API node",
        output: "Dog right",
        url: "https://dog.ceo/api/breeds/list/all",
        json: {},
        httpVerb: "GET",
      },
    },
    {
      id: "2",
      type: "extractApi",
      data: {
        label: "Dog wrong",
        output: "",
        url: "https://dog.ce/api/breeds/list/all",
        json: {},
        httpVerb: "GET",
      },
    },
    {
      id: "2",
      type: "extractApi",
      data: {
        label: "Test Auth",
        output: "",
        url: "https://gorest.co.in/public/v2/users",
        json: {},
        httpVerb: "POST",
      },
    },
  ],
};

const mockApiNodelegitURL = mockWorkflowObj.nodes[0];
const mockApiNodeillegitURL = mockWorkflowObj.nodes[1];

test("get data from api endpoint without auth", async () => {
  const res = await sendAPIWithoutOAuth(mockApiNodelegitURL, mockWorkflowObj);
  expect(res.status).toBe("success");
});

test("run api for api endpoint without auth, correct URL, call db update once", async () => {
  const res = await runAPI(mockWorkflowObj, mockApiNodelegitURL);
  expect(updateNodes.mock.calls).toHaveLength(1);
  expect(res.data.status).toBe("success");
});

test("run api for api endpoint without auth, wrongURL, throw NodeError", async () => {
  const err = await runAPI(mockWorkflowObj, mockApiNodeillegitURL);
  expect(throwNDErrorAndUpdateDB.mock.calls).toHaveLength(1);
});
