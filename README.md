## Before&After

Before&After is a simple Javascript library to create the beautiful sliding effect of two images (It's mobile compatible).
It has no dependency and is style-free.

### Usage

Include the script in your page:

```html
<script type="text/javascript" src="before-after.min.js"></script>
```

Then create the container with:

```js
    new beforeAfter({
        'elId'     : 'div-id-on-the-dom',
        'before'   : 'path/to/yourimage-before.jpg',
        'after'    : 'path/to/yourimage-after.jpg'
    });
```

You can also create a container simply with:

```html
    <div data-before-after>
        <img src="path/to/yourimage-before.jpg">
        <img src="path/to/yourimage-after.jpg">
    </div>
```

## To do

- Write tests
- Add some options for style
