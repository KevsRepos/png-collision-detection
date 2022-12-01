# png-collision-detection

## Working with Svelte actions! 🥳😎

Detection of overlapping graphics, working with transparent pixels!

## Usage
Simply call the `collisionDetection(node: Node, options?: CollisionOptions)` function with an HTML node which contains graphics you want to detect collisions on. The moment you want to check for a collision, simply call `isColliding()` which returns a `boolean` value based on wether a collision was detected or not.
`CollisionOptions` currently consists of one option `borders: boolean` which also detects if a graphic hits the border of the parent element
Currently working with the css `transform` values of `translate` and `rotate`.

You can aswell use it as a Svelte action, simply: `<div use:collisionDetection={options}></div>`

## TODO
- make it work with other css transformations
- add option to select specific elements by a css selector
- maybe improve performance by calculating the matrix of the image (Though I dont even know if this improves the performance)
- add all the type definitions
- add automated tests
- make it responsive to the screen size

I'm by far not a math expert, so dealing with the 3x3 matrix is a bit tricky for me. Contributions are appreciated!
