// src/components/common/InfoTip.tsx
import React from "react";
import { Tooltip } from "@heroui/react";
import { Info } from "lucide-react";

/**
 * Shared InfoTip component
 * 
 * Used throughout FoamBoss to display consistent tooltips
 * aligned to the right-start position with HeroUI's secondary theme.
 * 
 * Usage:
 *   <InfoTip content="Explain what this setting does." />
 */
export default function InfoTip({ content }: { content: string }) {
    return (
        <Tooltip
            content={content}
            placement="right-start"
            color="secondary"
            offset={8}
            classNames={{
                base: "rounded-xl shadow-lg backdrop-blur-md border border-default/20",
                content: "text-sm font-medium text-white/90",
            }}
        >
            <Info
                size={16}
                className="
          text-default-400 cursor-pointer
          hover:text-secondary transition-all duration-200
          hover:scale-110 hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]
        "
            />
        </Tooltip>
    );
}
