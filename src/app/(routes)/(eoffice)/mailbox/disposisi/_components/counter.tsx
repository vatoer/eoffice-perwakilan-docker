"use client";
import { useCounterDisposisi } from "@/hooks/use-counter-disposisi";
import { useEffect } from "react";

interface CounterProps {
  count: number;
}
const Counter = ({ count }: CounterProps) => {
  const { setCounter } = useCounterDisposisi();

  // ignore eslint warning
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setCounter(count);
  }, [count]);

  return null;
};

export default Counter;
