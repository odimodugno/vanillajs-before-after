(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define([], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(root);
    } else {
        root.beforeAfter = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {

    'use strict';

    var supports = !!document.querySelector && !!root.addEventListener;
    var settings;

    var defaults = {
        elId: 'before-after',
        before: '',
        after: '',
        callbackBefore: function () {},
        callbackAfter: function () {}
    };

    /**
     * A simple forEach() implementation for Arrays, Objects and NodeLists
     * @private
     * @param {Array|Object|NodeList} collection Collection of items to iterate
     * @param {Function} callback Callback function for each iteration
     * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
     */
    var forEach = function (collection, callback, scope) {
        if (Object.prototype.toString.call(collection) === '[object Object]') {
            for (var prop in collection) {
                if (Object.prototype.hasOwnProperty.call(collection, prop)) {
                    callback.call(scope, collection[prop], prop, collection);
                }
            }
        } else {
            for (var i = 0, len = collection.length; i < len; i++) {
                callback.call(scope, collection[i], i, collection);
            }
        }
    };

    /**
     * Merge defaults with user options
     * @private
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */
    var extend = function ( defaults, options ) {
        var extended = {};
        forEach(defaults, function (value, prop) {
            extended[prop] = defaults[prop];
        });
        forEach(options, function (value, prop) {
            extended[prop] = options[prop];
        });
        return extended;
    };

    /**
     * Handle events
     * @private
     */
    var eventHandler = function (e) {
        settings.callbackBefore;

        var target = e.target;
        var x;
        var container = target.parentNode.parentNode;

        x = e.pageX - container.offsetLeft;

        if (e.type == 'touchmove') {
            x = e.touches[0].pageX - container.offsetLeft;
        }

        if (x <= parseInt(container.style.width)) {
            container.getElementsByTagName('div')[0].style.width = x + 'px';
        }

        settings.callbackAfter;
    };

    var createBeforeAndAfterDiv = function(beforeImg, afterImg) {
        var beforeDiv = document.createElement("div");
        var afterDiv = document.createElement("div");

        beforeDiv.classList.add('before-image');
        beforeDiv.style.position = 'relative';
        beforeDiv.style.overflow = 'hidden';
        beforeDiv.style['z-index'] = 2;
        beforeDiv.style['border-right'] = '3px solid #000';
        beforeDiv.style.width = '50%';

        afterDiv.classList.add('after-image');
        afterDiv.style.position = 'absolute';
        afterDiv.style.left = '0px';
        afterDiv.style.top = '0px';
        afterDiv.style['z-index'] = 1;

        beforeDiv.appendChild(beforeImg);
        afterDiv.appendChild(afterImg);

        return [beforeDiv, afterDiv];
    }

    var createImages = function(beforeImgSrc, afterImgSrc) {
        var beforeImg = new Image();
        var afterImg = new Image();

        beforeImg.src = beforeImgSrc;
        afterImg.src = afterImgSrc;

        return [beforeImg, afterImg];
    };

    /**
     * Initialize Plugin
     * @public
     * @param {Object} options User settings
     */
    var beforeAfter = function ( options ) {
        if ( !supports ) return;

        var divs, container, images;

        settings = extend( defaults, options || {} );
        container = document.getElementById(settings.elId);

        container.style.cursor = 'col-resize';
        container.style.position = 'relative';

        if (settings.before == '' || settings.after == '') {
            console.error('Images for the container #'+ settings.elId + ' were not specified');

            return false;
        }

        if (typeof(settings.before) == 'object') {
            images = [settings.before, settings.after];
            container.style.width = settings.before.width + 'px';
        } else {
            images = createImages(settings.before, settings.after);

            images[0].onload = function() {
                container.style.width = this.width + 'px';
            };

            container.appendChild(images[0]);
            container.appendChild(images[1]);
        }

        divs = createBeforeAndAfterDiv(images[0], images[1]);

        container.appendChild(divs[0]);
        container.appendChild(divs[1]);

        container.addEventListener('mouseover', eventHandler, false);
        container.addEventListener('mousemove', eventHandler, false);
        container.addEventListener('touchmove', eventHandler, false);
    };

    window.onload = function() {
        forEach (document.querySelectorAll('[data-before-after]'), function(element) {
            if (!element.getElementsByTagName('img').length > 2) {
                return;
            }

            var container = element;

            container.setAttribute('id', Math.floor(Math.random()*11));

            var beforeImg = element.getElementsByTagName('img')[0];
            var afterImg = element.getElementsByTagName('img')[1];

            beforeAfter({
                'elId' : container.getAttribute('id'),
                'before' : beforeImg,
                'after' : afterImg
            });
        });
    };

    return beforeAfter;
});
