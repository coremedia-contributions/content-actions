const { jangarooConfig } = require("@jangaroo/core");

module.exports = jangarooConfig({
  type: "code",
  sencha: {
    name: "com.coremedia.blueprint__content-actions",
    namespace: "com.coremedia.blueprint.c12s.studio",
    css: [
      {
        path: "resources/css/content-actions-ui.css",
        bundle: false,
        includeInBundle: false,
      },
    ],
    studioPlugins: [
      {
        mainClass: "com.coremedia.blueprint.c12s.studio.ContentActionsPlugin",
        name: "Studio Content Actions Menu",
      },
    ],
  },
});
