import {
  Tabs,
  Tab,
  Button,
  Card,
  CardBody,
  Spacer,
} from "@heroui/react";
import { useState } from "react";
import { Plus } from "lucide-react";
import JobList from "./JobList";
import JobForm from "./JobForm";

export default function Jobs() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Temporary mock job data
  const jobs = [
    {
      id: 1,
      customer: "Smith Residence",
      location: "Texarkana, TX",
      status: "Pending",
      total: "$4,200",
      date: "2025-10-09",
    },
    {
      id: 2,
      customer: "Rogers Warehouse",
      location: "Hope, AR",
      status: "Active",
      total: "$7,850",
      date: "2025-10-08",
    },
    {
      id: 3,
      customer: "Lone Star Storage",
      location: "Shreveport, LA",
      status: "Completed",
      total: "$9,120",
      date: "2025-10-02",
    },
  ];

  const filteredJobs =
    selectedTab === "all"
      ? jobs
      : jobs.filter((j) => j.status.toLowerCase() === selectedTab);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary">Jobs</h1>
        <Button
          color="secondary"
          startContent={<Plus className="w-5 h-5" />}
          onPress={() => setIsModalOpen(true)}
        >
          New Job
        </Button>
      </div>

      <Card shadow="md" className="bg-content2 border border-default/20">
        <CardBody>
          <Tabs
            aria-label="Job Status Tabs"
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key.toString())}
            color="secondary"
            variant="underlined"
          >
            <Tab key="all" title="All">
              <JobList jobs={filteredJobs} />
            </Tab>
            <Tab key="pending" title="Pending">
              <JobList jobs={filteredJobs} />
            </Tab>
            <Tab key="active" title="Active">
              <JobList jobs={filteredJobs} />
            </Tab>
            <Tab key="completed" title="Completed">
              <JobList jobs={filteredJobs} />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      <Spacer y={4} />

      <JobForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
