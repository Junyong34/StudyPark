/**
 * Augments `target` object with getter/setter functions, which modify settings
 *
 * @example
 *  var target = {};
 *  exposeProperties({ age: 42}, target);
 *  target.age(); // returns 42
 *  target.age(24); // make age 24;
 *
 *  var filteredTarget = {};
 *  exposeProperties({ age: 42, name: 'John'}, filteredTarget, ['name']);
 *  filteredTarget.name(); // returns 'John'
 *  filteredTarget.age === undefined; // true
 */

/* eslint-disable */
function exposeProperties(settings, target, filter) {
    const needsFilter = Object.prototype.toString.call(filter) === "[object Array]";

    if (needsFilter) {
        for (let i = 0; i < filter.length; ++i) {
            augment(settings, target, filter[i]);
        }
    } else {
        for (const key in settings) {
            augment(settings, target, key);
        }
    }
}

function augment(source, target, key) {
    if (source.hasOwnProperty(key)) {
        if (typeof target[key] === "function") {
            // this accessor is already defined. Ignore it
            return;
        }
        target[key] = function (value) {
            if (value !== undefined) {
                source[key] = value;
                return target;
            }
            return source[key];
        };
    }
}

// reference : ngraph.events
const Events = function (subject) {
    validateSubject(subject);
    const eventsStorage = createEventsStorage(subject);

    subject.on = eventsStorage.on;
    subject.off = eventsStorage.off;
    subject.fire = eventsStorage.fire;
    return subject;
};

function validateSubject(subject) {
    if (!subject) {
        throw new Error("Eventify cannot use falsy object as events subject");
    }
    const reservedWords = ["on", "fire", "off"];

    for (let i = 0; i < reservedWords.length; ++i) {
        if (subject.hasOwnProperty(reservedWords[i])) {
            throw new Error(`Subject cannot be eventified, since it already has property '${reservedWords[i]}'`);
        }
    }
}

function createEventsStorage(subject) {
    // Store all event listeners to this hash. Key is event name, value is array
    // of callback records.
    //
    // A callback record consists of callback function and its optional context:
    // { 'eventName' => [{callback: function, ctx: object}] }
    let registeredEvents = Object.create(null);

    return {
        on(eventName, callback, ctx) {
            if (typeof callback !== "function") {
                throw new Error("callback is expected to be a function");
            }
            let handlers = registeredEvents[eventName];

            if (!handlers) {
                handlers = registeredEvents[eventName] = [];
            }
            handlers.push({callback, ctx});

            return subject;
        },

        off(eventName, callback) {
            const wantToRemoveAll = (typeof eventName === "undefined");

            if (wantToRemoveAll) {
                // Killing old events storage should be enough in this case:
                registeredEvents = Object.create(null);
                return subject;
            }

            if (registeredEvents[eventName]) {
                const deleteAllCallbacksForEvent = (typeof callback !== "function");

                if (deleteAllCallbacksForEvent) {
                    delete registeredEvents[eventName];
                } else {
                    const callbacks = registeredEvents[eventName];

                    for (let i = 0; i < callbacks.length; ++i) {
                        if (callbacks[i].callback === callback) {
                            callbacks.splice(i, 1);
                        }
                    }
                }
            }

            return subject;
        },

        fire(eventName) {
            const callbacks = registeredEvents[eventName];

            if (!callbacks) {
                return subject;
            }

            let fireArguments;

            if (arguments.length > 1) {
                fireArguments = Array.prototype.splice.call(arguments, 1);
            }
            for (let i = 0; i < callbacks.length; ++i) {
                const callbackInfo = callbacks[i];

                callbackInfo.callback.apply(callbackInfo.ctx, fireArguments);
            }

            return subject;
        },
    };
}

/**
 * Internal structure to represent node;
 */
function Node(id, data) {
    this.id = id;
    this.links = null;
    this.data = data;
}

function addLinkToNode(node, link) {
    if (node.links) {
        node.links.push(link);
    } else {
        node.links = [link];
    }
}

/**
 * Internal structure to represent links;
 */
function Link(fromId, toId, data, id) {
    // this.fromId = fromId;
    this.source = fromId;
    // this.toId = toId;
    this.target = toId;
    this.data = data;
    this.id = id;
}

function hashCode(str) {
    let hash = 0;

    let i;
    let chr;
    let
        len;

    if (str.length == 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function makeLinkId(fromId, toId) {
    return `${fromId.toString()}?몛 ${toId.toString()}`;
}

export function Graph(options) {
    // Graph structure is maintained as dictionary of nodes
    // and array of links. Each node has 'links' property which
    // hold all links related to that node. And general links
    // array is used to speed up all links enumeration. This is inefficient
    // in terms of memory, but simplifies coding.
    options = options || {};

    // Dear reader, the non-multigraphs do not guarantee that there is only
    // one link for a given pair of node. When this option is set to false
    // we can save some memory and CPU (18% faster for non-multigraph);
    if (options.multigraph === undefined) options.multigraph = false;

    const nodes = typeof Object.create === "function" ? Object.create(null) : {};


    const links = [];

    // Hash of multi-edges. Used to track ids of edges between same nodes

    const multiEdges = {};


    let nodesCount = 0;


    let suspendEvents = 0;


    const forEachNode = createNodeIterator();


    const createLink = options.multigraph ? createUniqueLink : createSingleLink;


    // Our graph API provides means to listen to graph changes. Users can subscribe
    // to be notified about changes in the graph by using `on` method. However
    // in some cases they don't use it. To avoid unnecessary memory consumption
    // we will not record graph changes until we have at least one subscriber.
    // Code below supports this optimization.
    //
    // Accumulates all changes made during graph updates.
    // Each change element contains:
    //  changeType - one of the strings: 'add', 'remove' or 'update';
    //  node - if change is related to node this property is set to changed graph's node;
    //  link - if change is related to link this property is set to changed graph's link;

    const changes = [];


    let recordLinkChange = noop;


    let recordNodeChange = noop;


    let enterModification = noop;


    let exitModification = noop;

    // this is our public API:
    const graphPart = {
        /**
         * Adds node to the graph. If node with given id already exists in the graph
         * its data is extended with whatever comes in 'data' argument.
         *
         * @param nodeId the node's identifier. A string or number is preferred.
         * @param [data] additional data for the node being added. If node already
         *   exists its data object is augmented with the new one.
         *
         * @return {node} The newly added node or node with given id if it already exists.
         */
        addNode,

        /**
         * Adds a link to the graph. The function always create a new
         * link between two nodes. If one of the nodes does not exists
         * a new node is created.
         *
         * @param fromId link start node id;
         * @param toId link end node id;
         * @param [data] additional data to be set on the new link;
         *
         * @return {link} The newly created link
         */
        addLink,

        /**
         * Removes link from the graph. If link does not exist does nothing.
         *
         * @param link - object returned by addLink() or getLinks() methods.
         *
         * @returns true if link was removed; false otherwise.
         */
        removeLink,

        /**
         * Removes node with given id from the graph. If node does not exist in the graph
         * does nothing.
         *
         * @param nodeId node's identifier passed to addNode() function.
         *
         * @returns true if node was removed; false otherwise.
         */
        removeNode,

        /**
         * Gets node with given identifier. If node does not exist undefined value is returned.
         *
         * @param nodeId requested node identifier;
         *
         * @return {node} in with requested identifier or undefined if no such node exists.
         */
        getNode,

        /**
         * Gets number of nodes in this graph.
         *
         * @return number of nodes in the graph.
         */
        getNodesCount() {
            return nodesCount;
        },

        /**
         * Gets total number of links in the graph.
         */
        getLinksCount() {
            return links.length;
        },

        /**
         * Gets all links (inbound and outbound) from the node with given id.
         * If node with given id is not found null is returned.
         *
         * @param nodeId requested node identifier.
         *
         * @return Array of links from and to requested node if such node exists;
         *   otherwise null is returned.
         */
        getLinks,

        /**
         * Invokes callback on each node of the graph.
         *
         * @param {Function(node)} callback Function to be invoked. The function
         *   is passed one argument: visited node.
         */
        forEachNode,

        /**
         * Invokes callback on every linked (adjacent) node to the given one.
         *
         * @param nodeId Identifier of the requested node.
         * @param {Function(node, link)} callback Function to be called on all linked nodes.
         *   The function is passed two parameters: adjacent node and link object itself.
         * @param oriented if true graph treated as oriented.
         */
        forEachLinkedNode,

        /**
         * Enumerates all links in the graph
         *
         * @param {Function(link)} callback Function to be called on all links in the graph.
         *   The function is passed one parameter: graph's link object.
         *
         * Link object contains at least the following fields:
         *  fromId - node id where link starts;
         *  toId - node id where link ends,
         *  data - additional data passed to graph.addLink() method.
         */
        forEachLink,

        /**
         * Suspend all notifications about graph changes until
         * endUpdate is called.
         */
        beginUpdate: enterModification,

        /**
         * Resumes all notifications about graph changes and fires
         * graph 'changed' event in case there are any pending changes.
         */
        endUpdate: exitModification,

        /**
         * Removes all nodes and links from the graph.
         */
        clear,

        /**
         * Detects whether there is a link between two nodes.
         * Operation complexity is O(n) where n - number of links of a node.
         * NOTE: this function is synonim for getLink()
         *
         * @returns link if there is one. null otherwise.
         */
        hasLink: getLink,

        /**
         * Detects whether there is a node with given id
         *
         * Operation complexity is O(1)
         * NOTE: this function is synonim for getNode()
         *
         * @returns node if there is one; Falsy value otherwise.
         */
        hasNode: getNode,

        /**
         * Gets an edge between two nodes.
         * Operation complexity is O(n) where n - number of links of a node.
         *
         * @param {string} fromId link start identifier
         * @param {string} toId link end identifier
         *
         * @returns link if there is one. null otherwise.
         */
        getLink,
    };

    // this will add `on()` and `fire()` methods.
    Events(graphPart);

    monitorSubscribers();

    return graphPart;

    function monitorSubscribers() {
        const realOn = graphPart.on;

        // replace real `on` with our temporary on, which will trigger change
        // modification monitoring:
        graphPart.on = on;

        function on() {
            // now it's time to start tracking stuff:
            graphPart.beginUpdate = enterModification = enterModificationReal;
            graphPart.endUpdate = exitModification = exitModificationReal;
            recordLinkChange = recordLinkChangeReal;
            recordNodeChange = recordNodeChangeReal;

            // this will replace current `on` method with real pub/sub from `eventify`.
            graphPart.on = realOn;
            // delegate to real `on` handler:
            return realOn.apply(graphPart, arguments);
        }
    }

    function recordLinkChangeReal(link, changeType) {
        changes.push({
            link,
            changeType,
        });
    }

    function recordNodeChangeReal(node, changeType) {
        changes.push({
            node,
            changeType,
        });
    }

    function addNode(nodeId, data) {
        if (nodeId === undefined) {
            throw new Error("Invalid node identifier");
        }

        enterModification();

        let node = getNode(nodeId);

        if (!node) {
            node = new Node(nodeId, data);
            nodesCount++;
            recordNodeChange(node, "add");
        } else {
            node.data = data;
            recordNodeChange(node, "update");
        }

        nodes[nodeId] = node;

        exitModification();
        return node;
    }

    function getNode(nodeId) {
        return nodes[nodeId];
    }

    function removeNode(nodeId) {
        const node = getNode(nodeId);

        if (!node) {
            return false;
        }

        enterModification();

        const prevLinks = node.links;

        if (prevLinks) {
            node.links = null;
            for (let i = 0; i < prevLinks.length; ++i) {
                removeLink(prevLinks[i]);
            }
        }

        delete nodes[nodeId];
        nodesCount--;

        recordNodeChange(node, "remove");

        exitModification();

        return true;
    }


    function addLink(fromId, toId, data) {
        enterModification();

        const fromNode = getNode(fromId) || addNode(fromId);
        const toNode = getNode(toId) || addNode(toId);

        const link = createLink(fromId, toId, data);

        links.push(link);

        // TODO: this is not cool. On large graphs potentially would consume more memory.
        addLinkToNode(fromNode, link);
        if (fromId !== toId) {
            // make sure we are not duplicating links for self-loops
            addLinkToNode(toNode, link);
        }

        recordLinkChange(link, "add");

        exitModification();

        return link;
    }

    function createSingleLink(fromId, toId, data) {
        const linkId = makeLinkId(fromId, toId);

        return new Link(fromId, toId, data, linkId);
    }

    function createUniqueLink(fromId, toId, data) {
        // TODO: Get rid of this method.
        let linkId = makeLinkId(fromId, toId);
        const isMultiEdge = multiEdges.hasOwnProperty(linkId);

        if (isMultiEdge || getLink(fromId, toId)) {
            if (!isMultiEdge) {
                multiEdges[linkId] = 0;
            }
            const suffix = `@${++multiEdges[linkId]}`;

            linkId = makeLinkId(fromId + suffix, toId + suffix);
        }

        return new Link(fromId, toId, data, linkId);
    }

    function getLinks(nodeId) {
        const node = getNode(nodeId);

        return node ? node.links : null;
    }

    function removeLink(link) {
        if (!link) {
            return false;
        }
        let idx = indexOfElementInArray(link, links);

        if (idx < 0) {
            return false;
        }

        enterModification();

        links.splice(idx, 1);

        const fromNode = getNode(link.source);
        const toNode = getNode(link.target);

        if (fromNode) {
            idx = indexOfElementInArray(link, fromNode.links);
            if (idx >= 0) {
                fromNode.links.splice(idx, 1);
            }
        }

        if (toNode) {
            idx = indexOfElementInArray(link, toNode.links);
            if (idx >= 0) {
                toNode.links.splice(idx, 1);
            }
        }

        recordLinkChange(link, "remove");

        exitModification();

        return true;
    }

    function getLink(fromNodeId, toNodeId) {
        // TODO: Use sorted links to speed this up
        const node = getNode(fromNodeId);


        let i;

        if (!node || !node.links) {
            return null;
        }

        for (i = 0; i < node.links.length; ++i) {
            const link = node.links[i];

            if (link.source === fromNodeId && link.target === toNodeId) {
                return link;
            }
        }

        return null; // no link.
    }

    function clear() {
        enterModification();
        forEachNode(node => {
            removeNode(node.id);
        });
        exitModification();
    }

    function forEachLink(callback) {
        let i;

        let length;

        if (typeof callback === "function") {
            for (i = 0, length = links.length; i < length; ++i) {
                callback(links[i]);
            }
        }
    }

    function forEachLinkedNode(nodeId, callback, oriented) {
        const node = getNode(nodeId);

        if (node && node.links && typeof callback === "function") {
            if (oriented) {
                return forEachOrientedLink(node.links, nodeId, callback);
            } else {
                return forEachNonOrientedLink(node.links, nodeId, callback);
            }
        }
    }

    function forEachNonOrientedLink(links, nodeId, callback) {
        let quitFast;

        for (let i = 0; i < links.length; ++i) {
            const link = links[i];
            const linkedNodeId = link.source === nodeId ? link.target : link.source;

            quitFast = callback(nodes[linkedNodeId], link);
            if (quitFast) {
                return true; // Client does not need more iterations. Break now.
            }
        }
    }

    function forEachOrientedLink(links, nodeId, callback) {
        let quitFast;

        for (let i = 0; i < links.length; ++i) {
            const link = links[i];

            if (link.source === nodeId) {
                quitFast = callback(nodes[link.target], link);
                if (quitFast) {
                    return true; // Client does not need more iterations. Break now.
                }
            }
        }
    }

    // we will not fire anything until users of this library explicitly call `on()`
    // method.
    function noop() {
    }

    // Enter, Exit modification allows bulk graph updates without firing events.
    function enterModificationReal() {
        suspendEvents += 1;
    }

    function exitModificationReal() {
        suspendEvents -= 1;
        if (suspendEvents === 0 && changes.length > 0) {
            graphPart.fire("changed", changes);
            changes.length = 0;
        }
    }

    function createNodeIterator() {
        // Object.keys iterator is 1.3x faster than `for in` loop.
        // See `https://github.com/anvaka/ngraph.graph/tree/bench-for-in-vs-obj-keys`
        // branch for perf test
        return Object.keys ? objectKeysIterator : forInIterator;
    }

    function objectKeysIterator(callback) {
        if (typeof callback !== "function") {
            return;
        }

        const keys = Object.keys(nodes);

        for (let i = 0; i < keys.length; ++i) {
            if (callback(nodes[keys[i]])) {
                return true; // client doesn't want to proceed. Return.
            }
        }
    }

    function forInIterator(callback) {
        if (typeof callback !== "function") {
            return;
        }
        let node;

        for (node in nodes) {
            if (callback(nodes[node])) {
                return true; // client doesn't want to proceed. Return.
            }
        }
    }
}

// need this for old browsers. Should this be a separate module?
function indexOfElementInArray(element, array) {
    if (!array) return -1;

    if (array.indexOf) {
        return array.indexOf(element);
    }

    const len = array.length;


    let i;

    for (i = 0; i < len; i += 1) {
        if (array[i] === element) {
            return i;
        }
    }
    return -1;
}

/**
 * Creates seeded PRNG with two methods:
 *   next() and nextDouble()
 */
function Random(inputSeed) {
    let seed = typeof inputSeed === "number" ? inputSeed : (+new Date());
    const randomFunc = function () {
        // Robert Jenkins' 32 bit integer hash function.
        seed = ((seed + 0x7ed55d16) + (seed << 12)) & 0xffffffff;
        seed = ((seed ^ 0xc761c23c) ^ (seed >>> 19)) & 0xffffffff;
        seed = ((seed + 0x165667b1) + (seed << 5)) & 0xffffffff;
        seed = ((seed + 0xd3a2646c) ^ (seed << 9)) & 0xffffffff;
        seed = ((seed + 0xfd7046c5) + (seed << 3)) & 0xffffffff;
        seed = ((seed ^ 0xb55a4f09) ^ (seed >>> 16)) & 0xffffffff;
        return (seed & 0xfffffff) / 0x10000000;
    };

    return {
        /**
         * Generates random integer number in the range from 0 (inclusive) to maxValue (exclusive)
         *
         * @param maxValue Number REQUIRED. Ommitting this number will result in NaN values from PRNG.
         */
        next(maxValue) {
            return Math.floor(randomFunc() * maxValue);
        },

        /**
         * Generates random double number in the range from 0 (inclusive) to 1 (exclusive)
         * This function is the same as Math.random() (except that it could be seeded)
         */
        nextDouble() {
            return randomFunc();
        },
    };
}

/*
 * Creates iterator over array, which returns items of array in random order
 * Time complexity is guaranteed to be O(n);
 */
function randomIterator(array, customRandom) {
    const localRandom = customRandom || random();

    if (typeof localRandom.next !== "function") {
        throw new Error("customRandom does not match expected API: next() function is missing");
    }

    return {
        forEach(callback) {
            let i;

            let j;
            let
                t;

            for (i = array.length - 1; i > 0; --i) {
                j = localRandom.next(i + 1); // i inclusive
                t = array[j];
                array[j] = array[i];
                array[i] = t;

                callback(t);
            }

            if (array.length) {
                callback(array[0]);
            }
        },

        /**
         * Shuffles array randomly, in place.
         */
        shuffle() {
            let i;

            let j;
            let
                t;

            for (i = array.length - 1; i > 0; --i) {
                j = localRandom.next(i + 1); // i inclusive
                t = array[j];
                array[j] = array[i];
                array[i] = t;
            }
            return array;
        },
    };
}

/**
 * Augments `target` with properties in `options`. Does not override
 * target's properties if they are defined and matches expected type in
 * options
 *
 * @returns {Object} merged object
 */
function merge(target, options) {
    let key;

    if (!target) {
        target = {};
    }
    if (options) {
        for (key in options) {
            if (options.hasOwnProperty(key)) {
                const targetHasIt = target.hasOwnProperty(key);


                const optionsValueType = typeof options[key];


                const shouldReplace = !targetHasIt || (typeof target[key] !== optionsValueType);

                if (shouldReplace) {
                    target[key] = options[key];
                } else if (optionsValueType === "object") {
                    // go deep, don't care about loops here, we are simple API!:
                    target[key] = merge(target[key], options[key]);
                }
            }
        }
    }
    return target;
}

/**
 * Internal data structure to represent 2D QuadTree node
 */
const QuadTreeNode = function () {
    // body stored inside this node. In quad tree only leaf nodes (by construction)
    // contain boides:
    this.body = null;

    // Child nodes are stored in quads. Each quad is presented by number:
    // 0 | 1
    // -----
    // 2 | 3
    this.quad0 = null;
    this.quad1 = null;
    this.quad2 = null;
    this.quad3 = null;

    // Total mass of current node
    this.mass = 0;

    // Center of mass coordinates
    this.massX = 0;
    this.massY = 0;

    // bounding box coordinates
    this.left = 0;
    this.top = 0;
    this.bottom = 0;
    this.right = 0;
};

const InsertStackElement = function (node, body) {
    this.node = node; // QuadTree node
    this.body = body; // physical body which needs to be inserted to node
};

/**
 * Our implmentation of QuadTree is non-recursive to avoid GC hit
 * This data structure represent stack of elements
 * which we are trying to insert into quad tree.
 */
const InsertStack = function () {
    this.stack = [];
    this.popIdx = 0;
};

InsertStack.prototype = {
    isEmpty() {
        return this.popIdx === 0;
    },
    push(node, body) {
        const item = this.stack[this.popIdx];

        if (!item) {
            // we are trying to avoid memory pressue: create new element
            // only when absolutely necessary
            this.stack[this.popIdx] = new InsertStackElement(node, body);
        } else {
            item.node = node;
            item.body = body;
        }
        ++this.popIdx;
    },
    pop() {
        if (this.popIdx > 0) {
            return this.stack[--this.popIdx];
        }
    },
    reset() {
        this.popIdx = 0;
    },
};

function isSamePosition(point1, point2) {
    const dx = Math.abs(point1.x - point2.x);
    const dy = Math.abs(point1.y - point2.y);

    return (dx < 1e-8 && dy < 1e-8);
}

const QuadTree = function (options) {
    options = options || {};
    options.gravity = typeof options.gravity === "number" ? options.gravity : -1;
    options.theta = typeof options.theta === "number" ? options.theta : 0.8;

    this.gravity = options.gravity;
    this.theta = options.theta;

    this.randomApi = Random(2001);
    this.updateQueue = [];
    this.insertStack = new InsertStack();

    this.nodesCache = [];
    this.currentInCache = 0;
    this.root = this.newNode();
};

function getChild(node, idx) {
    if (idx === 0) return node.quad0;
    if (idx === 1) return node.quad1;
    if (idx === 2) return node.quad2;
    if (idx === 3) return node.quad3;
    return null;
}

function setChild(node, idx, child) {
    if (idx === 0) node.quad0 = child;
    else if (idx === 1) node.quad1 = child;
    else if (idx === 2) node.quad2 = child;
    else if (idx === 3) node.quad3 = child;
}

QuadTree.prototype.getRoot = function () {
    return this.root;
};

QuadTree.prototype.options = function (newOptions) {
    if (newOptions) {
        if (typeof newOptions.gravity === "number") {
            this.gravity = newOptions.gravity;
        }
        if (typeof newOptions.theta === "number") {
            this.theta = newOptions.theta;
        }
        return this;
    }
    return {
        gravity: this.gravity,
        theta: this.theta,
    };
};

QuadTree.prototype.newNode = function () {
    // To avoid pressure on GC we reuse nodes.
    let node = this.nodesCache[this.currentInCache];

    if (node) {
        node.quad0 = null;
        node.quad1 = null;
        node.quad2 = null;
        node.quad3 = null;
        node.body = null;
        node.mass = node.massX = node.massY = 0;
        node.left = node.right = node.top = node.bottom = 0;
    } else {
        node = new QuadTreeNode();
        this.nodesCache[this.currentInCache] = node;
    }
    this.currentInCache++;
    return node;
};

QuadTree.prototype.updateBodyForce = function (sourceBody) {
    const queue = this.updateQueue;


    let v;


    let dx;


    let dy;


    let r;
    let fx = 0;


    let fy = 0;


    let queueLength = 1;


    let shiftIdx = 0;


    let pushIdx = 1;

    queue[0] = this.root;

    while (queueLength) {
        const node = queue[shiftIdx];


        const body = node.body;

        queueLength -= 1;
        shiftIdx += 1;
        const differentBody = (body !== sourceBody);

        if (body && differentBody) {
            // If the current node is a leaf node (and it is not source body),
            // calculate the force exerted by the current node on body, and add this
            // amount to body's net force.
            dx = body.pos.x - sourceBody.pos.x;
            dy = body.pos.y - sourceBody.pos.y;
            r = Math.sqrt(dx * dx + dy * dy);

            if (r === 0) {
                // Poor man's protection against zero distance.
                dx = (this.randomApi.nextDouble() - 0.5) / 50;
                dy = (this.randomApi.nextDouble() - 0.5) / 50;
                r = Math.sqrt(dx * dx + dy * dy);
            }

            // This is standard gravition force calculation but we divide
            // by r^3 to save two operations when normalizing force vector.
            v = this.gravity * body.mass * sourceBody.mass / (r * r * r);
            fx += v * dx;
            fy += v * dy;
        } else if (differentBody) {
            // Otherwise, calculate the ratio s / r,  where s is the width of the region
            // represented by the internal node, and r is the distance between the body
            // and the node's center-of-mass
            dx = node.massX / node.mass - sourceBody.pos.x;
            dy = node.massY / node.mass - sourceBody.pos.y;
            r = Math.sqrt(dx * dx + dy * dy);

            if (r === 0) {
                // Sorry about code duplucation. I don't want to create many functions
                // right away. Just want to see performance first.
                dx = (this.randomApi.nextDouble() - 0.5) / 50;
                dy = (this.randomApi.nextDouble() - 0.5) / 50;
                r = Math.sqrt(dx * dx + dy * dy);
            }
            // If s / r < 罐, treat this internal node as a single body, and calculate the
            // force it exerts on sourceBody, and add this amount to sourceBody's net force.
            if ((node.right - node.left) / r < this.theta) {
                // in the if statement above we consider node's width only
                // because the region was squarified during tree creation.
                // Thus there is no difference between using width or height.
                v = this.gravity * node.mass * sourceBody.mass / (r * r * r);
                fx += v * dx;
                fy += v * dy;
            } else {
                // Otherwise, run the procedure recursively on each of the current node's children.

                // I intentionally unfolded this loop, to save several CPU cycles.
                if (node.quad0) {
                    queue[pushIdx] = node.quad0;
                    queueLength += 1;
                    pushIdx += 1;
                }
                if (node.quad1) {
                    queue[pushIdx] = node.quad1;
                    queueLength += 1;
                    pushIdx += 1;
                }
                if (node.quad2) {
                    queue[pushIdx] = node.quad2;
                    queueLength += 1;
                    pushIdx += 1;
                }
                if (node.quad3) {
                    queue[pushIdx] = node.quad3;
                    queueLength += 1;
                    pushIdx += 1;
                }
            }
        }
    }
    sourceBody.force.x += fx;
    sourceBody.force.y += fy;
};

QuadTree.prototype.insertBodies = function (bodies) {
    let x1 = Number.MAX_VALUE;


    let y1 = Number.MAX_VALUE;


    let x2 = Number.MIN_VALUE;


    let y2 = Number.MIN_VALUE;


    let i;


    const max = bodies.length;

    // To reduce quad tree depth we are looking for exact bounding box of all particles.
    i = max;
    while (i--) {
        const x = bodies[i].pos.x;
        const y = bodies[i].pos.y;

        if (x < x1) {
            x1 = x;
        }
        if (x > x2) {
            x2 = x;
        }
        if (y < y1) {
            y1 = y;
        }
        if (y > y2) {
            y2 = y;
        }
    }

    // Squarify the bounds.
    const dx = x2 - x1;


    const dy = y2 - y1;

    if (dx > dy) {
        y2 = y1 + dx;
    } else {
        x2 = x1 + dy;
    }

    this.currentInCache = 0;
    this.root = this.newNode();
    this.root.left = x1;
    this.root.right = x2;
    this.root.top = y1;
    this.root.bottom = y2;

    i = max - 1;
    if (i >= 0) {
        this.root.body = bodies[i];
    }
    while (i--) {
        this.insert(bodies[i]);
    }
};

QuadTree.prototype.insert = function (newBody) {
    this.insertStack.reset();
    this.insertStack.push(this.root, newBody);

    while (!this.insertStack.isEmpty()) {
        const stackItem = this.insertStack.pop();


        const node = stackItem.node;


        const body = stackItem.body;

        if (!node.body) {
            // This is internal node. Update the total mass of the node and center-of-mass.
            const x = body.pos.x;
            const y = body.pos.y;

            node.mass += body.mass;
            node.massX += body.mass * x;
            node.massY += body.mass * y;

            // Recursively insert the body in the appropriate quadrant.
            // But first find the appropriate quadrant.
            let quadIdx = 0;
            // Assume we are in the 0's quad.

            let left = node.left;


            let right = (node.right + left) / 2;


            let top = node.top;


            let bottom = (node.bottom + top) / 2;

            if (x > right) { // somewhere in the eastern part.
                quadIdx += 1;
                left = right;
                right = node.right;
            }
            if (y > bottom) { // and in south.
                quadIdx += 2;
                top = bottom;
                bottom = node.bottom;
            }

            let child = getChild(node, quadIdx);

            if (!child) {
                // The node is internal but this quadrant is not taken. Add
                // subnode to it.
                child = this.newNode();
                child.left = left;
                child.top = top;
                child.right = right;
                child.bottom = bottom;
                child.body = body;

                setChild(node, quadIdx, child);
            } else {
                // continue searching in this quadrant.
                this.insertStack.push(child, body);
            }
        } else {
            // We are trying to add to the leaf node.
            // We have to convert current leaf into internal node
            // and continue adding two nodes.
            const oldBody = node.body;

            node.body = null; // internal nodes do not cary bodies

            if (isSamePosition(oldBody.pos, body.pos)) {
                // Prevent infinite subdivision by bumping one node
                // anywhere in this quadrant
                let retriesCount = 3;

                do {
                    const offset = this.randomApi.nextDouble();
                    const dx = (node.right - node.left) * offset;
                    const dy = (node.bottom - node.top) * offset;

                    oldBody.pos.x = node.left + dx;
                    oldBody.pos.y = node.top + dy;
                    retriesCount -= 1;
                    // Make sure we don't bump it out of the box. If we do, next iteration should fix it
                } while (retriesCount > 0 && isSamePosition(oldBody.pos, body.pos));

                if (retriesCount === 0 && isSamePosition(oldBody.pos, body.pos)) {
                    // This is very bad, we ran out of precision.
                    // if we do not return from the method we'll get into
                    // infinite loop here. So we sacrifice correctness of layout, and keep the app running
                    // Next layout iteration should get larger bounding box in the first step and fix this
                    return;
                }
            }
            // Next iteration should subdivide node further.
            this.insertStack.push(node, oldBody);
            this.insertStack.push(node, body);
        }
    }
};

/**
 * Represents a physical spring. Spring connects two bodies, has rest length
 * stiffness coefficient and optional weight
 */
function Spring(fromBody, toBody, length, coeff, weight) {
    this.from = fromBody;
    this.to = toBody;
    this.length = length;
    this.coeff = coeff;

    this.weight = typeof weight === "number" ? weight : 1;
}

const Vector2d = function (x, y) {
    if (x && typeof x !== "number") {
        // could be another vector
        this.x = typeof x.x === "number" ? x.x : 0;
        this.y = typeof x.y === "number" ? x.y : 0;
    } else {
        this.x = typeof x === "number" ? x : 0;
        this.y = typeof y === "number" ? y : 0;
    }
};

Vector2d.prototype.reset = function () {
    this.x = this.y = 0;
};

var Vector3d = function (x, y, z) {
    if (x && typeof x !== "number") {
        // could be another vector
        this.x = typeof x.x === "number" ? x.x : 0;
        this.y = typeof x.y === "number" ? x.y : 0;
        this.z = typeof x.z === "number" ? x.z : 0;
    } else {
        this.x = typeof x === "number" ? x : 0;
        this.y = typeof y === "number" ? y : 0;
        this.z = typeof z === "number" ? z : 0;
    }
};

Vector3d.prototype.reset = function () {
    this.x = this.y = this.z = 0;
};

const Body = function (x, y) {
    this.pos = new Vector2d(x, y);
    this.prevPos = new Vector2d(x, y);
    this.force = new Vector2d();
    this.velocity = new Vector2d();
    this.mass = 1;
    this.isPinned = false;
};

Body.prototype.setPosition = function (x, y) {
    this.prevPos.x = this.pos.x = x;
    this.prevPos.y = this.pos.y = y;
};

var Vector3d = function (x, y, z) {
    if (x && typeof x !== "number") {
        // could be another vector
        this.x = typeof x.x === "number" ? x.x : 0;
        this.y = typeof x.y === "number" ? x.y : 0;
        this.z = typeof x.z === "number" ? x.z : 0;
    } else {
        this.x = typeof x === "number" ? x : 0;
        this.y = typeof y === "number" ? y : 0;
        this.z = typeof z === "number" ? z : 0;
    }
};

Vector3d.prototype.reset = function () {
    this.x = this.y = this.z = 0;
};

const Body3d = function (x, y, z) {
    this.pos = new Vector3d(x, y, z);
    this.prevPos = new Vector3d(x, y, z);
    this.force = new Vector3d();
    this.velocity = new Vector3d();
    this.mass = 1;
    this.isPinned = false;
};

Body3d.prototype.setPosition = function (x, y, z) {
    this.prevPos.x = this.pos.x = x;
    this.prevPos.y = this.pos.y = y;
    this.prevPos.z = this.pos.z = z;
};

const Bounds = function (bodies, settings) {
    const random = Random(42);
    const boundingBox = {x1: 0, y1: 0, x2: 0, y2: 0};

    return {
        box: boundingBox,

        update: updateBoundingBox,

        reset() {
            boundingBox.x1 = boundingBox.y1 = 0;
            boundingBox.x2 = boundingBox.y2 = 0;
        },

        getBestNewPosition(neighbors) {
            const graphRect = boundingBox;

            let baseX = 0;

            let
                baseY = 0;

            if (neighbors.length) {
                for (let i = 0; i < neighbors.length; ++i) {
                    baseX += neighbors[i].pos.x;
                    baseY += neighbors[i].pos.y;
                }

                baseX /= neighbors.length;
                baseY /= neighbors.length;
            } else {
                baseX = (graphRect.x1 + graphRect.x2) / 2;
                baseY = (graphRect.y1 + graphRect.y2) / 2;
            }

            const springLength = settings.springLength;

            return {
                x: baseX + random.next(springLength) - springLength / 2,
                y: baseY + random.next(springLength) - springLength / 2,
            };
        },
    };

    function updateBoundingBox() {
        let i = bodies.length;

        if (i === 0) {
            return;
        } // don't have to wory here.

        let x1 = Number.MAX_VALUE;


        let y1 = Number.MAX_VALUE;


        let x2 = Number.MIN_VALUE;


        let y2 = Number.MIN_VALUE;

        while (i--) {
            // this is O(n), could it be done faster with quadtree?
            // how about pinned nodes?
            const body = bodies[i];

            if (body.isPinned) {
                body.pos.x = body.prevPos.x;
                body.pos.y = body.prevPos.y;
            } else {
                body.prevPos.x = body.pos.x;
                body.prevPos.y = body.pos.y;
            }
            if (body.pos.x < x1) {
                x1 = body.pos.x;
            }
            if (body.pos.x > x2) {
                x2 = body.pos.x;
            }
            if (body.pos.y < y1) {
                y1 = body.pos.y;
            }
            if (body.pos.y > y2) {
                y2 = body.pos.y;
            }
        }

        boundingBox.x1 = x1;
        boundingBox.x2 = x2;
        boundingBox.y1 = y1;
        boundingBox.y2 = y2;
    }
};

function DragForce(options) {
    options = merge(options, {
        dragCoeff: 0.02,
    });

    const api = {
        update(body) {
            body.force.x -= options.dragCoeff * body.velocity.x;
            body.force.y -= options.dragCoeff * body.velocity.y;
        },
    };

    // let easy access to dragCoeff:
    exposeProperties(options, api, ["dragCoeff"]);
    return api;
}

function SpringForce(options) {
    options = merge(options, {
        springCoeff: 0.0002,
        springLength: 80,
    });
    const random = Random(42);
    const api = {
        /**
         * Upsates forces acting on a spring
         */
        update(spring) {
            const body1 = spring.from;


            const body2 = spring.to;


            const length = spring.length < 0 ? options.springLength : spring.length;


            let dx = body2.pos.x - body1.pos.x;


            let dy = body2.pos.y - body1.pos.y;


            let r = Math.sqrt(dx * dx + dy * dy);

            if (r === 0) {
                dx = (random.nextDouble() - 0.5) / 50;
                dy = (random.nextDouble() - 0.5) / 50;
                r = Math.sqrt(dx * dx + dy * dy);
            }

            const d = r - length;
            const coeff = ((!spring.coeff || spring.coeff < 0) ? options.springCoeff : spring.coeff) * d / r * spring.weight;

            body1.force.x += coeff * dx;
            body1.force.y += coeff * dy;

            body2.force.x -= coeff * dx;
            body2.force.y -= coeff * dy;
        },
    };

    exposeProperties(options, api, ["springCoeff", "springLength"]);
    return api;
}

function Integrate(bodies, timeStep) {
    let dx = 0;

    let tx = 0;


    let dy = 0;
    let ty = 0;


    let i;


    const max = bodies.length;

    if (max === 0) {
        return 0;
    }

    for (i = 0; i < max; ++i) {
        const body = bodies[i];


        const coeff = timeStep / body.mass;

        body.velocity.x += coeff * body.force.x;
        body.velocity.y += coeff * body.force.y;
        const vx = body.velocity.x;


        const vy = body.velocity.y;


        const v = Math.sqrt(vx * vx + vy * vy);

        if (v > 1) {
            body.velocity.x = vx / v;
            body.velocity.y = vy / v;
        }

        dx = timeStep * body.velocity.x;
        dy = timeStep * body.velocity.y;

        body.pos.x += dx;
        body.pos.y += dy;

        tx += Math.abs(dx);
        ty += Math.abs(dy);
    }
    return (tx * tx + ty * ty) / max;
}

const PhysicsSimulator = function (settings) {
    settings = merge(settings, {
        /**
         * Ideal length for links (springs in physical model).
         */
        springLength: 30,

        /**
         * Hook's law coefficient. 1 - solid spring.
         */
        springCoeff: 0.0008,

        /**
         * Coulomb's law coefficient. It's used to repel nodes thus should be negative
         * if you make it positive nodes start attract each other :).
         */
        gravity: -1.2,

        /**
         * Theta coefficient from Barnes Hut simulation. Ranged between (0, 1).
         * The closer it's to 1 the more nodes algorithm will have to go through.
         * Setting it to one makes Barnes Hut simulation no different from
         * brute-force forces calculation (each node is considered).
         */
        theta: 0.8,

        /**
         * Drag force coefficient. Used to slow down system, thus should be less than 1.
         * The closer it is to 0 the less tight system will be.
         */
        dragCoeff: 0.02,

        /**
         * Default time step (dt) for forces integration
         */
        timeStep: 20,
    });

    const bodies = []; // Bodies in this simulation.
    const springs = []; // Springs in this simulation.

    // We allow clients to override basic factory methods:
    const quadTree = new QuadTree(settings);
    const bounds = new Bounds(bodies, settings);
    const dragForce = DragForce(settings);
    const springForce = SpringForce(settings);

    let bboxNeedsUpdate = true;
    const totalMovement = 0; // how much movement we made on last step

    const publicApi = {
        /**
         * Array of bodies, registered with current simulator
         *
         * Note: To add new body, use addBody() method. This property is only
         * exposed for testing/performance purposes.
         */
        bodies,

        quadTree,

        /**
         * Array of springs, registered with current simulator
         *
         * Note: To add new spring, use addSpring() method. This property is only
         * exposed for testing/performance purposes.
         */
        springs,

        /**
         * Returns settings with which current simulator was initialized
         */
        settings,

        /**
         * Performs one step of force simulation.
         *
         * @returns {boolean} true if system is considered stable; False otherwise.
         */
        step() {
            accumulateForces();

            const movement = Integrate(bodies, settings.timeStep);

            bounds.update();

            return movement;
        },

        /**
         * Adds body to the system
         *
         * @param {ngraph.physics.primitives.Body} body physical body
         *
         * @returns {ngraph.physics.primitives.Body} added body
         */
        addBody(body) {
            if (!body) {
                throw new Error("Body is required");
            }
            bodies.push(body);

            return body;
        },

        /**
         * Adds body to the system at given position
         *
         * @param {Object} pos position of a body
         *
         * @returns {Body} added body
         */
        addBodyAt(pos) {
            if (!pos) {
                throw new Error("Body position is required");
            }
            const body = new Body(pos.x, pos.y);

            bodies.push(body);

            return body;
        },

        /**
         * Removes body from the system
         *
         * @param {Body} body to remove
         *
         * @returns {Boolean} true if body found and removed. falsy otherwise;
         */
        removeBody(body) {
            if (!body) {
                return;
            }

            const idx = bodies.indexOf(body);

            if (idx < 0) {
                return;
            }

            bodies.splice(idx, 1);
            if (bodies.length === 0) {
                bounds.reset();
            }
            return true;
        },

        /**
         * Adds a spring to this simulation.
         *
         * @returns {Object} - a handle for a spring. If you want to later remove
         * spring pass it to removeSpring() method.
         */
        addSpring(body1, body2, springLength, springWeight, springCoefficient) {
            if (!body1 || !body2) {
                throw new Error("Cannot add null spring to force simulator");
            }

            if (typeof springLength !== "number") {
                springLength = -1; // assume global configuration
            }

            const spring = new Spring(body1, body2, springLength, springCoefficient >= 0 ? springCoefficient : -1, springWeight);

            springs.push(spring);

            // TODO: could mark simulator as dirty.
            return spring;
        },

        /**
         * Returns amount of movement performed on last step() call
         */
        getTotalMovement() {
            return totalMovement;
        },

        /**
         * Removes spring from the system
         *
         * @param {Object} spring to remove. Spring is an object returned by addSpring
         *
         * @returns {Boolean} true if spring found and removed. falsy otherwise;
         */
        removeSpring(spring) {
            if (!spring) {
                return;
            }
            const idx = springs.indexOf(spring);

            if (idx > -1) {
                springs.splice(idx, 1);
                return true;
            }
        },

        getBestNewBodyPosition(neighbors) {
            return bounds.getBestNewPosition(neighbors);
        },

        /**
         * Returns bounding box which covers all bodies
         */
        getBBox() {
            if (bboxNeedsUpdate) {
                bounds.update();
                bboxNeedsUpdate = false;
            }
            return bounds.box;
        },

        invalidateBBox() {
            bboxNeedsUpdate = true;
        },

        gravity(value) {
            if (value !== undefined) {
                settings.gravity = value;
                quadTree.options({gravity: value});
                return this;
            } else {
                return settings.gravity;
            }
        },

        theta(value) {
            if (value !== undefined) {
                settings.theta = value;
                quadTree.options({theta: value});
                return this;
            } else {
                return settings.theta;
            }
        },
    };

    // allow settings modification via public API:
    exposeProperties(settings, publicApi);

    Events(publicApi);

    return publicApi;

    function accumulateForces() {
        // Accumulate forces acting on bodies.
        let body;

        let
            i = bodies.length;

        if (i) {
            // only add bodies if there the array is not empty:
            quadTree.insertBodies(bodies); // performance: O(n * log n)
            while (i--) {
                body = bodies[i];
                // If body is pinned there is no point updating its forces - it should
                // never move:
                if (!body.isPinned) {
                    body.force.reset();

                    quadTree.updateBodyForce(body);
                    dragForce.update(body);
                }
            }
        }

        i = springs.length;
        while (i--) {
            springForce.update(springs[i]);
        }
    }
};

export function ForceLayout(graph, physicsSettings) {
    const physicsSimulator = PhysicsSimulator(physicsSettings);

    let nodeMass = defaultNodeMass;

    if (physicsSettings && typeof physicsSettings.nodeMass === "function") {
        nodeMass = physicsSettings.nodeMass;
    }

    const nodeBodies = Object.create(null);
    const springs = {};
    let bodiesCount = 0;

    function noop() {
    }

    const springTransform = physicsSimulator.settings.springTransform || noop;

    // Initialize physics with what we have in the graph:
    initPhysics();
    listenToEvents();

    let wasStable = false;

    var api = {
        /**
         * Performs one step of iterative layout algorithm
         *
         * @returns {boolean} true if the system should be considered stable; Flase otherwise.
         * The system is stable if no further call to `step()` can improve the layout.
         */
        step() {
            if (bodiesCount === 0) return true; // TODO: This will never fire 'stable'

            const lastMove = physicsSimulator.step();

            // Save the movement in case if someone wants to query it in the step
            // callback.
            api.lastMove = lastMove;

            // Allow listeners to perform low-level actions after nodes are updated.
            api.fire("step");

            const ratio = lastMove / bodiesCount;
            const isStableNow = ratio <= 0.01; // TODO: The number is somewhat arbitrary...

            if (wasStable !== isStableNow) {
                wasStable = isStableNow;
                onStableChanged(isStableNow);
            }

            return isStableNow;
        },

        /**
         * For a given `nodeId` returns position
         */
        getNodePosition(nodeId) {
            return getInitializedBody(nodeId).pos;
        },

        /**
         * Sets position of a node to a given coordinates
         * @param {string} nodeId node identifier
         * @param {number} x position of a node
         * @param {number} y position of a node
         * @param {number=} z position of node (only if applicable to body)
         */
        setNodePosition(nodeId) {
            const body = getInitializedBody(nodeId);

            body.setPosition(...Array.prototype.slice.call(arguments, 1));
            physicsSimulator.invalidateBBox();
        },

        /**
         * @returns {Object} Link position by link id
         * @returns {Object.from} {x, y} coordinates of link start
         * @returns {Object.to} {x, y} coordinates of link end
         */
        getLinkPosition(linkId) {
            const spring = springs[linkId];

            if (spring) {
                return {
                    from: spring.from.pos,
                    to: spring.to.pos,
                };
            }
        },

        /**
         * @returns {Object} area required to fit in the graph. Object contains
         * `x1`, `y1` - top left coordinates
         * `x2`, `y2` - bottom right coordinates
         */
        getGraphRect() {
            return physicsSimulator.getBBox();
        },

        /**
         * Iterates over each body in the layout simulator and performs a callback(body, nodeId)
         */
        forEachBody,

        /*
         * Requests layout algorithm to pin/unpin node to its current position
         * Pinned nodes should not be affected by layout algorithm and always
         * remain at their position
         */
        pinNode(node, isPinned) {
            const body = getInitializedBody(node.id);

            body.isPinned = !!isPinned;
        },

        /**
         * Checks whether given graph's node is currently pinned
         */
        isNodePinned(node) {
            return getInitializedBody(node.id).isPinned;
        },

        /**
         * Request to release all resources
         */
        dispose() {
            graph.off("changed", onGraphChanged);
            api.fire("disposed");
        },

        /**
         * Gets physical body for a given node id. If node is not found undefined
         * value is returned.
         */
        getBody,

        /**
         * Gets spring for a given edge.
         *
         * @param {string} linkId link identifer. If two arguments are passed then
         * this argument is treated as formNodeId
         * @param {string=} toId when defined this parameter denotes head of the link
         * and first argument is trated as tail of the link (fromId)
         */
        getSpring,

        /**
         * [Read only] Gets current physics simulator
         */
        simulator: physicsSimulator,

        /**
         * Gets the graph that was used for layout
         */
        graph,

        /**
         * Gets amount of movement performed during last step opeartion
         */
        lastMove: 0,
    };
    Events(api);
    return api;

    function forEachBody(cb) {
        Object.keys(nodeBodies).forEach(bodyId => {
            cb(nodeBodies[bodyId], bodyId);
        });
    }

    function getSpring(fromId, toId) {
        let linkId;

        if (toId === undefined) {
            if (typeof fromId !== "object") {
                // assume fromId as a linkId:
                linkId = fromId;
            } else {
                // assume fromId to be a link object:
                linkId = fromId.id;
            }
        } else {
            // toId is defined, should grab link:
            const link = graph.hasLink(fromId, toId);

            if (!link) return;
            linkId = link.id;
        }

        return springs[linkId];
    }

    function getBody(nodeId) {
        return nodeBodies[nodeId];
    }

    function listenToEvents() {
        graph.on("changed", onGraphChanged);
    }

    function onStableChanged(isStable) {
        api.fire("stable", isStable);
    }

    function onGraphChanged(changes) {
        for (let i = 0; i < changes.length; ++i) {
            const change = changes[i];

            if (change.changeType === "add") {
                if (change.node) {
                    initBody(change.node.id);
                }
                if (change.link) {
                    initLink(change.link);
                }
            } else if (change.changeType === "remove") {
                if (change.node) {
                    releaseNode(change.node);
                }
                if (change.link) {
                    releaseLink(change.link);
                }
            }
        }
        bodiesCount = graph.getNodesCount();
    }

    function initPhysics() {
        bodiesCount = 0;

        graph.forEachNode(node => {
            initBody(node.id);
            bodiesCount += 1;
        });

        graph.forEachLink(initLink);
    }

    function initBody(nodeId) {
        let body = nodeBodies[nodeId];

        if (!body) {
            const node = graph.getNode(nodeId);

            if (!node) {
                throw new Error("initBody() was called with unknown node id");
            }

            let pos = node.position;

            if (!pos) {
                const neighbors = getNeighborBodies(node);

                pos = physicsSimulator.getBestNewBodyPosition(neighbors);
            }

            body = physicsSimulator.addBodyAt(pos);
            body.id = nodeId;

            nodeBodies[nodeId] = body;
            updateBodyMass(nodeId);

            if (isNodeOriginallyPinned(node)) {
                body.isPinned = true;
            }
        }
    }

    function releaseNode(node) {
        const nodeId = node.id;
        const body = nodeBodies[nodeId];

        if (body) {
            nodeBodies[nodeId] = null;
            delete nodeBodies[nodeId];

            physicsSimulator.removeBody(body);
        }
    }

    function initLink(link) {
        updateBodyMass(link.source);
        updateBodyMass(link.target);

        const fromBody = nodeBodies[link.source];


        const toBody = nodeBodies[link.target];


        const spring = physicsSimulator.addSpring(fromBody, toBody, link.length);

        springTransform(link, spring);

        springs[link.id] = spring;
    }

    function releaseLink(link) {
        const spring = springs[link.id];

        if (spring) {
            const from = graph.getNode(link.source);


            const to = graph.getNode(link.target);

            if (from) updateBodyMass(from.id);
            if (to) updateBodyMass(to.id);

            delete springs[link.id];

            physicsSimulator.removeSpring(spring);
        }
    }

    function getNeighborBodies(node) {
        // TODO: Could probably be done better on memory
        const neighbors = [];

        if (!node.links) {
            return neighbors;
        }
        const maxNeighbors = Math.min(node.links.length, 2);

        for (let i = 0; i < maxNeighbors; ++i) {
            const link = node.links[i];
            const otherBody = link.source !== node.id ? nodeBodies[link.source] : nodeBodies[link.target];

            if (otherBody && otherBody.pos) {
                neighbors.push(otherBody);
            }
        }

        return neighbors;
    }

    function updateBodyMass(nodeId) {
        const body = nodeBodies[nodeId];

        body.mass = nodeMass(nodeId);
        if (Number.isNaN(body.mass)) {
            throw new Error("Node mass should be a number");
        }
    }

    /**
     * Checks whether graph node has in its settings pinned attribute,
     * which means layout algorithm cannot move it. Node can be preconfigured
     * as pinned, if it has "isPinned" attribute, or when node.data has it.
     *
     * @param {Object} node a graph node to check
     * @return {Boolean} true if node should be treated as pinned; false otherwise.
     */
    function isNodeOriginallyPinned(node) {
        return (node && (node.isPinned || (node.data && node.data.isPinned)));
    }

    function getInitializedBody(nodeId) {
        let body = nodeBodies[nodeId];

        if (!body) {
            initBody(nodeId);
            body = nodeBodies[nodeId];
        }
        return body;
    }

    /**
     * Calculates mass of a body, which corresponds to node with given id.
     *
     * @param {String|Number} nodeId identifier of a node, for which body mass needs to be calculated
     * @returns {Number} recommended mass of the body;
     */
    function defaultNodeMass(nodeId) {
        const links = graph.getLinks(nodeId);

        if (!links) return 1;
        return 1 + links.length / 3.0;
    }
}

export default {
    ForceLayout,
    Graph,
};
