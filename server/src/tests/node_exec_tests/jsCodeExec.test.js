import "dotenv/config";
import { runJSCode } from "../../utils/jsCodeExec";
import { getMultipleInputData } from "../../utils/node.js";
import { throwNDErrorAndUpdateDB } from "../../utils/errors.js";
import { updateNodes } from "../../models/workflowsService.js";
import { nodeInputvalidation } from "../../utils/nodeInput.js";
jest.mock("../../utils/node.js");
jest.mock("../../utils/errors.js");
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
      type: "transform",
      data: {
        label: "legit code",
        jsCode: "let dog = data.dog; data = dog[0]",
      },
    },
    {
      id: "2",
      type: "transform",
      data: {
        label: "illegit code",
        jsCode: "let dog = data.dog; data = dog2",
      },
    },
  ],
};

const mockNodeObjLegitCode = mockWorkflowObj.nodes[0];
const mockNodeObjIllegitCode = mockWorkflowObj.nodes[1];
test("run jscode without error", async () => {
  nodeInputvalidation.mockResolvedValue(undefined);
  getMultipleInputData.mockResolvedValue({
    data: {
      dog: [
        { ahchew: "is an idiot but he is so cute" },
        { bobo: "is another idiot but he is so sweet" },
      ],
    },
  });
  const res = await runJSCode(mockWorkflowObj, mockNodeObjLegitCode);
  expect(updateNodes.mock.calls).toHaveLength(1);
  expect(res.data.ahchew).toBe("is an idiot but he is so cute");
});

test("run jscode with illegit code", async () => {
  nodeInputvalidation.mockResolvedValue(undefined);
  getMultipleInputData.mockResolvedValue({
    data: {
      dog: [
        { ahchew: "is an idiot but he is so cute" },
        { bobo: "is another idiot but he is so sweet" },
      ],
    },
  });
  const res = await runJSCode(mockWorkflowObj, mockNodeObjIllegitCode);
  expect(throwNDErrorAndUpdateDB.mock.calls).toHaveLength(1);
});
