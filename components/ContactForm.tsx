"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Reveal from "@/components/Reveal";
import { REVENUE_RANGES } from "@/lib/constants";

type FormValues = {
  name: string;
  company: string;
  businessType: string;
  revenueRange: string;
  problemDescription: string;
  email: string;
  whatsapp: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type SendLeadResponse = {
  success: boolean;
  message: string;
  leadId?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const INITIAL_VALUES: FormValues = {
  name: "",
  company: "",
  businessType: "",
  revenueRange: "",
  problemDescription: "",
  email: "",
  whatsapp: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d\s()-]{7,20}$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.company.trim()) errors.company = "Company is required.";
  if (!values.businessType.trim()) errors.businessType = "Business type is required.";
  if (!values.revenueRange.trim()) errors.revenueRange = "Revenue range is required.";
  if (values.problemDescription.trim().length < 20) {
    errors.problemDescription =
      "Describe your process challenge in at least 20 characters.";
  }
  if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!PHONE_REGEX.test(values.whatsapp.trim())) {
    errors.whatsapp = "Enter a valid WhatsApp number.";
  }

  return errors;
}

function normalizeServerErrors(
  fieldErrors?: Record<string, string[] | undefined>,
): FormErrors {
  if (!fieldErrors) {
    return {};
  }

  return {
    name: fieldErrors.name?.[0],
    company: fieldErrors.company?.[0],
    businessType: fieldErrors.businessType?.[0],
    revenueRange: fieldErrors.revenueRange?.[0],
    problemDescription: fieldErrors.problemDescription?.[0],
    email: fieldErrors.email?.[0],
    whatsapp: fieldErrors.whatsapp?.[0],
  };
}

function FieldLabel({
  htmlFor,
  label,
  active,
  required,
}: {
  htmlFor: string;
  label: string;
  active: boolean;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`pointer-events-none absolute left-4 z-10 transition-all duration-200 ${
        active ? "top-2 text-xs font-medium text-blue-300" : "top-4 text-sm text-slate-400"
      }`}
    >
      {label}
      {required ? <span className="ml-0.5 text-blue-300">*</span> : null}
    </label>
  );
}

export default function ContactForm() {
  const router = useRouter();

  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [focused, setFocused] = useState<keyof FormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    const redirectTimer = setTimeout(() => {
      router.push("/thank-you");
    }, 1400);

    return () => clearTimeout(redirectTimer);
  }, [isSuccess, router]);

  const formDisabled = isSubmitting || isSuccess;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const clientErrors = validate(values);
    setErrors(clientErrors);
    setServerMessage("");

    if (Object.keys(clientErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/sendLead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as SendLeadResponse;

      if (!response.ok || !data.success) {
        const serverFieldErrors = normalizeServerErrors(data.fieldErrors);
        if (Object.keys(serverFieldErrors).length > 0) {
          setErrors(serverFieldErrors);
        }

        setIsSuccess(false);
        setServerMessage(data.message || "Failed to submit form.");
        return;
      }

      setErrors({});
      setLeadId(data.leadId ?? null);
      setIsSuccess(true);
      setServerMessage(
        data.message ||
          "Thanks. Your request has been received. Redirecting to confirmation page...",
      );
    } catch {
      setIsSuccess(false);
      setServerMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 pb-3 pt-7 text-sm text-white outline-none transition-all duration-300 focus:border-blue-400/40 focus:bg-white/10 focus:shadow-[0_0_0_3px_rgba(68,120,255,0.12)] sm:rounded-2xl min-h-[52px]";

  return (
    <section id="contact" className="relative px-5 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300 sm:mb-3 sm:text-sm">
                Contact
              </p>
              <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                Request your automation consulting audit
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:mt-4 sm:text-base">
                Fill out the form and our team will get back to you within 24
                hours with a practical review of business process automation,
                workflow automation, and CRM automation opportunities.
              </p>

              <div className="mt-8 space-y-3 sm:mt-10 sm:space-y-4">
                {[
                  "Free audit with no obligations",
                  "Personalized automation roadmap",
                  "Response within 24 hours",
                  "Confidential and secure",
                ].map((item, index) => (
                  <Reveal key={item} variant="fade" delay={200 + index * 100}>
                    <div className="flex items-center gap-3 text-sm text-slate-200/90">
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          className="text-blue-300"
                          aria-hidden="true"
                        >
                          <path
                            d="M2 5L4 7L8 3"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      {item}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal variant="right" delay={150}>
            <form
              onSubmit={handleSubmit}
              className="space-y-3 rounded-2xl p-6 liquid-glass-elevated prismatic-edge sm:space-y-4 sm:rounded-3xl sm:p-8 md:p-10"
              noValidate
              aria-busy={isSubmitting}
            >
              {serverMessage ? (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm sm:rounded-2xl ${
                    isSuccess
                      ? "border-emerald-300/40 bg-emerald-500/15 text-emerald-200"
                      : "border-red-300/40 bg-red-500/15 text-red-200"
                  }`}
                  role="status"
                >
                  {serverMessage}
                  {leadId ? <div className="mt-1 text-xs text-slate-200">Reference: {leadId}</div> : null}
                </div>
              ) : null}

              <div className="relative">
                <FieldLabel htmlFor="name" label="Name" active={focused === "name" || values.name.length > 0} required />
                <input
                  id="name"
                  type="text"
                  disabled={formDisabled}
                  value={values.name}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
                  className={`${inputClasses} ${errors.name ? "border-red-400/80" : ""} ${formDisabled ? "cursor-not-allowed opacity-80" : ""}`}
                />
                {errors.name ? <p className="mt-1 text-xs text-red-300">{errors.name}</p> : null}
              </div>

              <div className="relative">
                <FieldLabel htmlFor="company" label="Company" active={focused === "company" || values.company.length > 0} required />
                <input
                  id="company"
                  type="text"
                  disabled={formDisabled}
                  value={values.company}
                  onFocus={() => setFocused("company")}
                  onBlur={() => setFocused(null)}
                  onChange={(event) => setValues((prev) => ({ ...prev, company: event.target.value }))}
                  className={`${inputClasses} ${errors.company ? "border-red-400/80" : ""} ${formDisabled ? "cursor-not-allowed opacity-80" : ""}`}
                />
                {errors.company ? <p className="mt-1 text-xs text-red-300">{errors.company}</p> : null}
              </div>

              <div className="relative">
                <FieldLabel htmlFor="businessType" label="Business Type" active={focused === "businessType" || values.businessType.length > 0} required />
                <input
                  id="businessType"
                  type="text"
                  disabled={formDisabled}
                  value={values.businessType}
                  onFocus={() => setFocused("businessType")}
                  onBlur={() => setFocused(null)}
                  onChange={(event) => setValues((prev) => ({ ...prev, businessType: event.target.value }))}
                  className={`${inputClasses} ${errors.businessType ? "border-red-400/80" : ""} ${formDisabled ? "cursor-not-allowed opacity-80" : ""}`}
                />
                {errors.businessType ? <p className="mt-1 text-xs text-red-300">{errors.businessType}</p> : null}
              </div>

              <div className="relative">
                <FieldLabel htmlFor="revenueRange" label="Revenue" active={focused === "revenueRange" || values.revenueRange.length > 0} required />
                <select
                  id="revenueRange"
                  disabled={formDisabled}
                  value={values.revenueRange}
                  onFocus={() => setFocused("revenueRange")}
                  onBlur={() => setFocused(null)}
                  onChange={(event) => setValues((prev) => ({ ...prev, revenueRange: event.target.value }))}
                  className={`${inputClasses} appearance-none ${errors.revenueRange ? "border-red-400/80" : ""} ${formDisabled ? "cursor-not-allowed opacity-80" : ""}`}
                >
                  <option value="" />
                  {REVENUE_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
                {errors.revenueRange ? <p className="mt-1 text-xs text-red-300">{errors.revenueRange}</p> : null}
              </div>

              <div className="relative">
                <FieldLabel htmlFor="problemDescription" label="Problem Description" active={focused === "problemDescription" || values.problemDescription.length > 0} required />
                <textarea
                  id="problemDescription"
                  rows={4}
                  disabled={formDisabled}
                  value={values.problemDescription}
                  onFocus={() => setFocused("problemDescription")}
                  onBlur={() => setFocused(null)}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      problemDescription: event.target.value,
                    }))
                  }
                  className={`${inputClasses} resize-none ${errors.problemDescription ? "border-red-400/80" : ""} ${formDisabled ? "cursor-not-allowed opacity-80" : ""}`}
                />
                {errors.problemDescription ? <p className="mt-1 text-xs text-red-300">{errors.problemDescription}</p> : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <div className="relative">
                  <FieldLabel htmlFor="email" label="Email" active={focused === "email" || values.email.length > 0} required />
                  <input
                    id="email"
                    type="email"
                    disabled={formDisabled}
                    value={values.email}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
                    className={`${inputClasses} ${errors.email ? "border-red-400/80" : ""} ${formDisabled ? "cursor-not-allowed opacity-80" : ""}`}
                  />
                  {errors.email ? <p className="mt-1 text-xs text-red-300">{errors.email}</p> : null}
                </div>

                <div className="relative">
                  <FieldLabel htmlFor="whatsapp" label="WhatsApp" active={focused === "whatsapp" || values.whatsapp.length > 0} required />
                  <input
                    id="whatsapp"
                    type="tel"
                    disabled={formDisabled}
                    value={values.whatsapp}
                    onFocus={() => setFocused("whatsapp")}
                    onBlur={() => setFocused(null)}
                    onChange={(event) => setValues((prev) => ({ ...prev, whatsapp: event.target.value }))}
                    className={`${inputClasses} ${errors.whatsapp ? "border-red-400/80" : ""} ${formDisabled ? "cursor-not-allowed opacity-80" : ""}`}
                  />
                  {errors.whatsapp ? <p className="mt-1 text-xs text-red-300">{errors.whatsapp}</p> : null}
                </div>
              </div>

              <button
                type="submit"
                disabled={formDisabled}
                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-500 px-6 py-3 text-sm font-medium text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98] sm:rounded-2xl md:hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="mr-2 size-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Sending...
                  </>
                ) : isSuccess ? (
                  "Submitted"
                ) : (
                  <>
                    Submit Request
                    <svg className="ml-2" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
