"use client";

import { useState } from "react";
import { Button, Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import OwnerForm from "./OwnerForm";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0118] via-[#120326] to-[#090014] text-white">
      <Card className="w-[92%] sm:w-[520px] p-8 backdrop-blur-2xl bg-black/50 border border-purple-500/30 shadow-xl shadow-purple-700/10 rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-col items-center text-center pb-4">
          <h1 className="text-3xl font-bold text-purple-400 tracking-tight mb-1">
            FoamBoss Setup
          </h1>
          <p className="text-neutral-400 text-sm">
            Let’s get your business ready to roll
          </p>
        </CardHeader>

        <CardBody className="flex flex-col items-center justify-center gap-6 px-2 py-2">
          {step === 1 && (
            <div className="space-y-4 text-center w-full max-w-[400px]">
              <p className="text-sm text-neutral-300">
                Are you the{" "}
                <span className="text-purple-300 font-semibold">
                  business owner
                </span>{" "}
                or joining an existing team?
              </p>
              <Button
                color="secondary"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2"
                onClick={() => setStep(2)}
              >
                I’m the Owner
              </Button>
              <Button
                variant="flat"
                className="w-full text-purple-300 hover:text-purple-200 rounded-md py-2"
                onClick={() => setStep(3)}
              >
                I’m Joining a Team
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="w-full flex flex-col items-center">
              <OwnerForm />
              <Button
                variant="flat"
                className="mt-6 text-purple-300 hover:text-purple-200"
                onClick={() => setStep(1)}
              >
                ← Back
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <p className="text-neutral-300 mb-4">
                Team member flow placeholder — will add join form here soon.
              </p>
              <Button
                variant="flat"
                className="text-purple-300 hover:text-purple-200"
                onClick={() => setStep(1)}
              >
                ← Back
              </Button>
            </div>
          )}
        </CardBody>

        <CardFooter className="flex justify-center text-xs text-neutral-500 pt-3">
          Step {step} of 3
        </CardFooter>
      </Card>
    </div>
  );
}
