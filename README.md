# FurcatedTreeTransform
**Current status:** In progress.

JS library to restore furcated trees (forced to expand/collapse nodes to fit a required architecture, like a binary tree) back to their original structure.


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
## Will add more about usage later.
