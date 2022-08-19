export const fetchPage = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};
