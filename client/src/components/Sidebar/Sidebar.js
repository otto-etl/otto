import React from "react";
import ExecutionLogs from "./ExecutionLogs";
import EditWorkflow from "./EditWorkflow";
import { Box, Divider } from "@mui/material";

const Sidebar = ({
  handleExecutionListItemClick,
  handleEditWorkflowListItemClick,
}) => {
  const [selectedEditIndex, setSelectedEditIndex] = React.useState(0);
  const [selectedTestIndex, setSelectedTestIndex] = React.useState(null);
  const [selectedActiveIndex, setSelectedActiveIndex] = React.useState(null);

  const testExecutions = [
    { id: 1, primary: "23 Jun at 12:19:14", success: true },
    { id: 2, primary: "23 Jun at 12:19:01", success: true },
    { id: 3, primary: "22 Jun at 2:39:12", success: false },
    { id: 4, primary: "15 Jun at 09:11:48", success: true },
  ];

  const activeExecutions = [
    { id: 5, primary: "24 Jun at 00:00:00", success: false },
  ];

  const handleEditListItemClick = (event, index) => {
    // Prevents function from executing when "Edit Test Workflow" is already selected.
    if (event.target.closest(".Mui-selected")) return;

    setSelectedEditIndex(index);
    setSelectedTestIndex(null);
    setSelectedActiveIndex(null);
    handleEditWorkflowListItemClick();
    console.log("UPDATE REACT FLOW STATE");
  };

  const handleTestListItemClick = (event, index) => {
    setSelectedEditIndex(null);
    setSelectedTestIndex(index);
    setSelectedActiveIndex(null);
    handleExecutionListItemClick(
      [
        {
          id: "630209ad-83bb-4660-acf3-c6addad35d13",
          data: {
            label: "Schedule node",
            output: "",
            startTime: "2023-07-07T04:00:00.000Z",
            intervalInMinutes: 1440,
          },
          type: "trigger",
          width: 150,
          height: 150,
          dragging: false,
          position: {
            x: 200,
            y: -80,
          },
          selected: false,
          positionAbsolute: {
            x: 200,
            y: -80,
          },
        },
        {
          id: "7934b136-e69e-4255-8123-cf42f2cab4a9",
          data: {
            url: "https://dog.ceo/api/breeds/list/all",
            json: {},
            prev: "630209ad-83bb-4660-acf3-c6addad35d13",
            error: null,
            input: "",
            label: "Extract node",
            output: {
              data: {
                status: "success",
                message: {
                  mix: [],
                  pug: [],
                  chow: [],
                  dane: ["great"],
                  akita: [],
                  boxer: [],
                  corgi: ["cardigan"],
                  dhole: [],
                  dingo: [],
                  frise: ["bichon"],
                  hound: [
                    "afghan",
                    "basset",
                    "blood",
                    "english",
                    "ibizan",
                    "plott",
                    "walker",
                  ],
                  husky: [],
                  lhasa: [],
                  shiba: [],
                  spitz: ["japanese"],
                  beagle: [],
                  borzoi: [],
                  briard: [],
                  buhund: ["norwegian"],
                  collie: ["border"],
                  eskimo: [],
                  kelpie: [],
                  kuvasz: [],
                  poodle: ["medium", "miniature", "standard", "toy"],
                  puggle: [],
                  saluki: [],
                  setter: ["english", "gordon", "irish"],
                  vizsla: [],
                  african: [],
                  basenji: [],
                  bouvier: [],
                  bulldog: ["boston", "english", "french"],
                  clumber: [],
                  finnish: ["lapphund"],
                  maltese: [],
                  mastiff: ["bull", "english", "tibetan"],
                  pitbull: [],
                  pointer: ["german", "germanlonghair"],
                  redbone: [],
                  samoyed: [],
                  segugio: ["italian"],
                  sharpei: [],
                  shihtzu: [],
                  spaniel: [
                    "blenheim",
                    "brittany",
                    "cocker",
                    "irish",
                    "japanese",
                    "sussex",
                    "welsh",
                  ],
                  terrier: [
                    "american",
                    "australian",
                    "bedlington",
                    "border",
                    "cairn",
                    "dandie",
                    "fox",
                    "irish",
                    "kerryblue",
                    "lakeland",
                    "norfolk",
                    "norwich",
                    "patterdale",
                    "russell",
                    "scottish",
                    "sealyham",
                    "silky",
                    "tibetan",
                    "toy",
                    "welsh",
                    "westhighland",
                    "wheaten",
                    "yorkshire",
                  ],
                  whippet: [],
                  airedale: [],
                  bluetick: [],
                  cockapoo: [],
                  doberman: [],
                  elkhound: ["norwegian"],
                  havanese: [],
                  keeshond: [],
                  komondor: [],
                  labrador: [],
                  leonberg: [],
                  malamute: [],
                  malinois: [],
                  mountain: ["bernese", "swiss"],
                  ovcharka: ["caucasian"],
                  papillon: [],
                  pekinese: [],
                  pembroke: [],
                  pinscher: ["miniature"],
                  pyrenees: [],
                  sheepdog: ["english", "shetland"],
                  springer: ["english"],
                  tervuren: [],
                  waterdog: ["spanish"],
                  brabancon: [],
                  cattledog: ["australian"],
                  chihuahua: [],
                  coonhound: [],
                  dachshund: [],
                  dalmatian: [],
                  deerhound: ["scottish"],
                  greyhound: ["italian"],
                  retriever: ["chesapeake", "curly", "flatcoated", "golden"],
                  ridgeback: ["rhodesian"],
                  schnauzer: ["giant", "miniature"],
                  stbernard: [],
                  wolfhound: ["irish"],
                  australian: ["shepherd"],
                  otterhound: [],
                  pomeranian: [],
                  rottweiler: [],
                  schipperke: [],
                  weimaraner: [],
                  appenzeller: [],
                  bullterrier: ["staffordshire"],
                  entlebucher: [],
                  groenendael: [],
                  labradoodle: [],
                  newfoundland: [],
                  affenpinscher: [],
                  cotondetulear: [],
                  germanshepherd: [],
                  mexicanhairless: [],
                },
              },
            },
            httpVerb: "GET",
          },
          type: "extract",
          width: 150,
          height: 150,
          dragging: false,
          position: {
            x: 420,
            y: -80,
          },
          selected: false,
          positionAbsolute: {
            x: 420,
            y: -80,
          },
        },
      ],

      [
        {
          id: "reactflow__edge-630209ad-83bb-4660-acf3-c6addad35d13a-7934b136-e69e-4255-8123-cf42f2cab4a9",
          style: {
            stroke: "#000033",
          },
          source: "630209ad-83bb-4660-acf3-c6addad35d13",
          target: "7934b136-e69e-4255-8123-cf42f2cab4a9",
          animated: true,
          sourceHandle: "a",
          targetHandle: null,
        },
      ]
    );

    console.log("UPDATE REACT FLOW STATE");
  };

  const handleActiveListItemClick = (event, index) => {
    setSelectedEditIndex(null);
    setSelectedActiveIndex(index);
    setSelectedTestIndex(null);
    handleExecutionListItemClick([], []);
    console.log("UPDATE REACT FLOW STATE");
  };

  return (
    <Box
      sx={{
        width: 250,
        height: "calc(100vh - 160px)",
        borderRight: "2px solid #E4E4E4",
        padding: "24px",
      }}
    >
      <EditWorkflow
        selectedEditIndex={selectedEditIndex}
        handleEditListItemClick={handleEditListItemClick}
      />
      <Divider sx={{ mb: "20px" }} />
      <ExecutionLogs
        testExecutions={testExecutions}
        activeExecutions={activeExecutions}
        selectedTestIndex={selectedTestIndex}
        selectedActiveIndex={selectedActiveIndex}
        handleTestListItemClick={handleTestListItemClick}
        handleActiveListItemClick={handleActiveListItemClick}
      />
    </Box>
  );
};

export default Sidebar;
