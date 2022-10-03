class TileSocket {
    constructor(clockwiseConnectors) {
        this.connectors = clockwiseConnectors;
    }

    canConnectTo(other) {
        const c0 = this.connectors;
        const c1 = other.connectors;
        const r1 = this.reverse(c1);

        let isEqual = true;

        for (let i = 0; i < c0.length; i++) {
            if (c0[i] != r1[i]) {
                isEqual = false;
                break;
            }
            
        }

        return isEqual;
    }

    reverse(array) {
        var input = array.slice();
        var output = [];
        while (input.length > 0) {
          output.push(input.pop());
        }
      
        return output;
      }
}