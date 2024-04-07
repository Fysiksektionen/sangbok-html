# Library files
## Abc2svg
Abc2svg is not on npm, and thus needs to be updated manually. It is done by retrieving the new version from [Jean-François Moine's website](http://moinejf.free.fr/js/abcweb-1.js), then add `export default Abc` to the end. You may also want to add `/* eslint-disable */
` to the beginning, and double-check that the file encoding is correct.
Currently, there is a `abc2svg.d.ts` file, that represent the types currently used from abc2svg. If the api changes, this file may need to be changed. You may also have to modify it if you want to use additional functionality from abc2svg.

Abc2svg is available under LGPL3 at the time of writing.