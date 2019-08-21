## Image Max URL

Image Max URL is a program that will try to find larger/original versions of images, usually by replacing URL patterns.
It currently contains support for >5000 hardcoded websites (full list in [sites.txt](https://github.com/qsniyg/maxurl/blob/master/sites.txt)),
but it also supports a number of generic engines (such as Wordpress and MediaWiki), which means it can work for many other websites as well.

It is currently released as:

 * [Userscript](https://greasyfork.org/en/scripts/36662-image-max-url) (most browsers)
   * [userscript.user.js](https://github.com/qsniyg/maxurl/blob/master/userscript.user.js) is also the base for everything listed below
   * It also serves as a node module (used by the reddit bot), and can be embedded in a website
 * [Firefox Addon](https://addons.mozilla.org/en-US/firefox/addon/image-max-url/) (Firefox Quantum-based browsers only, other browsers supporting WebExtensions can sideload this extension through this git repository)
   * Since addons have more privileges than userscripts, it has a bit of extra functionality over the userscript
   * Source code is in [manifest.json](https://github.com/qsniyg/maxurl/blob/master/manifest.json) and the [extension](https://github.com/qsniyg/maxurl/tree/master/extension) folder
 * [Website](https://qsniyg.github.io/maxurl/)
   * Due to browser security constraints, some URLs (requiring cross-origin requests) can't be supported by the website
   * Source code is in the [gh-pages](https://github.com/qsniyg/maxurl/tree/gh-pages) branch
 * Reddit bot ([/u/MaxImageBot](https://www.reddit.com/user/MaxImageBot/))
   * Source code is in [bot.js](https://github.com/qsniyg/maxurl/blob/master/bot.js)

### For developers

The userscript also functions as a node module.

    var maximage = require('./userscript.user.js');

    maximage(smallimage, {
      // If set to false, it will return only the URL if there aren't any special properties
      fill_object: true,

      // Maximum amount of times it should be run.
      //  Recommended to be at least 5
      iterations: 200,

      // Whether or not to store to, and use an internal cache
      use_cache: true,

      // Helper function to perform HTTP requests, used for sites like Flickr
      //  The API is expected to be like GM_xmlHTTPRequest's API.
      do_request: function(options) {
        // options = {
        //   url: "",
        //   method: "GET",
        //   headers: {}, // If a header is null or "", don't include that header
        //   onload: function(resp) {
        //     // resp is expected to be XMLHttpRequest-like object, implementing these fields:
        //     //   finalUrl
        //     //   readyState
        //     //   responseText
        //     //   status
        //   }
        // }
      },

      // Callback
      cb: function(result) {
        if (!result)
          return;

        if (result.length === 1 && result[0].url === smallimage) {
           // No larger image was found
           return;
        }

        for (var i = 0; i < result.length; i++) {
          // Do something with the object
        }
      }
    });

The result is a list of objects that contain properties that may be useful in using the returned image(s):

    {
      // Array or String, see code example above
      url: null,

      // Whether it's expected that it will always work or not.
      //  Don't rely on this value if you don't have to
      always_ok: false,

      // Whether or not the server supports a HEAD request.
      can_head: true,

      // Whether or not the server might return the wrong Content-Type header in the HEAD request
      head_wrong_contenttype: false,

      // Whether or not the server might return the wrong Content-Length header in the HEAD request
      head_wrong_contentlength: false,

      // This is used in the return value of the exported function.
      //  If you're using a callback (as shown in the code example above),
      /   this value will always be false
      waiting: false,

      // Whether or not the returned URL is expected to redirect to another URL
      redirects: false,

      // Whether or not this URL should be used
      bad: false,

      // Headers required to view the returned URL
      //  If a header is null, don't include that header.
      headers: {}
    }
