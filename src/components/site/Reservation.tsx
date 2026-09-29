import { useState } from "react";
import { Check, ChevronLeft, X } from "lucide-react";
import { toast } from "sonner";
import { createReservation } from "@/lib/restaurant-api";

const SEATING = [
  {
    name: "Main Dining Room",
    desc: "Candlelit, velvet banquettes",
  },
  {
    name: "Chef's Counter",
    desc: "Front row to the woodfire",
  },
  {
    name: "Outdoor Patio",
    desc: "Olive trees & firepits",
  },
  {
    name: "Private Dining Room",
    desc: "Up to 14 guests, sommelier",
  },
];

const TIMES = [
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
];

const STEPS = [
  "Guests",
  "Date & Time",
  "Seating",
  "Details",
];

export function ReservationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);

  const [f, setF] = useState({
    guests: 2,
    date: "",
    time: "",
    seating: "",
    name: "",
    email: "",
    phone: "",
    occasion: "",
    notes: "",
  });

  const [ref, setRef] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const canNext = [
    f.guests > 0,
    !!f.date && !!f.time,
    !!f.seating,
    !!f.name && /\S+@\S+\.\S+/.test(f.email),
  ][step];

  const close = () => {
    if (submitting) return;

    onClose();

    setTimeout(() => {
      setStep(0);
      setRef("");

      setF({
        guests: 2,
        date: "",
        time: "",
        seating: "",
        name: "",
        email: "",
        phone: "",
        occasion: "",
        notes: "",
      });
    }, 300);
  };

  const input =
    "w-full border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none";

  const handleConfirmReservation = async () => {
    if (!canNext || submitting) return;

    try {
      setSubmitting(true);

      const reference = await createReservation({
        guests: f.guests,
        date: f.date,
        time: f.time,
        seating: f.seating,
        name: f.name,
        email: f.email,
        phone: f.phone,
        occasion: f.occasion,
        notes: f.notes,
      });

      setRef(reference);

      toast("Reservation saved successfully.");
    } catch (error) {
      console.error(
        "Reservation submission failed:",
        error,
      );

      toast(
        "Could not save your reservation. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={close}
        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-fade-in"
      />

      <div className="glass relative max-h-[92vh] w-full max-w-2xl overflow-y-auto p-6 shadow-gold animate-scale-in md:p-10">
        <button
          type="button"
          onClick={close}
          disabled={submitting}
          className="absolute right-5 top-5 text-muted-foreground hover:text-foreground disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {ref ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary text-primary">
              <Check className="h-7 w-7" />
            </div>

            <p className="eyebrow mt-6 text-primary">
              Reservation Confirmed
            </p>

            <h3 className="mt-3 font-serif text-3xl tracking-widest">
              We await you, {f.name.split(" ")[0]}
            </h3>

            <p className="mt-2 font-script text-3xl text-champagne">
              the fire will be lit
            </p>

            <dl className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-px border border-border bg-border text-left text-sm">
              {[
                ["Reference", ref],
                [
                  "Guests",
                  f.guests >= 10 ? "10+" : f.guests,
                ],
                [
                  "Date",
                  new Date(f.date).toDateString(),
                ],
                ["Time", f.time],
                ["Seating", f.seating],
                [
                  "Occasion",
                  f.occasion || "—",
                ],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="bg-card p-4"
                >
                  <dt className="eyebrow text-muted-foreground">
                    {k}
                  </dt>

                  <dd className="mt-1">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-xs text-muted-foreground">
              Your reservation request has been received.
            </p>

            <button
              type="button"
              onClick={close}
              className="eyebrow bg-gold mt-8 px-10 py-4 text-primary-foreground"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow text-primary">
              Reserve a Table
            </p>

            <h3 className="mt-2 font-serif text-3xl tracking-widest">
              {STEPS[step]}
            </h3>

            <div className="mt-6 flex gap-2">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`h-px flex-1 transition-colors duration-500 ${
                    i <= step
                      ? "bg-primary"
                      : "bg-border"
                  }`}
                />
              ))}
            </div>

            <div className="mt-8 min-h-[260px]">
              {step === 0 && (
                <div className="grid grid-cols-5 gap-3">
                  {Array.from({ length: 10 }).map(
                    (_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setF({
                            ...f,
                            guests: i + 1,
                          })
                        }
                        className={`aspect-square border font-serif text-2xl transition ${
                          f.guests === i + 1
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/60"
                        }`}
                      >
                        {i === 9 ? "10+" : i + 1}
                      </button>
                    ),
                  )}

                  {f.guests >= 10 && (
                    <p className="col-span-5 text-sm text-muted-foreground">
                      For parties above 10, our events
                      team will contact you to arrange
                      the Private Dining Room.
                    </p>
                  )}
                </div>
              )}

              {step === 1 && (
                <div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {days.map((d) => {
                      const iso = d
                        .toISOString()
                        .slice(0, 10);

                      const closed =
                        d.getDay() === 1;

                      return (
                        <button
                          key={iso}
                          type="button"
                          disabled={closed}
                          onClick={() =>
                            setF({
                              ...f,
                              date: iso,
                            })
                          }
                          className={`w-16 shrink-0 border py-3 text-center transition disabled:opacity-25 ${
                            f.date === iso
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/60"
                          }`}
                        >
                          <div className="eyebrow text-[9px]">
                            {d.toLocaleDateString(
                              "en",
                              {
                                weekday: "short",
                              },
                            )}
                          </div>

                          <div className="font-serif text-xl">
                            {d.getDate()}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2">
                    {TIMES.map((t, i) => (
                      <button
                        key={t}
                        type="button"
                        disabled={i === 4}
                        onClick={() =>
                          setF({
                            ...f,
                            time: t,
                          })
                        }
                        className={`border py-3 text-sm transition disabled:line-through disabled:opacity-30 ${
                          f.time === t
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/60"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {SEATING.map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() =>
                        setF({
                          ...f,
                          seating: s.name,
                        })
                      }
                      className={`border p-5 text-left transition ${
                        f.seating === s.name
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/60"
                      }`}
                    >
                      <p className="font-display text-xl">
                        {s.name}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {s.desc}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className={input}
                    placeholder="Full name *"
                    value={f.name}
                    onChange={(e) =>
                      setF({
                        ...f,
                        name: e.target.value,
                      })
                    }
                  />

                  <input
                    className={input}
                    placeholder="Email *"
                    type="email"
                    value={f.email}
                    onChange={(e) =>
                      setF({
                        ...f,
                        email: e.target.value,
                      })
                    }
                  />

                  <input
                    className={input}
                    placeholder="Phone"
                    value={f.phone}
                    onChange={(e) =>
                      setF({
                        ...f,
                        phone: e.target.value,
                      })
                    }
                  />

                  <select
                    className={input}
                    value={f.occasion}
                    onChange={(e) =>
                      setF({
                        ...f,
                        occasion: e.target.value,
                      })
                    }
                  >
                    <option value="">
                      Special occasion?
                    </option>

                    {[
                      "Birthday",
                      "Anniversary",
                      "Proposal",
                      "Business",
                      "Celebration",
                    ].map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>

                  <textarea
                    className={`${input} sm:col-span-2`}
                    rows={3}
                    placeholder="Dietary needs or notes for the chef"
                    value={f.notes}
                    onChange={(e) =>
                      setF({
                        ...f,
                        notes: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setStep(Math.max(0, step - 1))
                }
                className={`eyebrow flex items-center gap-1 text-muted-foreground hover:text-foreground ${
                  step === 0 ? "invisible" : ""
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>

              <button
                type="button"
                disabled={!canNext || submitting}
                onClick={() => {
                  if (step < 3) {
                    setStep(step + 1);
                  } else {
                    void handleConfirmReservation();
                  }
                }}
                className="eyebrow bg-gold px-10 py-4 text-primary-foreground transition disabled:opacity-30"
              >
                {step < 3
                  ? "Continue"
                  : submitting
                    ? "Saving..."
                    : "Confirm Reservation"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}