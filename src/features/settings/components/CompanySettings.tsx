"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, Button, Input } from "@heroui/react";
import { useSupabase } from "@/core/providers/SupabaseProvider";
import { toast } from "sonner";

export default function CompanySettings() {
  const { supabase } = useSupabase();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [company, setCompany] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  // Load company info on mount
  useEffect(() => {
    const loadCompany = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", user.user.id)
        .single();

      if (error) {
        console.error(error);
        toast.error("Failed to load company info");
      } else {
        setCompany(data);
        setForm(data);
      }

      setLoading(false);
    };

    loadCompany();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("businesses")
      .update(form)
      .eq("id", company.id);

    if (error) {
      console.error(error);
      toast.error("Failed to update company info");
    } else {
      toast.success("Company info updated");
      setCompany(form);
      setEditing(false);
    }
    setLoading(false);
  };

  if (loading) return <p className="text-center text-neutral-400 mt-8">Loading company info...</p>;

  return (
    <Card className="border border-purple-500/20 bg-black/30 backdrop-blur-md text-white rounded-2xl shadow-lg shadow-purple-700/10">
      <CardBody className="p-6 sm:p-8 space-y-6">
        {!editing ? (
          <>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              <Info label="Business Name" value={company?.business_name} />
              <Info label="Owner Name" value={company?.owner_name} />
              <Info label="Email" value={company?.email} />
              <Info label="Phone Number" value={company?.phone_number} />
              <Info
                label="Location"
                value={`${company?.location_city}, ${company?.location_state}`}
              />
              <Info
                label="Number of Employees"
                value={company?.num_employees?.toString() || "—"}
              />
            </div>

            <div className="flex justify-end mt-4">
              <Button
                color="secondary"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onPress={() => setEditing(true)}
              >
                Edit Info
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              <Input
                label="Business Name"
                name="business_name"
                value={form.business_name || ""}
                onChange={handleChange}
              />
              <Input
                label="Owner Name"
                name="owner_name"
                value={form.owner_name || ""}
                onChange={handleChange}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email || ""}
                onChange={handleChange}
              />
              <Input
                label="Phone Number"
                name="phone_number"
                value={form.phone_number || ""}
                onChange={handleChange}
              />
              <Input
                label="City"
                name="location_city"
                value={form.location_city || ""}
                onChange={handleChange}
              />
              <Input
                label="State"
                name="location_state"
                value={form.location_state || ""}
                onChange={handleChange}
              />
              <Input
                label="Number of Employees"
                name="num_employees"
                type="number"
                value={form.num_employees || ""}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="flat"
                onPress={() => {
                  setForm(company);
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                color="secondary"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onPress={handleSave}
                isDisabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase text-neutral-400 tracking-wide">{label}</p>
      <p className="text-base font-medium text-white">{value || "—"}</p>
    </div>
  );
}
