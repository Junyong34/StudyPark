export default class NodeTreeSearch {
    constructor(bounds, maxObjects, maxLevels, level) {
        this.max_objects = maxObjects || 10;
        this.max_levels = maxLevels || 4;

        this.level = level || 0;
        this.bounds = bounds;

        this.objects = []; // 객체를 담는다 원 or 박스
        this.nodes = []; // 4등분으로 영역을 쪼갠다 QuadTree
    }

    // Node가 사각형이 아니고 원일 때 확인 필요
    split() {
        const nextLevel = this.level + 1;

        const subWidth = this.bounds.width / 2;


        const subHeight = this.bounds.height / 2;


        const x = this.bounds.x;


        const y = this.bounds.y;

        // top right node
        this.nodes[0] = new NodeTreeSearch({
            x: x + subWidth,
            y,
            width: subWidth,
            height: subHeight,
        }, this.max_objects, this.max_levels, nextLevel);

        // top left node
        this.nodes[1] = new NodeTreeSearch({
            x,
            y,
            width: subWidth,
            height: subHeight,
        }, this.max_objects, this.max_levels, nextLevel);

        // bottom left node
        this.nodes[2] = new NodeTreeSearch({
            x,
            y: y + subHeight,
            width: subWidth,
            height: subHeight,
        }, this.max_objects, this.max_levels, nextLevel);

        // bottom right node
        this.nodes[3] = new NodeTreeSearch({
            x: x + subWidth,
            y: y + subHeight,
            width: subWidth,
            height: subHeight,
        }, this.max_objects, this.max_levels, nextLevel);
    }

// 4분할 인덱스 찾는다.
    getIndex(pRect) {
        let index = -1;
        const verticalMidpoint = this.bounds.x + (this.bounds.width / 2);


        const horizontalMidpoint = this.bounds.y + (this.bounds.height / 2);


        const topQuadrant = (pRect.pos2dY - pRect.size < horizontalMidpoint &&
            (pRect.pos2dY - pRect.size) +
            pRect.height < horizontalMidpoint);


        const bottomQuadrant = (pRect.pos2dY - pRect.size > horizontalMidpoint);

        if (pRect.pos2dX - pRect.size < verticalMidpoint &&
            pRect.pos2dX - pRect.size + pRect.width < verticalMidpoint) {
            if (topQuadrant) {
                index = 1;
            } else if (bottomQuadrant) {
                index = 2;
            }
        } else if (pRect.pos2dX - pRect.size > verticalMidpoint) {
            if (topQuadrant) {
                index = 0;
            } else if (bottomQuadrant) {
                index = 3;
            }
        }

        return index;
    }

// 구역 트리를 계속 삽입한다.
    insert(pRect) {
        let i = 0;
        let index;

        if (typeof this.nodes[0] !== "undefined") {
            index = this.getIndex(pRect);

            if (index !== -1) {
                this.nodes[index].insert(pRect);
                return;
            }
        }

        this.objects.push(pRect);

        if (this.objects.length > this.max_objects && this.level < this.max_levels) {
            // split if we don't already have subnodes
            if (typeof this.nodes[0] === "undefined") {
                // console.log(this.bounds);
                this.split();
            }

            // add all objects to there corresponding subnodes
            while (i < this.objects.length) {
                index = this.getIndex(this.objects[i]);

                if (index !== -1) {
                    this.nodes[index].insert(this.objects.splice(i, 1)[0]);
                } else {
                    i += 1;
                }
            }
        }
    }

// 재귀를 돌면서 마우스포인트의 nodes 영역 index를 찾아서 리턴
    retrieve(pRect) {
        const index = this.getIndex(pRect);


        let returnObjects = this.objects;

        if (typeof this.nodes[0] !== "undefined") {
            // if pRect fits into a subnode ..
            if (index !== -1) {
                returnObjects = returnObjects.concat(this.nodes[index].retrieve(pRect));
            } else {
                // 영역이 아닌 선에 걸치면 전부 탐색
                // 개선 우째할까요 ?
                for (let i = 0; i < this.nodes.length; i += 1) {
                    returnObjects = returnObjects.concat(this.nodes[i].retrieve(pRect));
                }
            }
        }

        return returnObjects;
    }

    clear() {
        this.objects = [];

        for (let i = 0; i < this.nodes.length; i += 1) {
            if (typeof this.nodes[i] !== "undefined") {
                this.nodes[i].clear();
            }
        }

        this.nodes = [];
    }
}
