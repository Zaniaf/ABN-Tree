/*
 * Finds the node in the tree
 * Uses recursion to search deeper, by checking if the node exists
 * in the childrenUnderThisNode array that each node has
 **/
const getNode = (tree, nodeName) => {
    let foundNode;
    if (typeof tree === 'undefined') {
        return;
    }
    tree.forEach(node => {
        if (typeof foundNode === 'undefined') {
            if (node.name === nodeName) {
                foundNode = node;
            } else if (node.childrenUnderThisNode.indexOf(nodeName) >= 0) {
                foundNode = getNode(node.children, nodeName);
            }
        }
    });
    return foundNode;
}

/*
 * Converts the linear data to tree data
 * Starts from an empty array and triggers the addNewNode function
 **/
const convertToTree = (treeData) => {
    const tree = [];
    treeData.forEach(node => {
        addNewNode(tree, node);
    });
    return tree;
}

/*
 * Adds the nodes to the tree and updates the parents
 **/
const addNewNode = (tree, node) => {
    node.children = [];
    node.childrenUnderThisNode = [];

    if (node.parent === "") {
        tree.push(node);
        return;
    }

    let parent = getNode(tree, node.parent);
    parent.children.push(node);
    node.parent = parent;
    updateChildrenUnderThisNode(node, node.name);
}

/*
 * Bookkeeping recursive function that makes the tree searching more efficient,
 * by storing all the children (and the children of the children) of each node
 **/
const updateChildrenUnderThisNode = (node, nodeName) => {
    if (node.parent !== '') {
        node.parent.childrenUnderThisNode.push(nodeName);
        updateChildrenUnderThisNode(node.parent, nodeName);
    }
}

/*
 * Recursive cleanup function that gets rid of the JSON circular dependency issue
 **/
const cleanUpParentProperty = (tree) => {
    tree.forEach(node => {
        node.parent = node.parent.name;
        delete node.childrenUnderThisNode;
        cleanUpParentProperty(node.children);
    });
}

module.exports = {
    convertToTree,
    cleanUpParentProperty,
}
