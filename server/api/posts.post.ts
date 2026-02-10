import { randomUUID } from "node:crypto";
import { gcj02ToWgs84 } from "~~/server/utils/coordinateConverter";
import { sendVerificationEmail } from "~~/server/utils/email";

const toOptionalString = (value: unknown) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const name = toOptionalString(body?.name);
  const address = toOptionalString(body?.address);
  const description = toOptionalString(body?.description);
  const email = toOptionalString(body?.email);
  const user = email || "anonymous";
  const pickupTime = toOptionalString(body?.pickupTime);
  const station = toOptionalString(body?.station);
  const stamp = toOptionalString(body?.stamp);

  const lat = Number(body?.lat);
  const lon = Number(body?.lon);
  const zipcode = Number(body?.zipcode);
  const status = Number.isFinite(Number(body?.status))
    ? Number(body?.status)
    : 0;
  const format = Number.isFinite(Number(body?.format))
    ? Number(body?.format)
    : 0;

  if (!name || !address || !description) {
    throw createError({
      statusCode: 400,
      statusMessage: "name, address, and description are required",
    });
  }

  if (!email || !isValidEmail(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: "email must be a valid address",
    });
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw createError({
      statusCode: 400,
      statusMessage: "lat and lon must be valid numbers",
    });
  }

  if (!Number.isFinite(zipcode)) {
    throw createError({
      statusCode: 400,
      statusMessage: "zipcode must be a valid number",
    });
  }

  const verificationToken = randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  const [normalizedLat, normalizedLon] = gcj02ToWgs84(lat, lon);

  await prisma.pendingPosts.create({
    data: {
      name,
      coordinate: `${normalizedLat},${normalizedLon}`,
      address,
      description,
      user,
      pickupTime,
      station,
      stamp,
      zipcode,
      status,
      format,
      verificationToken,
      expiresAt,
    },
  });

  await sendVerificationEmail({
    to: email,
    token: verificationToken,
    name,
  });

  return { message: "Verification email sent." };
});
