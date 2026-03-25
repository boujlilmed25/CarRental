"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "../_ui/AdminShell";
import {
  formatCarValidationError,
  getEmptyCarForm,
  validateCarInput,
  type CarFieldErrors,
  type CarFormValues,
} from "@/lib/carAdminValidation";

type Car = CarFormValues & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

type Notice = {
  tone: "success" | "error" | "info";
  text: string;
} | null;

type FilterValue = "all" | "active" | "hidden";
type FeaturedFilterValue = "all" | "featured" | "standard";

const emptyCar = getEmptyCarForm();

export default function AdminCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<Notice>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CarFormValues>(emptyCar);
  const [fieldErrors, setFieldErrors] = useState<CarFieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterValue>("all");
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilterValue>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const selectedCar = useMemo(
    () => cars.find((car) => car.id === selectedId) ?? null,
    [cars, selectedId],
  );

  const categoryOptions = useMemo(() => {
    const categories = new Set(cars.map((car) => car.category).filter(Boolean));
    return ["all", ...Array.from(categories).sort((a, b) => a.localeCompare(b))];
  }, [cars]);

  const filteredCars = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return cars
      .filter((car) => {
        if (needle) {
          const searchable = `${car.name} ${car.slug} ${car.city}`.toLowerCase();
          if (!searchable.includes(needle)) return false;
        }

        if (statusFilter === "active" && !car.active) return false;
        if (statusFilter === "hidden" && car.active) return false;
        if (featuredFilter === "featured" && !car.featured) return false;
        if (featuredFilter === "standard" && car.featured) return false;
        if (categoryFilter !== "all" && car.category !== categoryFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (a.active !== b.active) return a.active ? -1 : 1;
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }, [cars, categoryFilter, featuredFilter, query, statusFilter]);

  const stats = useMemo(() => {
    const active = cars.filter((car) => car.active).length;
    const featured = cars.filter((car) => car.featured).length;
    return {
      total: cars.length,
      active,
      hidden: cars.length - active,
      featured,
    };
  }, [cars]);

  useEffect(() => {
    void loadCars();
  }, []);

  async function loadCars() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/cars", { cache: "no-store" });
      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        setNotice({ tone: "error", text: payload?.error || "Unable to load cars." });
        setCars([]);
        return;
      }

      setCars(Array.isArray(payload.cars) ? payload.cars : []);
    } catch {
      setNotice({ tone: "error", text: "Unable to load cars." });
      setCars([]);
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setMode("create");
    setSelectedId(null);
    setDraft(getEmptyCarForm());
    setFieldErrors({});
    setNotice(null);
  }

  function startEdit(car: Car) {
    setMode("edit");
    setSelectedId(car.id);
    setDraft(toFormValues(car));
    setFieldErrors({});
    setNotice(null);
  }

  function updateDraft<K extends keyof CarFormValues>(key: K, value: CarFormValues[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);

    const parsed = validateCarInput(draft);
    if (!parsed.ok) {
      setFieldErrors(parsed.errors);
      setNotice({ tone: "error", text: formatCarValidationError(parsed.errors) });
      return;
    }

    const isEditing = mode === "edit" && selectedId;
    const endpoint = isEditing ? `/api/admin/cars/${selectedId}` : "/api/admin/cars";
    const method = isEditing ? "PATCH" : "POST";

    setSaving(true);

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        const nextErrors = (payload?.fieldErrors ?? {}) as CarFieldErrors;
        if (Object.keys(nextErrors).length > 0) setFieldErrors(nextErrors);
        setNotice({ tone: "error", text: payload?.error || "Unable to save car." });
        return;
      }

      await loadCars();

      if (isEditing) {
        const savedCar = payload?.car as Car | undefined;
        if (savedCar) {
          setDraft(toFormValues(savedCar));
          setSelectedId(savedCar.id);
        }
        setFieldErrors({});
        setNotice({ tone: "success", text: "Car updated." });
      } else {
        startCreate();
        setNotice({ tone: "success", text: "Car created." });
      }
    } catch {
      setNotice({ tone: "error", text: "Unable to save car." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(car: Car) {
    if (!window.confirm(`Delete ${car.name}?`)) return;

    setNotice(null);

    try {
      const res = await fetch(`/api/admin/cars/${car.id}`, { method: "DELETE" });
      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        setNotice({ tone: "error", text: payload?.error || "Unable to delete car." });
        return;
      }

      if (selectedId === car.id) startCreate();
      await loadCars();
      setNotice({ tone: "success", text: "Car deleted." });
    } catch {
      setNotice({ tone: "error", text: "Unable to delete car." });
    }
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setNotice({ tone: "info", text: "Uploading image..." });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const payload = await res.json().catch(() => ({}));

      if (!res.ok || !payload?.url) {
        setNotice({ tone: "error", text: payload?.error || "Upload failed." });
        return;
      }

      updateDraft("imageUrl", payload.url);
      setNotice({ tone: "success", text: "Image uploaded." });
    } catch {
      setNotice({ tone: "error", text: "Upload failed." });
    } finally {
      setUploading(false);
    }
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Cars</h1>
            <p className="mt-1 text-sm text-white/70">
              Manage fleet visibility, pricing, and listing quality from one place.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Add new car
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total fleet" value={stats.total} />
          <StatCard label="Active listings" value={stats.active} />
          <StatCard label="Featured cars" value={stats.featured} />
          <StatCard label="Hidden cars" value={stats.hidden} />
        </div>

        {notice ? <NoticeBanner notice={notice} /> : null}

        <div className="grid gap-6 xl:grid-cols-[420px,minmax(0,1fr)]">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm xl:sticky xl:top-24 xl:self-start">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">
                  {mode === "edit" ? "Edit car" : "Create car"}
                </div>
                <div className="mt-1 text-xs text-white/60">
                  {mode === "edit" && selectedCar
                    ? `Updating ${selectedCar.name}`
                    : "Add a polished, ready-to-book fleet listing."}
                </div>
              </div>
              {mode === "edit" ? (
                <button
                  type="button"
                  onClick={startCreate}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10"
                >
                  Cancel edit
                </button>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <ImagePreview imageUrl={draft.imageUrl} name={draft.name} />

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <Field
                  label="Name"
                  value={draft.name}
                  onChange={(value) => {
                    updateDraft("name", value);
                    if (mode === "create" && !draft.slug.trim()) {
                      updateDraft("slug", slugify(value));
                    }
                  }}
                  placeholder="Dacia Sandero"
                  error={fieldErrors.name}
                />
                <Field
                  label="Slug"
                  value={draft.slug}
                  onChange={(value) => updateDraft("slug", slugify(value))}
                  placeholder="dacia-sandero"
                  error={fieldErrors.slug}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <Field
                  label="City"
                  value={draft.city}
                  onChange={(value) => updateDraft("city", value)}
                  placeholder="Casablanca"
                  error={fieldErrors.city}
                />
                <Field
                  label="Category"
                  value={draft.category}
                  onChange={(value) => updateDraft("category", value)}
                  placeholder="Economy"
                  error={fieldErrors.category}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <Field
                  label="Seats"
                  type="number"
                  min={1}
                  max={12}
                  value={String(draft.seats)}
                  onChange={(value) => updateDraft("seats", value === "" ? 0 : Number(value))}
                  error={fieldErrors.seats}
                />
                <Field
                  label="Price / day (MAD)"
                  type="number"
                  min={0}
                  value={String(draft.pricePerDay)}
                  onChange={(value) => updateDraft("pricePerDay", value === "" ? 0 : Number(value))}
                  error={fieldErrors.pricePerDay}
                />
              </div>

              <Field
                label="Bags"
                value={draft.bags}
                onChange={(value) => updateDraft("bags", value)}
                placeholder="2 large bags"
                error={fieldErrors.bags}
              />

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <Field
                  label="Transmission"
                  value={draft.transmission}
                  onChange={(value) => updateDraft("transmission", value)}
                  placeholder="Manual"
                  error={fieldErrors.transmission}
                />
                <Field
                  label="Fuel"
                  value={draft.fuel}
                  onChange={(value) => updateDraft("fuel", value)}
                  placeholder="Diesel"
                  error={fieldErrors.fuel}
                />
              </div>

              <Field
                label="Mileage"
                value={draft.mileage}
                onChange={(value) => updateDraft("mileage", value)}
                placeholder="Unlimited mileage"
                error={fieldErrors.mileage}
              />

              <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <Field
                  label="Image URL"
                  value={draft.imageUrl}
                  onChange={(value) => updateDraft("imageUrl", value)}
                  placeholder="https://... or /uploads/..."
                  error={fieldErrors.imageUrl}
                />
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void handleImageUpload(file);
                        event.currentTarget.value = "";
                      }}
                    />
                    {uploading ? "Uploading..." : "Upload image"}
                  </label>
                  {draft.imageUrl ? (
                    <a
                      href={draft.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-200 transition hover:text-emerald-100"
                    >
                      Open preview
                    </a>
                  ) : null}
                </div>
                <p className="text-xs text-white/50">
                  Local uploads stay usable for admin previews. For production hosting, keep a stable CDN URL when available.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <ToggleCard
                  label="Featured"
                  description="Highlight this car in key fleet sections."
                  checked={draft.featured}
                  onChange={(value) => updateDraft("featured", value)}
                />
                <ToggleCard
                  label="Active"
                  description="Hidden cars stay in admin but do not show publicly."
                  checked={draft.active}
                  onChange={(value) => updateDraft("active", value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : mode === "edit" ? "Save changes" : "Create car"}
                </button>
                {mode === "edit" ? (
                  <button
                    type="button"
                    onClick={() => selectedCar && setDraft(toFormValues(selectedCar))}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10"
                  >
                    Reset changes
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">Fleet manager</h2>
                  <p className="mt-1 text-xs text-white/60">
                    Search and filter by listing status to make quick pricing or visibility updates.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60">
                  {filteredCars.length} of {cars.length} cars
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr),repeat(3,minmax(0,0.7fr))]">
                <SearchField value={query} onChange={setQuery} />
                <SelectField
                  label="Status"
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value as FilterValue)}
                  options={[
                    { value: "all", label: "All statuses" },
                    { value: "active", label: "Active only" },
                    { value: "hidden", label: "Hidden only" },
                  ]}
                />
                <SelectField
                  label="Featured"
                  value={featuredFilter}
                  onChange={(value) => setFeaturedFilter(value as FeaturedFilterValue)}
                  options={[
                    { value: "all", label: "All cars" },
                    { value: "featured", label: "Featured only" },
                    { value: "standard", label: "Non-featured" },
                  ]}
                />
                <SelectField
                  label="Category"
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  options={categoryOptions.map((value) => ({
                    value,
                    label: value === "all" ? "All categories" : value,
                  }))}
                />
              </div>
            </div>

            {loading ? (
              <div className="py-10 text-sm text-white/70">Loading cars...</div>
            ) : filteredCars.length === 0 ? (
              <div className="py-10 text-sm text-white/60">
                No cars match the current search or filters.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {filteredCars.map((car) => (
                  <article
                    key={car.id}
                    className={`rounded-2xl border p-4 transition ${
                      selectedId === car.id
                        ? "border-emerald-400/50 bg-emerald-500/10"
                        : "border-white/10 bg-black/20 hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex min-w-0 gap-4">
                        <div className="h-24 w-28 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                          {car.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={car.imageUrl}
                              alt={car.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-2xl text-white/30">
                              🚗
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 space-y-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-semibold text-white">{car.name}</h3>
                              <Badge tone={car.active ? "green" : "neutral"}>
                                {car.active ? "Active" : "Hidden"}
                              </Badge>
                              {car.featured ? <Badge tone="gold">Featured</Badge> : null}
                            </div>
                            <p className="mt-1 text-xs text-white/50">/{car.slug}</p>
                          </div>

                          <div className="flex flex-wrap gap-2 text-xs text-white/70">
                            <MetaPill>{car.city}</MetaPill>
                            <MetaPill>{car.category}</MetaPill>
                            <MetaPill>{car.seats} seats</MetaPill>
                            <MetaPill>{car.transmission}</MetaPill>
                            <MetaPill>{car.fuel}</MetaPill>
                            <MetaPill>{car.bags}</MetaPill>
                            <MetaPill>{car.mileage}</MetaPill>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <div className="text-left md:text-right">
                          <div className="text-xs uppercase tracking-[0.18em] text-white/40">Daily rate</div>
                          <div className="mt-1 text-2xl font-semibold text-white">MAD {car.pricePerDay}</div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(car)}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(car)}
                            className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-200 transition hover:bg-red-500/15"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminShell>
  );
}

function toFormValues(car: Car): CarFormValues {
  return {
    slug: car.slug,
    name: car.name,
    category: car.category,
    seats: car.seats,
    bags: car.bags,
    transmission: car.transmission,
    fuel: car.fuel,
    mileage: car.mileage,
    pricePerDay: car.pricePerDay,
    city: car.city,
    featured: car.featured,
    active: car.active,
    imageUrl: car.imageUrl || "",
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="text-xs uppercase tracking-[0.18em] text-white/45">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function NoticeBanner({ notice }: { notice: NonNullable<Notice> }) {
  const toneClass =
    notice.tone === "success"
      ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
      : notice.tone === "error"
        ? "border-red-400/20 bg-red-500/10 text-red-100"
        : "border-white/10 bg-white/5 text-white/80";

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClass}`}>{notice.text}</div>;
}

function SearchField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] text-white/55">Search</div>
      <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-3">
        <span className="mr-2 text-sm text-white/40">⌕</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Name, slug, or city"
          className="w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-white/30"
        />
      </div>
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: "text" | "number";
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] text-white/55">{label}</div>
      <input
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-white/10 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 ${
          error ? "border-red-400/40" : "border-white/10 focus:border-white/20"
        }`}
      />
      {error ? <div className="mt-1 text-xs text-red-200">{error}</div> : null}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] text-white/55">{label}</div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-900">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleCard({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
      <div>
        <div className="font-medium text-white">{label}</div>
        <div className="mt-1 text-xs text-white/55">{description}</div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 accent-emerald-400"
      />
    </label>
  );
}

function ImagePreview({ imageUrl, name }: { imageUrl: string; name: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
      <div className="aspect-[16/9] w-full bg-white/5">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name || "Car preview"} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-white/25">🚘</div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-white/55">
        <span>{imageUrl ? "Preview ready" : "No image selected yet"}</span>
        {imageUrl ? <span className="truncate">{imageUrl}</span> : null}
      </div>
    </div>
  );
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "green" | "gold" | "neutral";
}) {
  const toneClass =
    tone === "green"
      ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
      : tone === "gold"
        ? "border-amber-400/20 bg-amber-500/10 text-amber-100"
        : "border-white/10 bg-white/5 text-white/70";

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClass}`}>
      {children}
    </span>
  );
}

function MetaPill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{children}</span>;
}
