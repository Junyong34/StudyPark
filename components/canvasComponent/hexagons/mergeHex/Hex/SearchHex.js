export default class SearchHex {
    Node(hex, parent, g, h) {
        this.hex = hex;
        this.parent = null;
        this.G = null;
        this.H = null;
        this.F = null;
        this.rescore(parent, g, h);
    }

    rescore(parent, g, h) {
        this.parent = parent;
        this.G = g;
        this.H = h || 0;
        this.F = this.G + this.H;
    }
}
