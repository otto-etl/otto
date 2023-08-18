# Installing Otto

- Install [docker](https://docs.docker.com/engine/install/) if you don't have it yet.
- Download the `docker-compose.yml` file from [otto_docker](https://github.com/Runtime-Terrors-2305/otto_docker) repository (_need to update link once we change the org name_)
- Run `docker compose up` where the `docker-compose.yml` file is saved.
- Enter http://localhost:3001 in your browser to access the page.

# Creating a Workflow

## Creating a Workflow

- Click “+ Create Workflow”

- Enter your workflow’s name
- Click “Create”
<img width="1400" alt="01 createNewWF1" src="https://github.com/otto-etl/otto/assets/1952835/5ccae6de-b429-42fa-be20-c2e52c514937">
<img width="1400" alt="02 createNewWF2" src="https://github.com/otto-etl/otto/assets/1952835/49a530ea-3c35-4458-8b5a-5ee09d88d6ef">

# Editing a Workflow

## Creating a Node

- Click “+ Create Node”
- Choose a Node Type
- Typically, you want at least one of each major type: schedule, extract, transform, load

<img width="1400" alt="03 createNewNode1" src="https://github.com/otto-etl/otto/assets/1952835/5bf8effc-d2cc-4560-beb9-11726765c26f">

## Editing a Node

- Click on a node
- A node modal appears
  - Data that is pulled from the previous node(s) appears on the left section of the modal. Schedule nodes and extract nodes will never have content present here.
  - The center section of the modal contains fields within which to define pertinent information. What is displayed here is dependent on what node type you are editing.
  - Data that is returned by the node’s execution is displayed on the right section. Schedule nodes will never have content present here.
- Fill in the fields in the middle section of the node modal with the appropriate information.
- Click “Save” for schedule nodes or “Save And Execute” for all other nodes.
- You can also delete the node by clicking on the trash can present in the modal’s middle section.

<img width="1400" alt="04 editNode" src="https://github.com/otto-etl/otto/assets/1952835/b4c57780-cf03-43b1-b864-5cbdd7285195">

## Connecting Nodes

- Click on the right dot of the node you wish to be executed earlier in the sequence and drag the line that appears to the left dot of the node you wish to be executed later in the sequence.

<img width="1400" alt="05 connectNode" src="https://github.com/otto-etl/otto/assets/1952835/0a2840a4-8245-4499-83f8-9825a37cc3d1">

## When the workflow is saved

- You can manually save the workflow by clicking on the “Save” button on the workflow edit screen and by clicking “Save” or “Save And Execute” in the workflow modal.
- The workflow is also automatically saved whenever a node modal is displayed.

<img width="1400" alt="06 saveWFSS" src="https://github.com/otto-etl/otto/assets/1952835/d7e2378e-0552-4d80-9ae4-4c2497303e6f">

# Executing the Workflow

## Active Workflows

- A workflow has two states: Active or Test.
- User can toggle the active state by clicking the "Active" switch on the workflow edit screen
- During Test phase, you can:
  - Edit and save the workflow
  - Execute individual nodes
- During Active phase, the workflow is set to execute at the time and interval given in the workflow’s schedule node

<img width="1400" alt="07 activateWFSS" src="https://github.com/otto-etl/otto/assets/1952835/49f5951b-2c3f-4c95-805a-4b6ccaae190a">

## Manual Executions

- Regardless of which state the workflow is in, it can be manually executed using the “Execute Workflow” button.
- The button can only be clicked, however, when the workflow is in a completed state, with at least one of each major node type: schedule, extract, transform, and load.
  
<img width="1401" alt="08 executeWFSS" src="https://github.com/otto-etl/otto/assets/1952835/b571a635-1e70-49c7-8163-87fe27a11fbf">

# Logs and Metrics

## Test vs. Active Executions

- All full workflow executions are saved and displayed in the “EXECUTION LOGS” sidebar.
- Execution logs are separated into those executions performed while the workflow is in its Test state and those executions performed while the workflow is in its Active state.
- You can click on the “Test” and “Active” tabs in the sidebar to view the respective list of executions.

<img width="1399" alt="09 logsSidebar" src="https://github.com/otto-etl/otto/assets/1952835/67970f4b-ba80-49ee-ab73-7d99bf2ce7c3">

## Viewing an Execution

- You can view a particular execution by clicking on the execution log in the sidebar.
- The workflow’s state at the end of the execution will be displayed in the workflow workspace. Here, you can view each node’s input and output at the time of the execution. You can also view what nodes executed successfully. If an error occurred during a node’s execution, you can view the error message returned by that node.

<img width="1399" alt="10 errorNode" src="https://github.com/otto-etl/otto/assets/1952835/c4515240-2050-45a1-b917-fe83186ee37b">

## Returning to Edit Mode (Text/Active Workflow)

- You can return to the current version of the workflow by on “Test Workflow” if the workflow is in Test mode, or by clicking on “Active Workflow” if the workflow is in Active mode.

<img width="1399" alt="11 backToEdit" src="https://github.com/otto-etl/otto/assets/1952835/17911627-56e5-4cf4-b4ec-bbb46cb1db4f">

## Active Metrics

- Otto tracks metrics for the current version of the active workflow. Those metrics can be viewed by clicking on the “Active Metrics” button in the workflow workspace.

<img width="1400" alt="12 showMetrics" src="https://github.com/otto-etl/otto/assets/1952835/9b5c71a8-5376-4b3f-89fa-da1da2b1c9f8">

<img width="1088" alt="13 metrics" src="https://github.com/otto-etl/otto/assets/1952835/9287ff40-3741-45d2-9645-e13f6f31e82d">


# Returning to Workflows page

- From the Workflow Edit Screen, you can return to the Workflows Screen by clicking “All Workflows”.

<img width="1400" alt="backToAllWFs" src="https://github.com/otto-etl/otto/assets/1952835/ad9333bc-d83b-4124-8706-89245acadaaa">
