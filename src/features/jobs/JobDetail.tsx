import {
    Card,
    CardHeader,
    CardBody,
    Accordion,
    AccordionItem,
    Input,
    Textarea,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    ButtonGroup,
    Chip,
} from "@heroui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Send, CheckCircle2, Copy, ArrowLeft } from "lucide-react";

export default function JobDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock job data
    const job = {
        id,
        customer: "Smith Residence",
        location: "Texarkana, TX",
        area: 2800,
        foamType: "Closed-Cell Foam",
        status: "Active",
        total: "$7,850",
        date: "2025-10-09",
    };

    const materials = [
        { name: "Closed-Cell Foam A", used: 3500, remaining: 1500 },
        { name: "Closed-Cell Foam B", used: 2200, remaining: 800 },
    ];

    const [laborHours, setLaborHours] = useState("8");
    const [laborRate, setLaborRate] = useState("35");
    const [notes, setNotes] = useState("");

    return (
        <div className="min-h-screen bg-background text-foreground p-6">
            <div className="flex items-center justify-between mb-6">
                <Button
                    variant="flat"
                    color="default"
                    startContent={<ArrowLeft className="w-4 h-4" />}
                    onPress={() => navigate("/jobs")}
                >
                    Back to Jobs
                </Button>
                <h1 className="text-3xl font-bold text-secondary">Job Detail</h1>
            </div>

            {/* --- Summary Card --- */}
            <Card shadow="md" className="bg-content2 border border-default/20 mb-6">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                        <h2 className="text-xl font-semibold">{job.customer}</h2>
                        <Chip
                            color={
                                job.status === "Completed"
                                    ? "success"
                                    : job.status === "Active"
                                        ? "secondary"
                                        : "warning"
                            }
                            variant="flat"
                            size="sm"
                            className="capitalize mt-2 sm:mt-0"
                        >
                            {job.status}
                        </Chip>
                    </div>
                </CardHeader>
                <CardBody className="grid sm:grid-cols-2 gap-4">
                    <p>
                        <strong>Location:</strong> {job.location}
                    </p>
                    <p>
                        <strong>Foam Type:</strong> {job.foamType}
                    </p>
                    <p>
                        <strong>Area:</strong> {job.area.toLocaleString()} sq ft
                    </p>
                    <p>
                        <strong>Date:</strong> {job.date}
                    </p>
                    <p className="text-lg font-semibold text-success sm:col-span-2">
                        Total Estimate: {job.total}
                    </p>
                </CardBody>
            </Card>

            {/* --- Details Accordion --- */}
            <Accordion variant="splitted" className="mb-6">
                {/* Materials Used */}
                <AccordionItem key="materials" title="Materials Used">
                    <Table
                        aria-label="Materials Used"
                        shadow="none"
                        classNames={{
                            th: "bg-content3 text-default-600 font-semibold",
                            td: "text-foreground text-sm",
                        }}
                    >
                        <TableHeader>
                            <TableColumn>Material</TableColumn>
                            <TableColumn>Used (bdft)</TableColumn>
                            <TableColumn>Remaining (bdft)</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {materials.map((mat, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{mat.name}</TableCell>
                                    <TableCell>{mat.used.toLocaleString()}</TableCell>
                                    <TableCell>{mat.remaining.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </AccordionItem>

                {/* Labor Details */}
                <AccordionItem key="labor" title="Labor Details">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                            label="Hours Worked"
                            type="number"
                            value={laborHours}
                            onChange={(e) => setLaborHours(e.target.value)}
                        />
                        <Input
                            label="Hourly Rate ($)"
                            type="number"
                            value={laborRate}
                            onChange={(e) => setLaborRate(e.target.value)}
                        />
                    </div>
                    <p className="mt-3 text-sm text-default-500">
                        Estimated Labor Cost: $
                        {(parseFloat(laborHours) * parseFloat(laborRate) || 0).toFixed(2)}
                    </p>
                </AccordionItem>

                {/* Notes & Attachments */}
                <AccordionItem key="notes" title="Notes & Attachments">
                    <Textarea
                        label="Notes"
                        placeholder="Enter job notes or additional details..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        minRows={4}
                    />
                    <div className="mt-4">
                        <label className="text-sm font-medium">Attach Files</label>
                        <input
                            type="file"
                            multiple
                            className="block w-full mt-2 text-sm text-default-500"
                        />
                    </div>
                </AccordionItem>
            </Accordion>

            {/* --- Action Buttons --- */}
            <ButtonGroup className="flex flex-wrap gap-3">
                <Button color="primary" startContent={<Send className="w-4 h-4" />}>
                    Send Quote
                </Button>
                <Button
                    color="success"
                    startContent={<CheckCircle2 className="w-4 h-4" />}
                >
                    Mark Complete
                </Button>
                <Button color="secondary" startContent={<Copy className="w-4 h-4" />}>
                    Duplicate
                </Button>
            </ButtonGroup>
        </div>
    );
}
