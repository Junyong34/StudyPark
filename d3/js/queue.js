var Queue = (function() {

    // initialise the queue and offset
    var queue = [];
    var offset = 0;

    /**
     * Returns the length of the queue.
     *
     * @returns {number}
     */
    this.getLength = function () {

        // return the length of the queue
        return (queue.length - offset);

    };


    /**
     * Returns true if the queue is empty, and false otherwise.
     *
     * @returns {boolean}
     */
    this.isEmpty = function () {

        // return whether the queue is empty
        return (queue.length == 0);

    };

    /**
     * Adds the specified item. The parameter is:
     *
     * @param item
     */
    this.add = function (item) {
        return queue.push(item);
    };

    /**
     * Gets an item and returns it. If the queue is empty then undefined is
     * returned.
     *
     * @returns {*}
     */
    this.get = function () {

        // if the queue is empty, return undefined
        if (queue.length == 0) return undefined;

        // store the item at the front of the queue
        var item = queue[offset];

        // increment the offset and remove the free space if necessary
        if (++offset * 2 >= queue.length) {
            queue = queue.slice(offset);
            offset = 0;
        }

        return item;

    };


    /**
     * Returns the item at the front of the queue (without dequeuing it). If the
     * queue is empty then undefined is returned.
     *
     * @returns {*}
     */
    this.peek = function () {

        // return the item at the front of the queue
        return (queue.length > 0 ? queue[offset] : undefined);

    };

});
