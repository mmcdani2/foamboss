import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Select,
  SelectItem,
  Button,
  Divider,
  Listbox,
  ListboxItem,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from "@heroui/react";
import { Plus, Calculator, Clock } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { kpis } from "@/data/kpis";
import { materialUsage } from "@/data/materialUsage";

export default function Dashboard() {
  const [area, setArea] = useState("");
  const [foamType, setFoamType] = useState("");

  const foamOptions = [
    { key: "open", label: "Open-Cell Foam" },
    { key: "closed", label: "Closed-Cell Foam" },
    { key: "roof", label: "Roof Deck Foam" },
  ];

  const handleQuote = () => {
    if (!area || !foamType) {
      alert("Please enter area and select foam type.");
      return;
    }
    alert(`Generating quote for ${area} sq ft of ${foamType} foam...`);
  };

  // --- Today's Jobs ---
  const jobs = [
    { id: 1, title: "Smith Residence", status: "Scheduled", time: "8:00 AM" },
    { id: 2, title: "Rogers Warehouse", status: "In Progress", time: "10:30 AM" },
    { id: 3, title: "Lone Star Storage", status: "Complete", time: "2:15 PM" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "primary";
      case "In Progress":
        return "warning";
      case "Complete":
        return "success";
      default:
        return "default";
    }
  };

  const [kpiIndex, setKpiIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);


  // auto-advance every 30 s
  useEffect(() => {
    // clear any existing timer
    if (intervalRef.current) clearInterval(intervalRef.current);

    // start new 30s timer
    intervalRef.current = setInterval(() => {
      nextKpi();
    }, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [kpiIndex]);

  // --- modify manual nav handlers ---
  const nextKpi = () => {
    setKpiIndex((prev) => (prev + 1) % kpis.length);
  };

  const prevKpi = () => {
    setKpiIndex((prev) => (prev - 1 + kpis.length) % kpis.length);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground overflow-y-auto no-scrollbar">
      <h1 className="text-3xl font-bold text-secondary mb-6 tracking-tight">
        Dashboard
      </h1>

      {/* ----- Main Grid ----- */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Quick Quote Launcher */}
        <Card shadow="md" className="bg-content2 border border-default/20">
          <CardHeader>
            <h2 className="font-semibold text-lg text-foreground">
              Quick Quote Launcher
            </h2>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input
              type="number"
              label="Area (sq ft)"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Enter area"
            />
            <Select
              label="Foam Type"
              selectedKeys={foamType ? [foamType] : []}
              onChange={(e) => setFoamType(e.target.value)}
            >
              {foamOptions.map((opt) => (
                <SelectItem key={opt.key}>{opt.label}</SelectItem>
              ))}
            </Select>
            <Button
              color="secondary"
              variant="solid"
              radius="md"
              startContent={<Calculator className="w-5 h-5" />}
              onPress={handleQuote}
            >
              Generate Quote
            </Button>
          </CardBody>
        </Card>

        {/* ----- Today's Jobs Card ----- */}
        <Card shadow="md" className="bg-content2 border border-default/20">
          <CardHeader>
            <h2 className="font-semibold text-lg text-foreground">
              Today’s Jobs
            </h2>
          </CardHeader>
          <CardBody className="text-default-600 p-0">
            <Listbox
              aria-label="Today's Jobs"
              variant="flat"
              className="divide-y divide-default/10"
            >
              {jobs.map((job) => (
                <ListboxItem
                  key={job.id}
                  endContent={
                    <Chip
                      color={getStatusColor(job.status)}
                      size="sm"
                      variant="flat"
                      className="capitalize"
                    >
                      {job.status}
                    </Chip>
                  }
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {job.title}
                    </span>
                    <span className="text-default-500 flex items-center gap-1 text-sm">
                      <Clock className="w-4 h-4" /> {job.time}
                    </span>
                  </div>
                </ListboxItem>
              ))}
            </Listbox>
          </CardBody>
        </Card>

        {/* --- KPI Carousel Card --- */}
        <Card
          shadow="md"
          className="bg-content2 border border-default/20 h-[260px] sm:h-[300px] flex flex-col justify-between"
          onTouchStart={(e) =>
            (e.currentTarget.dataset.startX = e.touches[0].clientX.toString())
          }
          onTouchEnd={(e) => {
            const startX = Number(e.currentTarget.dataset.startX);
            const endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) nextKpi();       // swipe left → next
            else if (endX - startX > 50) prevKpi();  // swipe right → prev
          }}
        >
          <CardHeader className="flex justify-between items-center">
            <h2 className="font-semibold text-lg text-foreground">
              {kpis[kpiIndex].title}
            </h2>

            <div className="flex items-center gap-3">
              <button
                onClick={prevKpi}
                className="p-1.5 rounded-full hover:bg-content3 transition-colors"
                aria-label="Previous KPI"
              >
                <ChevronLeft className="w-5 h-5 text-default-600" />
              </button>

              <span className="text-sm text-default-500">
                {kpiIndex + 1}/{kpis.length}
              </span>

              <button
                onClick={nextKpi}
                className="p-1.5 rounded-full hover:bg-content3 transition-colors"
                aria-label="Next KPI"
              >
                <ChevronRight className="w-5 h-5 text-default-600" />
              </button>
            </div>
          </CardHeader>


          <CardBody className="relative flex flex-col items-center justify-center h-[220px] sm:h-[260px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={kpiIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center"
              >
                {kpis[kpiIndex].visual}
                <p className="text-2xl font-semibold text-success mt-2">
                  {kpis[kpiIndex].value}
                </p>
                {kpis[kpiIndex].delta && (
                  <p className="text-success text-sm">{kpis[kpiIndex].delta}</p>
                )}
                <p className="text-default-500 text-sm mt-2 px-3 text-center">
                  {kpis[kpiIndex].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </CardBody>
        </Card>



        {/* Material Usage Summary */}
        <Card
          shadow="md"
          className="bg-content2 border border-default/20 sm:col-span-2 lg:col-span-3"
        >
          <CardHeader>
            <h2 className="font-semibold text-lg text-foreground">
              Material Usage Summary
            </h2>
          </CardHeader>
          <CardBody className="overflow-x-auto">
            <Table
              aria-label="Material Usage Summary"
              shadow="none"
              classNames={{
                base: "min-w-full",
                th: "bg-content3 text-default-600 font-semibold",
                td: "text-foreground",
              }}
            >
              <TableHeader>
                <TableColumn>Material</TableColumn>
                <TableColumn>Used (bdft)</TableColumn>
                <TableColumn>Remaining (bdft)</TableColumn>
                <TableColumn>Usage %</TableColumn>
              </TableHeader>
              <TableBody>
                {materialUsage.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.used.toLocaleString()}</TableCell>
                    <TableCell>{item.remaining.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${item.percentUsed > 75
                              ? "bg-danger"
                              : item.percentUsed > 50
                                ? "bg-warning"
                                : "bg-success"
                            }`}
                        />
                        <span>{item.percentUsed}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

      </div>

      <Divider className="my-10 bg-default/30" />

      <Button
        color="secondary"
        variant="solid"
        radius="full"
        size="lg"
        className="fixed bottom-8 right-8 shadow-lg"
        startContent={<Plus className="w-5 h-5" />}
      >
        New Job
      </Button>
    </div>
  );
}
