import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";

type Job = {
    id: number;
    customer: string;
    location: string;
    status: string;
    total: string;
    date: string;
};

interface JobListProps {
    jobs: Job[];
}

export default function JobList({ jobs }: JobListProps) {
    const navigate = useNavigate();

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "warning";
            case "active":
                return "secondary";
            case "completed":
                return "success";
            default:
                return "default";
        }
    };

    return (
        <Table
            aria-label="Job List"
            shadow="none"
            classNames={{
                th: "bg-content3 text-default-600 font-semibold",
                td: "text-foreground text-sm",
                tr: "hover:bg-content3/50 cursor-pointer transition-colors",
            }}
        >
            <TableHeader>
                <TableColumn>Customer</TableColumn>
                <TableColumn>Location</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Total</TableColumn>
                <TableColumn>Date</TableColumn>
            </TableHeader>
            <TableBody>
                {jobs.map((job) => (
                    <TableRow key={job.id} onClick={() => navigate(`/jobs/${job.id}`)}>
                        <TableCell>{job.customer}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>
                            <Chip
                                color={getStatusColor(job.status)}
                                size="sm"
                                variant="flat"
                                className="capitalize"
                            >
                                {job.status}
                            </Chip>
                        </TableCell>
                        <TableCell>{job.total}</TableCell>
                        <TableCell>{job.date}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
