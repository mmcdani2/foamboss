"use client";

import { useState } from "react";
import { Button, Card, CardHeader, CardBody, CardFooter } from "@heroui/react";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0118] via-[#120326] to-[#090014] text-white">
      <Card className="w-[90%] sm:w-[480px] backdrop-blur-xl bg-black/40 border border-purple-500/30 shadow-lg shadow-purple-700/10 rounded-2xl">
        <CardHeader className="flex flex-col items-center text-center pb-0">
          <h1 className="text-3xl font-bold text-purple-400 tracking-tight">
            FoamBoss Setup
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Let’s get your business ready to roll
          </p>
        </CardHeader>

        <CardBody className="flex flex-col gap-4 mt-4">
          {step === 1 && (
            <div className="space-y-3 text-center">
              <p className="text-sm text-neutral-300 mb-4">
                Are you the <span className="text-purple-300 font-semibold">business owner</span> or joining an existing team?
              </p>
              <Button
                color="secondary"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => setStep(2)}
              >
                I’m the Owner
              </Button>
              <Button
                variant="flat"
                className="w-full text-purple-300 hover:text-purple-200"
                onClick={() => setStep(3)}
              >
                I’m Joining a Team
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <p>Owner flow placeholder — next step will be the business info form.</p>
              <Button
                variant="flat"
                className="mt-4 text-purple-300"
                onClick={() => setStep(1)}
              >
                ← Back
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <p>Team member flow placeholder — will add join form here soon.</p>
              <Button
                variant="flat"
                className="mt-4 text-purple-300"
                onClick={() => setStep(1)}
              >
                ← Back
              </Button>
            </div>
          )}
        </CardBody>

        <CardFooter className="flex justify-center text-xs text-neutral-500 mt-4">
          Step {step} of 3
        </CardFooter>
      </Card>
    </div>
  );
}
