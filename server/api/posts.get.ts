const parseCoordinate = (coordinate: string) => {
  const [latRaw, lonRaw] = coordinate.split(",").map((value) => value.trim());
  const lat = Number(latRaw);
  const lon = Number(lonRaw);
  return { lat, lon };
};

export default defineEventHandler(async () => {
  const posts = await prisma.posts.findMany({
    orderBy: { createdAt: "desc" },
  });

  return posts.map((post) => {
    const { lat, lon } = parseCoordinate(post.coordinate);
    return {
      id: String(post.id),
      name: post.name,
      address: post.address,
      description: post.description,
      user: post.user,
      pickupTime: post.pickupTime,
      station: post.station,
      stamp: post.stamp,
      zipcode: post.zipcode,
      status: post.status,
      format: post.format,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      lat,
      lon,
    };
  });
});
