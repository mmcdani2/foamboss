"use client"

import { Tabs, Tab, Card, CardBody } from "@heroui/react"
import Labor from "./Labor"
import Markup from "./Markup"
import Mobilization from "./Mobilization"
import Overhead from "./Overhead"
import Production from "./Production"

export default function PricingSettings() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pricing Settings</h1>
          <p className="text-default-500 text-sm">
            Manage global rates, margins, and production data for all estimates.
          </p>
        </div>
      </header>

      <Card className="p-4">
        <CardBody>
          <Tabs
            aria-label="Pricing Settings Tabs"
            color="primary"
            variant="bordered"
            fullWidth
          >
            <Tab key="labor" title="Labor">
              <Labor />
            </Tab>
            <Tab key="markup" title="Markup">
              <Markup />
            </Tab>
            <Tab key="mobilization" title="Mobilization">
              <Mobilization />
            </Tab>
            <Tab key="overhead" title="Overhead">
              <Overhead />
            </Tab>
            <Tab key="production" title="Production">
              <Production />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  )
}
