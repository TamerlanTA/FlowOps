"use client";

import Link from "next/link";
import { Clock, DollarSign, TrendingDown, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import Reveal from "@/components/Reveal";

function AnimatedValue({
  value,
  prefix = "",
  suffix = "",
  inView,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  inView: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>(0);
  const prevValue = useRef(0);

  useEffect(() => {
    if (!inView) {
      return;
    }

    const from = prevValue.current;
    const to = value;
    const start = performance.now();
    const duration = 1200;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        prevValue.current = to;
      }
    };

    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [value, inView]);

  return (
    <span>
      {prefix}
      {display.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix = "",
  id,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  id: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2.5 sm:space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-medium text-slate-200/90 sm:text-sm">
          {label}
        </label>
        <span className="shrink-0 text-xs font-semibold tabular-nums text-blue-300 sm:text-sm">
          {value.toLocaleString("en-US")}
          {suffix}
        </span>
      </div>

      <div className="relative">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="roi-slider w-full cursor-pointer touch-pan-y"
          style={{
            ["--slider-pct" as string]: `${pct}%`,
          }}
        />
      </div>
    </div>
  );
}

function ResultCard({
  icon: Icon,
  label,
  value,
  prefix,
  suffix,
  highlighted,
  inView,
  index,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  highlighted?: boolean;
  inView: boolean;
  index: number;
}) {
  return (
    <Reveal variant="scale" index={index} staggerBase={100}>
      <div
        className={`relative flex flex-col items-center rounded-xl p-4 text-center transition-all duration-500 sm:rounded-2xl sm:p-6 ${
          highlighted ? "liquid-glass-elevated prismatic-edge" : "liquid-glass"
        }`}
      >
        {highlighted ? (
          <div
            className="pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, rgba(68,120,255,0.08), transparent 70%)",
            }}
          />
        ) : null}

        <div
          className={`relative mb-3 flex size-9 items-center justify-center rounded-lg sm:mb-4 sm:size-11 sm:rounded-xl ${
            highlighted
              ? "bg-blue-500/15 text-blue-300"
              : "liquid-glass-subtle text-slate-400"
          }`}
        >
          <Icon className="size-4 sm:size-5" />
        </div>

        <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:text-xs">
          {label}
        </p>

        <p
          className={`text-lg font-bold tabular-nums sm:text-2xl md:text-3xl ${
            highlighted ? "text-blue-300" : "text-white"
          }`}
        >
          <AnimatedValue value={value} prefix={prefix} suffix={suffix} inView={inView} />
        </p>
      </div>
    </Reveal>
  );
}

export default function RoiCalculator() {
  const [employees, setEmployees] = useState(5);
  const [hoursPerWeek, setHoursPerWeek] = useState(15);
  const [hourlyCost, setHourlyCost] = useState(35);
  const [leadLoss, setLeadLoss] = useState(20);
  const [monthlyRevenue, setMonthlyRevenue] = useState(50000);

  const resultsRef = useRef<HTMLDivElement>(null);
  const [resultsInView, setResultsInView] = useState(false);

  useEffect(() => {
    const element = resultsRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setResultsInView(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const monthlyHoursWasted = employees * hoursPerWeek * 4.33;
  const monthlyCost = Math.round(monthlyHoursWasted * hourlyCost);
  const annualLoss = monthlyCost * 12;
  const automationSavingsRate = 0.55;
  const annualSavings = Math.round(annualLoss * automationSavingsRate);

  const results = [
    {
      icon: Clock,
      label: "Monthly Hours Wasted",
      value: Math.round(monthlyHoursWasted),
      suffix: " hrs",
    },
    {
      icon: DollarSign,
      label: "Monthly Cost of Manual Work",
      value: monthlyCost,
      prefix: "$",
    },
    {
      icon: TrendingDown,
      label: "Estimated Annual Loss",
      value: annualLoss,
      prefix: "$",
    },
    {
      icon: Zap,
      label: "Potential Annual Savings",
      value: annualSavings,
      prefix: "$",
      highlighted: true,
    },
  ];

  return (
    <section id="calculator" className="relative px-5 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-16">
          <Reveal variant="fade">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300 sm:mb-3 sm:text-sm">
              ROI Calculator
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Calculate Your Hidden Operational Loss
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-3 text-sm text-slate-300 sm:mt-4 sm:text-base">
              See how much time and money manual processes are costing your business.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-5 lg:gap-10">
          <Reveal variant="left" className="lg:col-span-2">
            <div className="rounded-2xl p-6 liquid-glass-elevated prismatic-edge sm:rounded-3xl sm:p-8 md:p-10">
              <h3 className="mb-6 text-base font-semibold text-white sm:mb-8 sm:text-lg">
                Your Business Metrics
              </h3>

              <div className="space-y-6 sm:space-y-8">
                <SliderInput
                  id="employees"
                  label="Employees involved in manual tasks"
                  value={employees}
                  onChange={setEmployees}
                  min={1}
                  max={100}
                  step={1}
                />
                <SliderInput
                  id="hours"
                  label="Hours per week on repetitive work"
                  value={hoursPerWeek}
                  onChange={setHoursPerWeek}
                  min={1}
                  max={40}
                  step={1}
                  suffix=" hrs"
                />
                <SliderInput
                  id="cost"
                  label="Average hourly cost"
                  value={hourlyCost}
                  onChange={setHourlyCost}
                  min={10}
                  max={200}
                  step={5}
                  suffix="$"
                />
                <SliderInput
                  id="leadloss"
                  label="Estimated lead loss percentage"
                  value={leadLoss}
                  onChange={setLeadLoss}
                  min={0}
                  max={60}
                  step={5}
                  suffix="%"
                />
                <SliderInput
                  id="revenue"
                  label="Monthly revenue"
                  value={monthlyRevenue}
                  onChange={setMonthlyRevenue}
                  min={5000}
                  max={500000}
                  step={5000}
                  suffix="$"
                />
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-3" ref={resultsRef}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {results.map((result, index) => (
                <ResultCard
                  key={result.label}
                  icon={result.icon}
                  label={result.label}
                  value={result.value}
                  prefix={result.prefix}
                  suffix={result.suffix}
                  highlighted={result.highlighted}
                  inView={resultsInView}
                  index={index}
                />
              ))}
            </div>

            {leadLoss > 0 && monthlyRevenue > 0 ? (
              <Reveal variant="fade" delay={500}>
                <div className="mt-3 rounded-xl p-4 text-center liquid-glass sm:mt-4 sm:rounded-2xl sm:p-6">
                  <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:text-xs">
                    Revenue Lost to Missed Leads
                  </p>
                  <p className="text-lg font-bold tabular-nums text-white sm:text-xl">
                    <AnimatedValue
                      value={Math.round(monthlyRevenue * (leadLoss / 100) * 12)}
                      prefix="$"
                      suffix="/yr"
                      inView={resultsInView}
                    />
                  </p>
                </div>
              </Reveal>
            ) : null}

            <Reveal delay={600}>
              <div className="mt-4 rounded-2xl p-6 text-center liquid-glass-elevated prismatic-edge sm:mt-8 sm:rounded-3xl sm:p-8">
                <h3 className="text-lg font-bold text-white sm:text-xl md:text-2xl">
                  See What a Structured System Could Save You
                </h3>
                <p className="mt-1.5 text-xs text-slate-400 sm:mt-2 sm:text-sm">
                  Get a detailed breakdown specific to your operations.
                </p>

                <div className="mt-4 sm:mt-6">
                  <Link
                    href="/#contact"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-blue-500 px-8 py-3 text-sm font-medium text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:bg-blue-400 active:scale-[0.98] sm:w-auto sm:rounded-2xl md:hover:scale-[1.03]"
                  >
                    Request a Process Audit
                    <svg
                      className="ml-2"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 7H12M12 7L8 3M12 7L8 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
