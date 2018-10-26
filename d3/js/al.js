const setParentDisjt = (parent, child) => {
    if (!hasId(parent) || !hasChildren(parent)) {
        return;
    }

    if (!parentDisjoint[child]) {
        parentDisjoint[child] = parent;
    }

    gData[child].children.map(nextChild => setParentDisjt(child, nextChild));
};
// disjoint 이용
// id의 부모, 조상 노드 탐색
const getUpTreeById = (id, tree = []) => {
    let parent = getParent(id);

    if (id === parent) {
        return tree;
    }

    tree.push(gData[parent]);

    return getUpTreeById(parent, tree);
};
