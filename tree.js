class FurcatedTreeTransformer {
    constructor(openPMarker = '(', closingPMarker = ')', labelDelimiter = ' ', furcatedTag = '@') {
      this._openPMarker = openPMarker
      this._closingPMarker = closingPMarker
      this._labelDelimiter = labelDelimiter
      this._furcatedTag = furcatedTag
    }

    openPMarker(str = null) {
      if(str) this._openPMarker = str
      return this._openPMarker
    }

    closingPMarker(str = null) {
      if(str) this.closingPMarker = str
      return this._closingPMarker
    }

    labelDelimiter(str = null) {
      if(str) this.labelDelimiter = str
      return this._labelDelimiter
    }

    furcatedTag(str = null) {
      if(str) this.furcatedTag = str
      return this._furcatedTag
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
      const furcatedTagDelimiter = node.str.indexOf(this._furcatedTag) + 1
      const labelDelimiter = node.str.indexOf(this._labelDelimiter) 
      
      if(furcatedTagDelimiter > 0) node.furcated = true

      if(labelDelimiter > -1) {
        node.label = node.str.substring(furcatedTagDelimiter, labelDelimiter)
        node.contents = node.str.substring(labelDelimiter + 1)
        delete node.str
      }
      if(visitor) {
        visitor(node)
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

module.exports = FurcatedTreeTransformer