"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Card, CardHeader, CardBody } from "@heroui/react";
import { toast } from "sonner";
import { useSupabase } from "@/core/providers/SupabaseProvider";

export default function OwnerForm() {
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    business_name: "",
    owner_name: "",
    location_city: "",
    location_state: "",
    phone_number: "",
    email: "",
    num_employees: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.business_name ||
      !form.owner_name ||
      !form.location_city ||
      !form.location_state ||
      !form.phone_number ||
      !form.email
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.rpc("complete_onboarding", {
        p_business_name: form.business_name,
        p_owner_name: form.owner_name,
        p_location_city: form.location_city,
        p_location_state: form.location_state,
        p_phone_number: form.phone_number,
        p_email: form.email,
        p_num_employees: form.num_employees
          ? parseInt(form.num_employees)
          : 1,
      });

      if (error) throw error;

      toast.success("Welcome to FoamBoss! Your setup is complete.");
      navigate("/dashboard");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-full max-w-[400px] sm:max-w-[420px]"
    >
      <Card className="w-full bg-black/50 backdrop-blur-xl border border-purple-500/30 shadow-md shadow-purple-700/10 rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-col items-center text-center pb-2">
          <h2 className="text-2xl font-bold text-purple-400">
            Business Information
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Tell us about your company
          </p>
        </CardHeader>

        <CardBody className="flex flex-col gap-4 px-6 py-6 text-left">
          <Input
            label="Business Name"
            name="business_name"
            value={form.business_name}
            onChange={handleChange}
            required
          />
          <Input
            label="Owner Name"
            name="owner_name"
            value={form.owner_name}
            onChange={handleChange}
            required
          />
          <div className="flex gap-2">
            <Input
              label="City"
              name="location_city"
              value={form.location_city}
              onChange={handleChange}
              required
            />
            <Input
              label="State"
              name="location_state"
              value={form.location_state}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            label="Phone Number"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            required
          />
          <Input
            label="Business Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Number of Employees"
            name="num_employees"
            type="number"
            value={form.num_employees}
            onChange={handleChange}
          />

          <Button
            color="secondary"
            type="submit"
            className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white"
            isDisabled={loading}
          >
            {loading ? "Submitting..." : "Complete Setup"}
          </Button>
        </CardBody>
      </Card>
    </form>
  );
}
