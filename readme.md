# React in shadow DOM example

Dealing with react apps inside shadow DOM I have encountered some unevident issues, so I decided to share this synthetic example. It mostly implements ideas from this article (I highly recommend to read): https://medium.com/rate-engineering/winning-the-war-of-css-conflicts-through-the-shadow-dom-de6c797b5cba

## What is happenning here:

1. We need to create shadow root. So we create an util (`see utils/shadow.js`) that makes it, returns link to shadow root for modern browsers and a link to node itself for Microsoft browsers (https://caniuse.com/#feat=shadowdomv1):

```js
if (node.shadowRoot == null && node.attachShadow != null) {
  node.attachShadow({ mode: 'open' });
}

return node.shadowRoot != null ? node.shadowRoot : node;
```

2. We render our sample react app into it, at the first glance everything works fine (see `src/index.js`)

3. Fun begins when we try to add CSS. `style-loader` have got `insertInto` option (https://github.com/webpack-contrib/style-loader#insertinto) that recieves a function, allowing to insert styles into the shadow (see `webpack.config` css section).

4. To add css to shadow root, it should be created before style-loader starts processing first css file (see article above) OR we can create root on the fly if it doesn't exist yet. Second approach seems more explicit to me (first one hides unevident behaviour behind lines order). So we need a function that checks shadow root existance, creates it if it doesn't exist and returns link to it or fallback for IE's. But that is exactly what our `util/shadow` function does! All we need is to add one extra check in it.

5. So we just import it in our webpack config. First thing we see is `Unknown token import` error, so we have to enable imports in `webpack.config`. It's not well-known feature, but we can just rename `webpack.config.js` to `webpack.config.babel.js` (don't forget to add `@babel/register`). We will also have to remove `modules: false` line from our `.babelrc`. (Another approach is loading via `esm`, if you choose that, make sure your shadow util is written in es5 or somehow passes through babel, it will get into production code as is).

6. Note that we can place different babel configs in different directiories (if we'll need different babel settings for `webpack.config` and project code). See https://babeljs.io/docs/en/config-files for details.

7. We are done with CSS, but when we try to add first event handler we find that React events do not fire inside our shadow! Sooner or later it will be fixed, but for now we stuck with it: https://github.com/facebook/react/issues/9242. So we have to attach handlers manually (see `src/App/index.js`) or try solutions from discussion above: https://www.npmjs.com/package/react-shadow-dom-retarget-events

## Usage

```bash
npm i
npm start
```

## Notes

Some alternave approaches:

https://itnext.io/a-little-web-component-in-my-react-3c66a918ea99

https://www.npmjs.com/package/react-shadow-root

https://www.npmjs.com/package/react-shadow
