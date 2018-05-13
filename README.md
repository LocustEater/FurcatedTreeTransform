# FurcatedTreeTransform
**Current status:** In progress.

Javascript class to restore furcated trees (forced to expand/collapse nodes to fit a required architecture, like a binary tree) back to their original structure.


### Background:
This was originally designed to expand the sentimentTree parse string returned by [Stanford CoreNLP server](https://stanfordnlp.github.io/CoreNLP/corenlp-server.html). The tree structure returned for sentiment analysis has been bifurcated, so it does not match the original sentence structure, in that meaningless intermediary nodes are created and some unary nodes have been collapsed. This makes it difficult to apply the sentiment values the original parse structure. This is an attempt to force the bifurcated data back to its original structure.

### Assumed format for furcation based on CoreNLP parse strings:
* Created or moved nodes have a furcated tag, an '@'.
* In the parse string, this symbol immediately follows the opening phrase marker, an '('.
* The label for the node follows directly after the furcated tag.
* There is a delimiter for the label/other variables, an '|' or ' '.
* Any information after the label and before the closing phrase marker, an ')', is irrelevant to the furcation process.

### Assumed rules of furcation based on CoreNLP parse strings:
* Any furcated node whose tag matches their parent's tag should be removed, and that node's children should be added as children of the node's parent.

As an example:
```
(NP
    (NP
        (NNP)
        (POS))
    (@NP
        (NN)
        (NN)))
```
Becomes:
```
(NP
    (NP
        (NNP)
        (POS))
    (NN)
    (NN))
```
* Any furcated node whose tag does not match their parent's should remain a child of its parent, but all other children of the parent should be removed and added as children of the current node.

As an example:
```
(ROOT
    (NP)
    (@S
        (VP)
        (.)))
```
Becomes:
```
(ROOT
    (@S
        (NP)
        (VP)
        (.)))
```
## Usage:
#### You'll need to instantiate a new FurcatedTreeTransformer object.
```javascript
const transformer = new FurcatedTreeTransformer('(', ')', ' ', '@');
```
The 4 arguments are the open phrase marker, end phrase marker, label delimiter, and furcated tag. If none are specified, they will default to those shown above.

#### There are only 3 public methods currently:
  1. **fromString()** takes a parse string and turns it into a "tree," which is just an object with successive nested objects. It returns it and saves it in the FurcatedTreeTransformer. It also has a visitor method that gets passed the private method \_scrubNodes(), which allows for customization of "nodes" in the "tree" by allowing access to them as they are being formatted.
  
  2. **unfurcate()** takes the tree and transforms it according to the rules above.
  
  3. **toString()** converts the "tree" back to a parse string using the same 4 arguments used to create FurcatedTreeTransformer. This can be done by passing the "tree" in as an arguement, or it will just used the saved "tree" by default. It should be noted that, currently, if a visitor method is used to modify the nodes, this may not function correctly.

#### A full implementation of the class and functions looks something like this:
```javascript
const transformer = new FurcatedTreeTransformer('(', ')', ' ', '@');

const text = "(A a(B b(C c)(D d))(@A a(E e(F f)(@E e))(G g(H h(I i)(J j))(@G g))))"
const tree = transformer.fromString(text);
transformer.unfurcate()
console.log(transformer.toString());
```
#### Which prints:
```
(A a(B b(C c)(D d))(E e(F f))(G g(H h(I i)(J j))))
```

#### And that's about it.
I plan on expanding the functionality of this in the future, but I have a lot of other things to work on, so who knows when that will be.
