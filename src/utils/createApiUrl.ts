export const createApiUrl = (url: string) => {
  if (!url) return;

  let title = null;

  // Parse Url
  // Reference:
  // 1. https://www.mediawiki.org/wiki/Manual:Short_URL
  // 2. https://www.mediawiki.org/wiki/API:Main_page
  // Credit: https://gist.github.com/jlong/2428561
  const parser = document.createElement("a");
  parser.href = url;

  /*
    "http://example.com:3000/pathname/?search=test#hash"
    parser.protocol; // => "http:"
    parser.hostname; // => "example.com"
    parser.port;     // => "3000"
    parser.pathname; // => "/pathname/"
    parser.search;   // => "?search=test"
    parser.hash;     // => "#hash"
    parser.host;     // => "example.com:3000"

   */

  var matchTitle;
  var apiInRoot = false;
  if (/^\/w\/index\.php\/.+$/.test(parser.pathname)) {
    // 1. http://example.org/w/index.php/Page_title (recent versions of MediaWiki, without CGI support)
    // -> parser.pathname: /w/index.php/Page_title
    matchTitle = parser.pathname.match(/^\/w\/index\.php\/([^&\#]+).*$/);
  } else if (parser.pathname === "/w/index.php") {
    // 2. http://example.org/w/index.php?title=Page_title (recent versions of MediaWiki, with CGI support)
    // -> parser.search: ?title=Wikip%C3%A9dia:Rapports/Nombre_de_pages_par_namespace&action=view
    // -> parser.pathname: /w/index.php
    matchTitle = parser.search.match(/^\?title\=([^&\#]+).*$/);
  } else if (/^\/[a-z_-]+\/[^&\#]+.*$/.test(parser.pathname)) {
    // 3. http://example.org/wiki/Page_title This is the most common configuration, same as in Wikipedia, though not the default because it requires server side modifications
    // 4. http://example.org/view/Page_title
    // -> parser.pathname: /wiki/Lists_of_earthquakes
    // -> short url must begin with lowercase letter after first slash
    matchTitle = parser.pathname.match(/^\/[a-z_-]+\/([^&\#]+).*$/);
  } else if (/^\/.+$/.test(parser.pathname)) {
    // 5. http://example.org/Page_title (not recommended!)
    // --> parser.pathname: /Page_title
    matchTitle = parser.pathname.match(/^\/(.+)$/);
    apiInRoot = true;
  } else {
    return false;
  }

  if (matchTitle === null) {
    return false;
  }

  title = matchTitle[1];

  const apiSlug = apiInRoot ? "" : "w/";
  const queryUrl = `${parser.protocol}//${parser.host}/${apiSlug}api.php?action=parse&format=json&origin=*&page=${title}&prop=text`;

  return queryUrl;
};
