import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Defs, Mask, Path, Rect } from "react-native-svg";

const { width, height } = Dimensions.get("window");
const overlayColor = "rgba(0,0,0,0.7)";
const holeSize = 200; // Kích thước vùng cắt
const borderRadius = 10; // Bo góc
const cornerSize = 30; // Kích thước góc viền trắng
const borderWidth = 4; // Độ dày viền trắng

const holeX = (width - holeSize) / 2;
const holeY = (height - holeSize) / 2;
const curveSize = 10; // Độ cong
const extraLength = 20;

export default function Overlay() {
  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Defs>
          {/* Mask để tạo vùng trong suốt */}
          <Mask id="mask">
            <Rect x="0" y="0" width={width} height={height} fill="white" />
            <Rect
              x={holeX}
              y={holeY}
              width={holeSize}
              height={holeSize}
              rx={borderRadius}
              ry={borderRadius}
              fill="black"
            />
          </Mask>
        </Defs>

        {/* Overlay chính */}
        <Rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill={overlayColor}
          mask="url(#mask)"
        />

        {/* Vẽ đường cong tại 4 góc */}
        {/* Góc trên trái */}
        <Path
          d={`M ${holeX + extraLength} ${holeY} 
              L ${holeX + curveSize} ${holeY} 
              Q ${holeX} ${holeY} ${holeX} ${holeY + curveSize}
              L ${holeX} ${holeY + extraLength}`}
          stroke="white"
          strokeWidth={borderWidth}
          fill="transparent"
        />

        {/* Góc trên phải */}
        <Path
          d={`M ${holeX + holeSize - extraLength} ${holeY} 
              L ${holeX + holeSize - curveSize} ${holeY} 
              Q ${holeX + holeSize} ${holeY} ${holeX + holeSize} ${
            holeY + curveSize
          }
              L ${holeX + holeSize} ${holeY + extraLength}`}
          stroke="white"
          strokeWidth={borderWidth}
          fill="transparent"
        />

        {/* Góc dưới trái */}
        <Path
          d={`M ${holeX + extraLength} ${holeY + holeSize} 
              L ${holeX + curveSize} ${holeY + holeSize} 
              Q ${holeX} ${holeY + holeSize} ${holeX} ${
            holeY + holeSize - curveSize
          }
              L ${holeX} ${holeY + holeSize - extraLength}`}
          stroke="white"
          strokeWidth={borderWidth}
          fill="transparent"
        />

        {/* Góc dưới phải */}
        <Path
          d={`M ${holeX + holeSize - extraLength} ${holeY + holeSize} 
              L ${holeX + holeSize - curveSize} ${holeY + holeSize} 
              Q ${holeX + holeSize} ${holeY + holeSize} ${holeX + holeSize} ${
            holeY + holeSize - curveSize
          }
              L ${holeX + holeSize} ${holeY + holeSize - extraLength}`}
          stroke="white"
          strokeWidth={borderWidth}
          fill="transparent"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
