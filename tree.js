class FurcatedTreeTransformer {
    constructor(openPMarker = '(', closingPMarker = ')', labelDelimiter = ' ', furcatedTag = '@') {
      this._openPMarker = openPMarker
      this._closingPMarker = closingPMarker
      this._labelDelimiter = labelDelimiter
      this._furcatedTag = furcatedTag
    }

    fromString(str, visitor) {
      let currentNode = { children: [], parent: {} }
      const openNodes = [currentNode]
      
      for (let i = 0; i < str.length; i++) {
          if (str[i] === this._openPMarker) {
            currentNode = { str: '', children: [] }
            if (openNodes.length > 1) currentNode.parent = openNodes[openNodes.length - 1]
            openNodes[openNodes.length - 1].children.push(currentNode)
            openNodes.push(currentNode)
          } 
          else if (str[i] === this._closingPMarker) {
            this._scrubNode(currentNode, visitor)
            openNodes.pop()
            currentNode = openNodes[openNodes.length - 1]
          } 
          else {
            currentNode.str += str[i]
          }
        }
      return this._tree = currentNode.children[0]
    }

    _scrubNode(node, visitor) {
      if(visitor) {
        visitor(node)
      } 
      else {
        const furcatedTagDelimiter = node.str.indexOf(this._furcatedTag) + 1
        const labelDelimiter = node.str.indexOf(this._labelDelimiter) 
        
        if(furcatedTagDelimiter > 0) node.furcated = true

        if(labelDelimiter > -1) {
          node.label = node.str.substring(furcatedTagDelimiter, labelDelimiter)
          if(node.label == 'S')
            console.log('')
          node.contents = node.str.substring(labelDelimiter + 1)
          delete node.str
        }
      }
    }

    unfurcate(node = this._tree) {
      node.children.forEach(child => {
        this.unfurcate(child)
      })
      
      if(node.furcated) {
        const newChildren = []
        const newParentChildren = []

        node.parent.children.map(sibling => {
          if(sibling == node) node.children.forEach(child => {
            if(node.label == node.parent.label) child.parent = node.parent, newParentChildren.push(child)
            else newChildren.push(child) 
          })
          else { 
            if(node.label == node.parent.label) newParentChildren.push(sibling)
            else sibling.parent = node, newChildren.push(sibling)
          }                     
        })
        if(node.label != node.parent.label) node.children = newChildren, newParentChildren.push(node)
        node.parent.children = newParentChildren
      }
    }

    toString(node = this._tree, str = '') {
        str += this._openPMarker + node.label + this._labelDelimiter + node.contents
        node.children.forEach(child => {
            str = this.toString(child, str)
        })
        return str += this._closingPMarker
    }
}

var transformer = new FurcatedTreeTransformer('(', ')', ' ', '@');
//var text = "(ROOT|sentiment=3|prob=0.526(NP|sentiment=2|prob=0.653(NP|sentiment=2|prob=0.673(NP|sentiment=2|prob=0.992(NNP|sentiment=2|prob=0.993Friday)(POS|sentiment=2|prob=0.994's))(@NP|sentiment=2|prob=0.602(NN|sentiment=2|prob=0.631summit)(NN|sentiment=2|prob=0.467meeting)))(PP|sentiment=2|prob=0.887(IN|sentiment=2|prob=0.994between)(NP|sentiment=2|prob=0.593(NP|sentiment=2|prob=0.846(DT|sentiment=2|prob=0.994the)(NNS|sentiment=2|prob=0.631leaders))(PP|sentiment=2|prob=0.692(IN|sentiment=2|prob=0.993of)(NP|sentiment=2|prob=0.576(NNP|sentiment=2|prob=0.923North)(@NP|sentiment=2|prob=0.593(CC|sentiment=2|prob=0.996and)(@NP|sentiment=2|prob=0.850(NNP|sentiment=2|prob=0.992South)(NNP|sentiment=2|prob=0.973Korea))))))))(@S|sentiment=3|prob=0.620(VP|sentiment=3|prob=0.554(@VP|sentiment=3|prob=0.768(@VP|sentiment=3|prob=0.735(VBD|sentiment=2|prob=0.996was)(NP|sentiment=3|prob=0.781(NP|sentiment=3|prob=0.849(DT|sentiment=2|prob=0.990a)(@NP|sentiment=3|prob=0.829(NN|sentiment=2|prob=0.951master)(NN|sentiment=2|prob=0.978class)))(PP|sentiment=2|prob=0.755(IN|sentiment=2|prob=0.993in)(NP|sentiment=2|prob=0.729(JJ|sentiment=2|prob=0.631diplomatic)(NN|sentiment=2|prob=0.951choreography)))))(,|sentiment=2|prob=0.997,))(PP|sentiment=1|prob=0.465(IN|sentiment=2|prob=0.992with)(NP|sentiment=1|prob=0.458(NP|sentiment=2|prob=0.984(DT|sentiment=2|prob=0.994each)(NN|sentiment=2|prob=0.992scene))(VP|sentiment=1|prob=0.348(@VP|sentiment=2|prob=0.429(VBN|sentiment=2|prob=0.631arranged)(PP|sentiment=2|prob=0.613(IN|sentiment=2|prob=0.992for)(NP|sentiment=3|prob=0.845(PRP$|sentiment=2|prob=0.994its)(NN|sentiment=2|prob=0.983power))))(SBAR|sentiment=2|prob=0.625(IN|sentiment=2|prob=0.990as)(S|sentiment=2|prob=0.727(NP|sentiment=2|prob=0.418(@NP|sentiment=2|prob=0.887(NP|sentiment=2|prob=0.976(JJ|sentiment=2|prob=0.994political)(NN|sentiment=3|prob=0.930theater))(CC|sentiment=2|prob=0.996and))(NP|sentiment=3|prob=0.393broadcast))(VP|sentiment=2|prob=0.994live)))))))(.|sentiment=2|prob=0.997.)))";
//var text = "(ROOT(S(NP(DT The)(NN summit))(VP(MD will)(VP(VB be)(NP(NP(DT the)(JJ first)(JJ face-to-face)(NN meeting))(PP(IN between)(NP(NP(DT a)(VBG sitting)(JJ American)(NN president))(CC and)(NP(DT the)(ADJP(JJ North)(JJ Korean))(NN leader)))))))(. .)))"
var text = "(A a(B b(C c)(D d))(@A a(E e(F f)(@E e))(G g(H h(I i)(J j))(@G g))))"
var object = transformer.fromString(text);
transformer.unfurcate()
//console.log(text);
console.log(transformer.toString(object));