class Tile {
    // Edges in order: up, right, down, left.
    constructor(img, edges) {
        this.img = img;
        this.edges = edges;

        this.up = [];
        this.right = [];
        this.down = [];
        this.left = [];
    }

    rotate(rotationsCount) {
        const selfImg = this.img;
        const w = selfImg.width;
        const h = selfImg.height;

        const newImg = createGraphics(w, h);
        newImg.imageMode(CENTER);
        newImg.translate(w * 0.5, h * 0.5);
        newImg.rotate(rotationsCount * HALF_PI);
        newImg.image(this.img, 0, 0);

        const newEdges = [];
        const edgesCount = this.edges.length;
        for (let i = 0; i < edgesCount; i++) {
            const newEdgeIndex = (i - rotationsCount % edgesCount + edgesCount) % edgesCount;
            const newEdge = this.edges[newEdgeIndex];
            newEdges[i] = newEdge;
        }

        const result =  new Tile(newImg, newEdges);

        return result;
    }

    

    analyzeRules(tiles) {
        
        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];

            const upSocket = this.edges[0];
            const rightpSocket = this.edges[1];
            const downSocket = this.edges[2];
            const leftSocket = this.edges[3];

            const otherUpSocket = tile.edges[0];
            const otherRightSocket = tile.edges[1];
            const otherDownSocket = tile.edges[2];
            const otherLeftSocket = tile.edges[3];

            if (upSocket.canConnectTo(otherDownSocket)) {
                this.up.push(i);
            }

            if (rightpSocket.canConnectTo(otherLeftSocket)){
                this.right.push(i);
            }

            if (downSocket.canConnectTo(otherUpSocket)){
                this.down.push(i);
            }

            if (leftSocket.canConnectTo(otherRightSocket)){
                this.left.push(i);
            }
        }
    }
}