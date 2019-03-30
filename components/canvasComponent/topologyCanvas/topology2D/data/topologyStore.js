export const dataSet = {
    nodeCnt: 100,
    group: {
        nodes: [],
        edges: [],
    },
    randomData() {
        for (let ix = 0; ix < this.nodeCnt; ix++) {
            this.group.nodes.push({
                id: 'n' + ix,
                label: 'Node ' + ix,
                x: Math.random(),
                y: Math.random(),
                size: Math.random(),
                color: '#666'
            });
        }


        for (let ix = 0; ix < 200; ix++) {
            this.group.edges.push({
                id: 'e' + ix,
                source: 'n' + (Math.random() * this.nodeCnt | 0),
                target: 'n' + (Math.random() * this.nodeCnt | 0),
                size: Math.random(),
                color: '#ccc'
            });
        }

    },


}
