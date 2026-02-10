const toOptionalString = (value: unknown) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

export default defineEventHandler(async (event) => {
  const idParam = event.context.params?.id;
  const id = Number(idParam);

  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid post id" });
  }

  const body = await readBody(event);

  const name = toOptionalString(body?.name);
  const address = toOptionalString(body?.address);
  const description = toOptionalString(body?.description);
  const user = toOptionalString(body?.user);
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

  const post = await prisma.posts.update({
    where: { id },
    data: {
      name,
      coordinate: `${lat},${lon}`,
      address,
      description,
      user,
      pickupTime,
      station,
      stamp,
      zipcode,
      status,
      format,
    },
  });

  return {
    id: String(post.id),
    updatedAt: post.updatedAt,
  };
});
