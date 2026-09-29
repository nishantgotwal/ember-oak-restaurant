import {
  useEffect,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  Car,
  Shirt,
  Instagram,
  Heart,
  Quote,
  Star,
  X,
} from "lucide-react";

import { toast } from "sonner";

import chefImg from "@/assets/chef.jpg";
import farmImg from "@/assets/farm.jpg";
import heroImg from "@/assets/hero.jpg";
import dishesImg from "@/assets/dishes.jpg";

import { cropStyle } from "@/lib/menu-data";

import {
  createEventInquiry,
  subscribeToNewsletter,
} from "@/lib/restaurant-api";

function useOpenStatus() {
  const [s, setS] = useState<{
    open: boolean;
    label: string;
  } | null>(null);

  useEffect(() => {
    const calc = () => {
      const d = new Date();

      const h =
        d.getHours() + d.getMinutes() / 60;

      const closedDay = d.getDay() === 1;

      const open =
        !closedDay &&
        h >= 17.5 &&
        h < 23.5;

      setS({
        open,
        label: open
          ? "Open now · until 23:30"
          : closedDay
            ? "Closed Mondays · Tue from 17:30"
            : "Closed · opens 17:30",
      });
    };

    calc();

    const t = setInterval(calc, 60000);

    return () => clearInterval(t);
  }, []);

  return s;
}

export function Hero({
  onReserve,
}: {
  onReserve: () => void;
}) {
  const status = useOpenStatus();

  const [embers, setEmbers] = useState<
    { l: number; d: number; delay: number }[]
  >([]);

  useEffect(() => {
    setEmbers(
      Array.from({ length: 24 }).map(() => ({
        l: Math.random() * 100,
        d: 8 + Math.random() * 10,
        delay: Math.random() * 10,
      })),
    );
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <img
        src={heroImg}
        alt="Chef plating a dish before open woodfire flames"
        width={1920}
        height={1088}
        className="animate-kenburns absolute inset-0 h-full w-full object-cover"
      />

      <div className="animate-flicker absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,var(--color-primary),transparent_55%)] mix-blend-overlay" />

      {embers.map((e, i) => (
        <span
          key={i}
          className="ember"
          style={{
            left: `${e.l}%`,
            animationDuration: `${e.d}s`,
            animationDelay: `${e.delay}s`,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--color-background)_85%)]" />

      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background" />

      <div className="relative z-10 mx-auto max-w-5xl px-5 pb-40 pt-32 text-center">
        <div className="glass mx-auto inline-flex items-center gap-3 rounded-full px-5 py-2 animate-fade-in">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />

          <span className="eyebrow text-champagne">
            Voted Best Dining Experience 2026
          </span>

          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
        </div>

        <h1 className="mt-8 font-serif text-4xl leading-[1.1] tracking-[0.06em] sm:text-6xl md:text-7xl">
          <span className="text-gold">
            Artisanal Gastronomy
          </span>
          <br />

          <span className="font-display text-3xl italic tracking-normal text-foreground/90 sm:text-5xl md:text-6xl">
            meets
          </span>
          <br />

          <span className="text-gold">
            Woodfire Mastery
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-foreground/75 md:text-lg">
          An eleven-course journey through flame, smoke and
          season — cooked over oak and cherry wood, plated
          with a jeweller&apos;s patience.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={onReserve}
            className="eyebrow bg-gold px-10 py-4 text-primary-foreground shadow-gold transition hover:scale-[1.03]"
          >
            Reserve a Table
          </button>

          <a
            href="#menu"
            className="eyebrow border border-primary/60 px-10 py-4 text-primary transition hover:bg-primary/10"
          >
            Explore Menu
          </a>
        </div>
      </div>

      <div className="glass absolute bottom-6 left-1/2 z-10 grid w-[calc(100%-2.5rem)] max-w-5xl -translate-x-1/2 grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
        <div className="flex items-center gap-3 px-6 py-4">
          <span
            className={`h-2 w-2 rounded-full ${
              status?.open
                ? "bg-primary animate-pulse"
                : "bg-muted-foreground"
            }`}
          />

          <div>
            <p className="eyebrow text-[9px] text-muted-foreground">
              Hours
            </p>

            <p className="text-sm">
              {status?.label ??
                "Tue–Sun · 17:30–23:30"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-4">
          <Clock className="h-4 w-4 text-primary" />

          <div>
            <p className="eyebrow text-[9px] text-muted-foreground">
              Tonight&apos;s Tasting
            </p>

            <p className="text-sm">
              Ember &amp; Tide · 11 courses · $285
            </p>
          </div>
        </div>

        <a
          href="#visit"
          className="flex items-center gap-3 px-6 py-4 transition hover:bg-primary/5"
        >
          <MapPin className="h-4 w-4 text-primary" />

          <div>
            <p className="eyebrow text-[9px] text-muted-foreground">
              Find Us
            </p>

            <p className="text-sm">
              88 Ember Lane · +1 (212) 555-0188
            </p>
          </div>
        </a>
      </div>
    </section>
  );
}

export function ChefStory() {
  return (
    <section
      id="story"
      className="mx-auto max-w-7xl px-5 py-28"
    >
      <div className="reveal mb-12 text-center">
        <p className="eyebrow text-primary">
          Philosophy
        </p>

        <h2 className="mt-4 font-serif text-4xl tracking-[0.08em] md:text-6xl">
          <span className="text-gold">
            The Chef&apos;s Story
          </span>
        </h2>
      </div>

      <div className="grid auto-rows-[220px] gap-4 md:grid-cols-4">
        <div className="reveal group relative overflow-hidden border border-border md:col-span-2 md:row-span-2">
          <img
            src={chefImg}
            alt="Executive Chef Marco Vellani"
            loading="lazy"
            width={896}
            height={1152}
            className="h-full w-full object-cover object-top transition duration-[1.5s] group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          <div className="absolute bottom-0 p-8">
            <p className="eyebrow text-primary">
              Executive Chef
            </p>

            <h3 className="mt-2 font-serif text-3xl tracking-widest">
              Marco Vellani
            </h3>

            <p className="mt-3 max-w-md text-sm text-foreground/75">
              Trained in San Sebastián and Kyoto, Marco
              returned to the oldest technique of all — fire —
              to cook with honesty and restraint.
            </p>

            <p className="mt-4 font-script text-3xl text-champagne">
              &quot;Smoke is the spice we forgot.&quot;
            </p>
          </div>
        </div>

        <div className="reveal group relative overflow-hidden border border-border md:col-span-2">
          <img
            src={farmImg}
            alt="Heirloom produce from partner farms"
            loading="lazy"
            width={1024}
            height={1024}
            className="h-full w-full object-cover transition duration-[1.5s] group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />

          <div className="absolute inset-y-0 left-0 flex max-w-xs flex-col justify-center p-8">
            <p className="eyebrow text-primary">
              Farm to Table
            </p>

            <h3 className="mt-2 font-display text-2xl">
              14 partner farms within 90 miles
            </h3>
          </div>
        </div>

        <div className="reveal flex flex-col justify-between border border-border bg-card p-8 transition hover:border-primary/60">
          <p className="eyebrow text-muted-foreground">
            Woods we burn
          </p>

          <p className="font-serif text-5xl text-gold">
            3
          </p>

          <p className="text-sm text-muted-foreground">
            Oak, cherry &amp; vine cuttings — each chosen per
            dish.
          </p>
        </div>

        <div className="reveal group relative overflow-hidden border border-border">
          <div
            className="absolute inset-0 transition duration-[1.5s] group-hover:scale-110"
            style={cropStyle(0, dishesImg)}
          />

          <div className="absolute inset-0 bg-background/50" />

          <p className="eyebrow absolute bottom-5 left-5 text-champagne">
            Behind the Pass
          </p>
        </div>
      </div>
    </section>
  );
}

const SIGS = [
  {
    name: "Wagyu Tomahawk A5",
    crop: 0,
    pairing: "Barolo Riserva 2016",
    flavor: {
      Umami: 95,
      Smoke: 85,
      Richness: 90,
      Acidity: 20,
    },
  },
  {
    name: "Hokkaido Scallops",
    crop: 1,
    pairing: "Chablis Grand Cru 2019",
    flavor: {
      Umami: 70,
      Smoke: 30,
      Richness: 75,
      Acidity: 55,
    },
  },
  {
    name: "Ember-Kissed Octopus",
    crop: 4,
    pairing: "Assyrtiko, Santorini",
    flavor: {
      Umami: 65,
      Smoke: 90,
      Richness: 50,
      Acidity: 60,
    },
  },
  {
    name: "Obsidian Chocolate Dome",
    crop: 3,
    pairing: "Tawny Port 20yr",
    flavor: {
      Umami: 15,
      Smoke: 25,
      Richness: 98,
      Acidity: 30,
    },
  },
  {
    name: "Burrata & Heirloom",
    crop: 2,
    pairing: "Franciacorta Brut",
    flavor: {
      Umami: 40,
      Smoke: 5,
      Richness: 70,
      Acidity: 75,
    },
  },
];

function TiltCard({
  children,
  active,
}: {
  children: ReactNode;
  active: boolean;
}) {
  const [t, setT] = useState({
    x: 0,
    y: 0,
  });

  const move = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();

    setT({
      x:
        ((e.clientY - r.top) / r.height - 0.5) *
        -14,
      y:
        ((e.clientX - r.left) / r.width - 0.5) *
        14,
    });
  };

  return (
    <div
      onMouseMove={move}
      onMouseLeave={() =>
        setT({
          x: 0,
          y: 0,
        })
      }
      style={{
        perspective: 1000,
      }}
    >
      <div
        style={{
          transform: `rotateX(${t.x}deg) rotateY(${t.y}deg)`,
          transition: "transform .2s ease-out",
        }}
        className={`border bg-card transition-colors ${
          active
            ? "border-primary shadow-gold"
            : "border-border"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export function Signatures({
  onReserve,
}: {
  onReserve: () => void;
}) {
  const [i, setI] = useState(0);
  const n = SIGS.length;

  return (
    <section className="relative overflow-hidden py-28">
      <div className="reveal mb-14 text-center">
        <p className="eyebrow text-primary">
          Signature Creations
        </p>

        <h2 className="mt-4 font-serif text-4xl tracking-[0.08em] md:text-6xl">
          <span className="text-gold">
            From the Fire
          </span>
        </h2>
      </div>

      <div className="relative mx-auto h-[560px] max-w-6xl">
        {SIGS.map((s, k) => {
          let off = k - i;

          if (off > n / 2) off -= n;
          if (off < -n / 2) off += n;

          const abs = Math.abs(off);

          return (
            <div
              key={s.name}
              onClick={() => setI(k)}
              className="absolute left-1/2 top-0 w-[300px] cursor-pointer transition-all duration-700 ease-out md:w-[360px]"
              style={{
                transform: `translateX(calc(-50% + ${
                  off * 62
                }%)) scale(${1 - abs * 0.15}) rotateY(${
                  off * -8
                }deg)`,
                zIndex: 10 - abs,
                opacity:
                  abs > 2 ? 0 : 1 - abs * 0.35,
                filter: abs
                  ? "brightness(.55)"
                  : "none",
              }}
            >
              <TiltCard active={off === 0}>
                <div
                  className="aspect-square"
                  style={cropStyle(
                    s.crop,
                    dishesImg,
                  )}
                />

                <div className="p-6">
                  <h3 className="font-display text-2xl">
                    {s.name}
                  </h3>

                  <p className="eyebrow mt-3 text-[10px] text-muted-foreground">
                    Pairing
                  </p>

                  <p className="font-script text-2xl text-champagne">
                    {s.pairing}
                  </p>

                  <div className="mt-4 space-y-2">
                    {Object.entries(s.flavor).map(
                      ([k2, v]) => (
                        <div
                          key={k2}
                          className="flex items-center gap-3 text-xs"
                        >
                          <span className="w-16 text-muted-foreground">
                            {k2}
                          </span>

                          <div className="h-px flex-1 bg-border">
                            <div
                              className="bg-gold h-px transition-all duration-1000"
                              style={{
                                width:
                                  off === 0
                                    ? `${v}%`
                                    : "0%",
                              }}
                            />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </TiltCard>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() =>
            setI((i - 1 + n) % n)
          }
          aria-label="Previous"
          className="border border-border p-3 transition hover:border-primary hover:text-primary"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onReserve}
          className="eyebrow text-primary underline-offset-8 hover:underline"
        >
          Taste it tonight
        </button>

        <button
          type="button"
          onClick={() =>
            setI((i + 1) % n)
          }
          aria-label="Next"
          className="border border-border p-3 transition hover:border-primary hover:text-primary"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

const PRESS = [
  [
    "“The most thrilling fire cookery in the country.”",
    "The Gastronome",
  ],
  [
    "“A masterclass in restraint and smoke.”",
    "Epicure Monthly",
  ],
  [
    "“Dinner as theatre — without a false note.”",
    "The City Times",
  ],
];

const REVIEWS = [
  {
    n: "Isabelle R.",
    t: "The chef's counter was pure magic. The tomahawk, carved tableside, is something I'll dream about.",
    o: "Anniversary",
  },
  {
    n: "James K.",
    t: "Impeccable service, a sommelier who actually listened, and a chocolate dome worth the trip alone.",
    o: "Business dinner",
  },
  {
    n: "Priya S.",
    t: "They accommodated my vegan partner with a tasting menu every bit as considered as mine.",
    o: "Birthday",
  },
];

const GALLERY = [
  heroImg,
  0,
  farmImg,
  3,
  chefImg,
  1,
  4,
  2,
] as const;

export function SocialProof() {
  const [lb, setLb] = useState<number | null>(null);
  const [likes, setLikes] = useState<number[]>([]);

  const renderTile = (
    g: (typeof GALLERY)[number],
    cls = "",
  ) =>
    typeof g === "number" ? (
      <div
        className={`h-full w-full ${cls}`}
        style={cropStyle(g, dishesImg)}
      />
    ) : (
      <img
        src={g}
        alt="Gallery"
        loading="lazy"
        className={`h-full w-full object-cover ${cls}`}
      />
    );

  return (
    <section className="mx-auto max-w-7xl px-5 py-28">
      <div className="reveal grid gap-8 border-y border-border py-12 md:grid-cols-3">
        {PRESS.map(([q, s]) => (
          <div key={s} className="text-center">
            <p className="font-display text-xl italic text-foreground/90">
              {q}
            </p>

            <p className="eyebrow mt-4 text-primary">
              {s}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {REVIEWS.map((r) => (
          <div
            key={r.n}
            className="reveal border border-border bg-card p-8 transition duration-500 hover:-translate-y-1 hover:border-primary/60"
          >
            <Quote className="h-6 w-6 text-primary" />

            <div className="mt-4 flex gap-1">
              {Array.from({ length: 5 }).map(
                (_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-primary text-primary"
                  />
                ),
              )}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-foreground/80">
              {r.t}
            </p>

            <p className="mt-6 font-display text-lg">
              {r.n}
            </p>

            <p className="eyebrow text-[10px] text-muted-foreground">
              {r.o}
            </p>
          </div>
        ))}
      </div>

      <div className="reveal mt-24 flex items-end justify-between">
        <div>
          <p className="eyebrow text-primary">
            @emberandoak
          </p>

          <h3 className="mt-2 font-serif text-3xl tracking-widest">
            From Our Table
          </h3>
        </div>

        <Instagram className="h-6 w-6 text-primary" />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-4">
        {GALLERY.map((g, k) => (
          <button
            key={k}
            type="button"
            onClick={() => setLb(k)}
            className="group relative aspect-square overflow-hidden"
          >
            {renderTile(
              g,
              "transition duration-700 group-hover:scale-110",
            )}

            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/60 opacity-0 transition group-hover:opacity-100">
              <Heart
                className={`h-5 w-5 ${
                  likes.includes(k)
                    ? "fill-primary text-primary"
                    : ""
                }`}
              />

              <span className="text-sm">
                {1200 +
                  k * 137 +
                  (likes.includes(k) ? 1 : 0)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {lb !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-6 backdrop-blur-md animate-fade-in"
          onClick={() => setLb(null)}
        >
          <div
            className="relative aspect-square w-full max-w-xl border border-border"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {renderTile(GALLERY[lb]!)}

            <div className="glass absolute bottom-0 flex w-full items-center justify-between p-4">
              <button
                type="button"
                onClick={() =>
                  setLikes(
                    likes.includes(lb)
                      ? likes.filter(
                          (x) => x !== lb,
                        )
                      : [...likes, lb],
                  )
                }
                className="flex items-center gap-2 text-sm"
              >
                <Heart
                  className={`h-5 w-5 ${
                    likes.includes(lb)
                      ? "fill-primary text-primary"
                      : ""
                  }`}
                />
                Like
              </button>

              <span className="font-script text-2xl text-champagne">
                #emberandoak
              </span>
            </div>

            <button
              type="button"
              onClick={() => setLb(null)}
              className="absolute -top-10 right-0"
              aria-label="Close"
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export function Visit() {
  const [sent, setSent] = useState(false);

  const input =
    "w-full border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none";

  const handleEventSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(
      formData.get("name") ?? "",
    ).trim();

    const email = String(
      formData.get("email") ?? "",
    ).trim();

    const message = String(
      formData.get("message") ?? "",
    ).trim();

    if (!name || !email) {
      toast(
        "Please enter your name and email.",
      );
      return;
    }

    try {
      await createEventInquiry({
        name,
        email,
        message,
      });

      setSent(true);

      toast("Inquiry sent successfully.");

      form.reset();
    } catch (error) {
      console.error(
        "Event inquiry submission failed:",
        error,
      );

      toast(
        "Could not send your inquiry. Please try again.",
      );
    }
  };

  return (
    <section
      id="visit"
      className="mx-auto max-w-7xl px-5 py-28"
    >
      <div className="reveal mb-12 text-center">
        <p className="eyebrow text-primary">
          Visit
        </p>

        <h2 className="mt-4 font-serif text-4xl tracking-[0.08em] md:text-6xl">
          <span className="text-gold">
            Location &amp; Events
          </span>
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="reveal relative min-h-[420px] overflow-hidden border border-border">
          <iframe
            title="Map"
            className="absolute inset-0 h-full w-full grayscale invert-[.92] contrast-[.9]"
            loading="lazy"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-74.012%2C40.716%2C-73.996%2C40.726&layer=mapnik&marker=40.721%2C-74.004"
          />

          <div className="glass absolute bottom-4 left-4 right-4 p-5">
            <p className="font-display text-xl">
              88 Ember Lane, Tribeca, New York
            </p>

            <a
              href="https://maps.google.com/?q=Tribeca+New+York"
              target="_blank"
              rel="noreferrer"
              className="eyebrow mt-2 inline-block text-primary"
            >
              Get Directions →
            </a>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            [
              Clock,
              "Hours",
              "Tue–Sun · 17:30–23:30\nBar until 01:00 · Closed Mon",
            ],
            [
              Car,
              "Valet",
              "Complimentary valet from 17:00 at the Ember Lane entrance.",
            ],
            [
              Shirt,
              "Dress Code",
              "Elegant attire. Jackets preferred for gentlemen; no sportswear.",
            ],
            [
              Phone,
              "Contact",
              "+1 (212) 555-0188\nconcierge@emberandoak.com",
            ],
          ].map(([I, t, d]) => {
            const Icon = I as typeof Clock;

            return (
              <div
                key={t as string}
                className="reveal border border-border bg-card p-6 transition hover:border-primary/60"
              >
                <Icon className="h-5 w-5 text-primary" />

                <p className="eyebrow mt-4">
                  {t as string}
                </p>

                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                  {d as string}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="reveal mt-6 grid gap-10 border border-border bg-card p-8 md:grid-cols-5 md:p-12">
        <div className="md:col-span-2">
          <p className="eyebrow text-primary">
            Private Events
          </p>

          <h3 className="mt-3 font-serif text-3xl tracking-widest">
            The Cellar Room
          </h3>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Up to 14 seated or 40 standing, surrounded by
            3,000 bottles. Bespoke menus, a dedicated
            sommelier, and total discretion.
          </p>

          <p className="mt-6 font-script text-3xl text-champagne">
            evenings worth remembering
          </p>
        </div>

        {sent ? (
          <div className="flex items-center justify-center md:col-span-3">
            <p className="font-display text-2xl">
              Thank you — our events director will be in
              touch within 24 hours.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleEventSubmit}
            className="grid gap-3 sm:grid-cols-2 md:col-span-3"
          >
            <input
              required
              name="name"
              className={input}
              placeholder="Name *"
            />

            <input
              required
              name="email"
              type="email"
              className={input}
              placeholder="Email *"
            />

            <input
              name="event_date"
              type="date"
              className={input}
            />

            <input
              name="guests"
              type="number"
              min={2}
              className={input}
              placeholder="Guests"
            />

            <select
              name="event_type"
              className={`${input} sm:col-span-2`}
              defaultValue=""
            >
              <option value="" disabled>
                Event type
              </option>

              <option>
                Corporate dinner
              </option>

              <option>
                Wedding rehearsal
              </option>

              <option>
                Private celebration
              </option>

              <option>
                Wine tasting
              </option>
            </select>

            <textarea
              name="message"
              rows={3}
              className={`${input} sm:col-span-2`}
              placeholder="Tell us about your evening"
            />

            <button
              type="submit"
              className="eyebrow bg-gold py-4 text-primary-foreground sm:col-span-2"
            >
              Send Inquiry
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  const handleNewsletterSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const cleanEmail = email.trim();

    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      toast("Please enter a valid email");
      return;
    }

    try {
      setSubmitting(true);

      await subscribeToNewsletter(cleanEmail);

      toast("Welcome to the Inner Circle");

      setEmail("");
    } catch (error: unknown) {
      console.error(
        "Newsletter subscription failed:",
        error,
      );

      const supabaseError = error as {
        code?: string;
      };

      if (supabaseError?.code === "23505") {
        toast(
          "This email is already subscribed.",
        );
      } else {
        toast(
          "Could not subscribe right now. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-4xl px-5 py-24 text-center">
        <p className="eyebrow text-primary">
          VIP Club
        </p>

        <h3 className="mt-4 font-serif text-3xl tracking-widest md:text-5xl">
          <span className="text-gold">
            The Inner Circle
          </span>
        </h3>

        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
          Priority reservations, cellar releases and
          invitations to our seasonal chef&apos;s table
          evenings.
        </p>

        <form
          onSubmit={handleNewsletterSubmit}
          className="mx-auto mt-8 flex max-w-md border border-primary/50 focus-within:border-primary"
        >
          <input
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            type="email"
            required
            placeholder="Your email address"
            className="flex-1 bg-transparent px-5 py-4 text-sm focus:outline-none"
          />

          <button
            type="submit"
            disabled={submitting}
            className="eyebrow bg-gold px-6 text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Joining..."
              : "Join"}
          </button>
        </form>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-xs text-muted-foreground md:flex-row">
          <p className="font-serif text-lg tracking-[0.3em] text-foreground">
            EMBER{" "}
            <span className="text-primary">
              &amp;
            </span>{" "}
            OAK
          </p>

          <p className="eyebrow text-[10px]">
            88 Ember Lane · New York · Est. 2019
          </p>

          <p>
            © 2026 Ember &amp; Oak. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}