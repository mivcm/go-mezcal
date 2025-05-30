"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface QuantityInputProps {
  initialValue?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export function QuantityInput({
  initialValue = 1,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
}: QuantityInputProps) {
  const [value, setValue] = useState(initialValue);

  const increment = () => {
    if (!disabled && value < max) {
      const newValue = value + 1;
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const decrement = () => {
    if (!disabled && value > min) {
      const newValue = value - 1;
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-r-none"
        onClick={decrement}
        disabled={value <= min || disabled}
      >
        <Minus className="h-4 w-4" />
        <span className="sr-only">Disminuir cantidad</span>
      </Button>
      <Input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        className="h-9 w-12 rounded-none border-x-0 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        disabled={disabled}
      />
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-l-none"
        onClick={increment}
        disabled={value >= max || disabled}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Aumentar cantidad</span>
      </Button>
    </div>
  );
}