export type CarFormValues = {
  slug: string;
  name: string;
  category: string;
  seats: number;
  bags: string;
  transmission: string;
  fuel: string;
  mileage: string;
  pricePerDay: number;
  city: string;
  featured: boolean;
  active: boolean;
  imageUrl: string;
};

export type CarFieldErrors = Partial<Record<keyof CarFormValues, string>>;

type ValidationResult =
  | { ok: true; data: CarFormValues }
  | { ok: false; errors: CarFieldErrors };

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toBool(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function toInt(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? Math.trunc(value) : NaN;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.trunc(parsed) : NaN;
  }
  return NaN;
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function isValidImageUrl(value: string) {
  if (!value) return true;
  if (value.startsWith("/")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getEmptyCarForm(): CarFormValues {
  return {
    slug: "",
    name: "",
    category: "Standard",
    seats: 5,
    bags: "1 Large bag",
    transmission: "Manual",
    fuel: "Petrol",
    mileage: "Unlimited mileage",
    pricePerDay: 300,
    city: "Casablanca",
    featured: false,
    active: true,
    imageUrl: "",
  };
}

export function validateCarInput(raw: unknown): ValidationResult {
  const body = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const data: CarFormValues = {
    slug: normalizeSlug(toText(body.slug)),
    name: toText(body.name),
    category: toText(body.category),
    seats: toInt(body.seats),
    bags: toText(body.bags),
    transmission: toText(body.transmission),
    fuel: toText(body.fuel),
    mileage: toText(body.mileage),
    pricePerDay: toInt(body.pricePerDay),
    city: toText(body.city),
    featured: toBool(body.featured, false),
    active: toBool(body.active, true),
    imageUrl: toText(body.imageUrl),
  };

  const errors: CarFieldErrors = {};

  if (!data.slug) errors.slug = "Slug is required.";
  else if (!slugPattern.test(data.slug)) errors.slug = "Use lowercase letters, numbers, and hyphens only.";

  if (!data.name) errors.name = "Name is required.";
  if (!data.category) errors.category = "Category is required.";
  if (!Number.isInteger(data.seats) || data.seats < 1 || data.seats > 12) errors.seats = "Seats must be between 1 and 12.";
  if (!data.bags) errors.bags = "Bag allowance is required.";
  if (!data.transmission) errors.transmission = "Transmission is required.";
  if (!data.fuel) errors.fuel = "Fuel type is required.";
  if (!data.mileage) errors.mileage = "Mileage policy is required.";
  if (!Number.isInteger(data.pricePerDay) || data.pricePerDay < 0) errors.pricePerDay = "Price per day must be 0 or more.";
  if (!data.city) errors.city = "City is required.";
  if (!isValidImageUrl(data.imageUrl)) errors.imageUrl = "Use an absolute URL or a local /uploads path.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return { ok: true, data };
}

export function formatCarValidationError(errors: CarFieldErrors) {
  const firstError = Object.values(errors)[0];
  return firstError || "Please review the highlighted fields.";
}
