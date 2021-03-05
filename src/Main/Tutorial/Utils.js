/** @format */

export const svgMaskPath = ({ size, position, canvasSize }) => `M0,0
    H${canvasSize.x}
    V${canvasSize.y}
    H0
    V0
    Z
    M${position.x._value - 2},${position.y._value - 10}
    H${position.x._value + size.x._value + 4}
    a8,8 0 0 1 8,8
    V${position.y._value + size.y._value + 4}
    a8,8 0 0 1 -8,8
    H${position.x._value - 4}
    a8,8 0 0 1 -8,-8
    V${position.y._value - 2}
    a8,8 0 0 1 8,-8
    Z`
