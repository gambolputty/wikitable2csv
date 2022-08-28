export type CreateApiUrlResponse = {
  title: string;
  queryUrl: string;
};

/**
 * Transform the URL of a MediaWiki page to an API query URL.
 * URL schemes: https://www.mediawiki.org/wiki/Manual:Short_URL
 * @param {string} url A Wiki page URL, e.g. https://en.wikipedia.org/wiki/Lists_of_earthquakes
 * @returns {{title: string, queryUrl: string}} The title of the Wiki page and the MediaWiki API query URL
 */
export const createApiUrl = (url: string): CreateApiUrlResponse => {
  let title = "";
  let queryUrl = "";
  let matchTitle;
  let apiInRoot = false;

  const parser = document.createElement("a"); // Credits: https://gist.github.com/jlong/2428561
  parser.href = url;

  if (/^\/w\/index\.php\/.+$/.test(parser.pathname)) {
    // 1. http://example.org/w/index.php/Page_title (recent versions of MediaWiki, without CGI support)
    // -> parser.pathname: /w/index.php/Page_title
    matchTitle = parser.pathname.match(/^\/w\/index\.php\/([^&#]+).*$/);
  } else if (parser.pathname === "/w/index.php") {
    // 2. http://example.org/w/index.php?title=Page_title (recent versions of MediaWiki, with CGI support)
    // -> parser.search: ?title=Wikip%C3%A9dia:Rapports/Nombre_de_pages_par_namespace&action=view
    // -> parser.pathname: /w/index.php
    matchTitle = parser.search.match(/^\?title=([^&#]+).*$/);
  } else if (/^\/[a-z_-]+\/[^&#]+.*$/.test(parser.pathname)) {
    // 3. http://example.org/wiki/Page_title This is the most common configuration, same as in Wikipedia, though not the default because it requires server side modifications
    // 4. http://example.org/view/Page_title
    // -> parser.pathname: /wiki/Lists_of_earthquakes
    // -> short url must begin with lowercase letter after first slash
    matchTitle = parser.pathname.match(/^\/[a-z_-]+\/([^&#]+).*$/);
  } else if (/^\/.+$/.test(parser.pathname)) {
    // 5. http://example.org/Page_title (not recommended)
    // --> parser.pathname: /Page_title
    matchTitle = parser.pathname.match(/^\/(.+)$/);
    apiInRoot = true;
  }

  if (matchTitle) {
    title = matchTitle[1];
    const apiSlug = apiInRoot ? "" : "w/";
    queryUrl = `${parser.protocol}//${parser.host}/${apiSlug}api.php?action=parse&redirects=true&format=json&errorformat=plaintext&origin=*&page=${title}&prop=text`;
  }

  return {
    title,
    queryUrl,
  };
};
