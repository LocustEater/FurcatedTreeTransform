class FurcatedTreeTransformer {
    constructor(openPMarker = '(', closingPMarker = ')', labelDelimiter = ' ', furcatedTag) {
        this._openPMarker = openPMarker
        this._closingPMarker = closingPMarker
        this._labelDelimiter = labelDelimiter
        this._furcatedTag = furcatedTag
    }

    parseString(str) {
        let currentNode = { children: [] }
        const openNodes = [currentNode]
        for (let i = 0; i < str.length; i++) {
            if (str[i] === this._openPMarker) {
                currentNode = { label: '', contents: '', children: [] }
                
                if (str[i + 1] === this._furcatedTag) currentNode.furcated = true
                else openNodes[openNodes.length - 1].children.push(currentNode)
                                                   
                openNodes.push(currentNode)            
            }
            else if (str[i] === this._closingPMarker) {
                if (currentNode.furcated) {
                    if(currentNode.label === openNodes[openNodes.length - 2].label) {
                        currentNode.children.forEach(child => { openNodes[openNodes.length - 2].children.push(child) })
                        openNodes[openNodes.length - 2].contents += currentNode.contents
                        openNodes.pop()
                        currentNode = openNodes[openNodes.length - 1]
                    }
                    else {
                        currentNode.furcated = false;
                        if (openNodes[openNodes.length - 2].children.length !== 0) {
                            openNodes[openNodes.length - 2].children.forEach(child => currentNode.children.unshift(child))
                            openNodes[openNodes.length - 2].children.unshift(currentNode)
                            openNodes[openNodes.length - 2].children.pop()
                            openNodes.pop() 
                        }
                        else {
                            currentNode.active = true
                            openNodes[openNodes.length - 2].children.push(currentNode)                           
                        }
                    }
                }               
                else {
                    if(openNodes[openNodes.length - 2].active) openNodes.pop()

                    openNodes.pop()
                    currentNode = openNodes[openNodes.length - 1]
                }         
            } 
            else if (!currentNode.labeled && str[i] !== this._furcatedTag) {                         
                if(str[i] === this._labelDelimiter)currentNode.labeled = true
                else currentNode.label += str[i]
            }
            else currentNode.contents += str[i]
        }       
        return currentNode.children[0]
    }

    toString(node, str = '') {
        str += this._openPMarker + node.label + this._labelDelimiter + node.contents
        node.children.forEach(child => {
            str = this.toString(child, str)
        })
        return str += this._closingPMarker
    }
}

var transformer = new FurcatedTreeTransformer('(', ')', '\|', '@');
var text = "(ROOT|sentiment=3|prob=0.526(NP|sentiment=2|prob=0.653(NP|sentiment=2|prob=0.673(NP|sentiment=2|prob=0.992(NNP|sentiment=2|prob=0.993Friday)(POS|sentiment=2|prob=0.994's))(@NP|sentiment=2|prob=0.602(NN|sentiment=2|prob=0.631summit)(NN|sentiment=2|prob=0.467meeting)))(PP|sentiment=2|prob=0.887(IN|sentiment=2|prob=0.994between)(NP|sentiment=2|prob=0.593(NP|sentiment=2|prob=0.846(DT|sentiment=2|prob=0.994the)(NNS|sentiment=2|prob=0.631leaders))(PP|sentiment=2|prob=0.692(IN|sentiment=2|prob=0.993of)(NP|sentiment=2|prob=0.576(NNP|sentiment=2|prob=0.923North)(@NP|sentiment=2|prob=0.593(CC|sentiment=2|prob=0.996and)(@NP|sentiment=2|prob=0.850(NNP|sentiment=2|prob=0.992South)(NNP|sentiment=2|prob=0.973Korea))))))))(@S|sentiment=3|prob=0.620(VP|sentiment=3|prob=0.554(@VP|sentiment=3|prob=0.768(@VP|sentiment=3|prob=0.735(VBD|sentiment=2|prob=0.996was)(NP|sentiment=3|prob=0.781(NP|sentiment=3|prob=0.849(DT|sentiment=2|prob=0.990a)(@NP|sentiment=3|prob=0.829(NN|sentiment=2|prob=0.951master)(NN|sentiment=2|prob=0.978class)))(PP|sentiment=2|prob=0.755(IN|sentiment=2|prob=0.993in)(NP|sentiment=2|prob=0.729(JJ|sentiment=2|prob=0.631diplomatic)(NN|sentiment=2|prob=0.951choreography)))))(,|sentiment=2|prob=0.997,))(PP|sentiment=1|prob=0.465(IN|sentiment=2|prob=0.992with)(NP|sentiment=1|prob=0.458(NP|sentiment=2|prob=0.984(DT|sentiment=2|prob=0.994each)(NN|sentiment=2|prob=0.992scene))(VP|sentiment=1|prob=0.348(@VP|sentiment=2|prob=0.429(VBN|sentiment=2|prob=0.631arranged)(PP|sentiment=2|prob=0.613(IN|sentiment=2|prob=0.992for)(NP|sentiment=3|prob=0.845(PRP$|sentiment=2|prob=0.994its)(NN|sentiment=2|prob=0.983power))))(SBAR|sentiment=2|prob=0.625(IN|sentiment=2|prob=0.990as)(S|sentiment=2|prob=0.727(NP|sentiment=2|prob=0.418(@NP|sentiment=2|prob=0.887(NP|sentiment=2|prob=0.976(JJ|sentiment=2|prob=0.994political)(NN|sentiment=3|prob=0.930theater))(CC|sentiment=2|prob=0.996and))(NP|sentiment=3|prob=0.393broadcast))(VP|sentiment=2|prob=0.994live)))))))(.|sentiment=2|prob=0.997.)))";
//var text = "(ROOT(S(NP(DT The)(NN summit))(VP(MD will)(VP(VB be)(NP(NP(DT the)(JJ first)(JJ face-to-face)(NN meeting))(PP(IN between)(NP(NP(DT a)(VBG sitting)(JJ American)(NN president))(CC and)(NP(DT the)(ADJP(JJ North)(JJ Korean))(NN leader)))))))(. .)))"
var object = transformer.parseString(text);
console.log(text);
console.log(transformer.toString(object));