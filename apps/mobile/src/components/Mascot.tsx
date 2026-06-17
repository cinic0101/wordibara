import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";
import { View, type ViewStyle } from "react-native";

type MascotProps = {
  size?: number;
  color?: string;
  accent?: string;
  mood?: "happy" | "thinking" | "proud";
  style?: ViewStyle;
};

export function Mascot({
  size = 160,
  color = "#D9A56D",
  accent = "#58CC02",
  mood = "happy",
  style
}: MascotProps) {
  const mouth =
    mood === "thinking"
      ? "M91 107 Q102 101 113 107"
      : mood === "proud"
        ? "M88 106 Q102 120 116 106"
        : "M88 104 Q102 116 116 104";
  return (
    <View style={style}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Ellipse cx="100" cy="181" rx="58" ry="9" fill="#CDE5C8" opacity={0.65} />
        <Rect x="58" y="39" width="92" height="105" rx="42" fill={color} />
        <Circle cx="71" cy="42" r="16" fill={color} />
        <Circle cx="129" cy="42" r="16" fill={color} />
        <Circle cx="71" cy="42" r="8" fill="#B67E50" />
        <Circle cx="129" cy="42" r="8" fill="#B67E50" />
        <Ellipse cx="100" cy="97" rx="47" ry="36" fill="#F5CF9B" />
        <Circle cx="84" cy="86" r="7" fill="#20312B" />
        <Circle cx="116" cy="86" r="7" fill="#20312B" />
        <Circle cx="87" cy="83" r="2" fill="#FFFFFF" />
        <Circle cx="119" cy="83" r="2" fill="#FFFFFF" />
        <Ellipse cx="100" cy="98" rx="9" ry="7" fill="#70462E" />
        <Path d={mouth} stroke="#70462E" strokeWidth="6" strokeLinecap="round" fill="none" />
        <Path d="M137 61 C159 55 172 67 169 88 C151 83 140 74 137 61Z" fill={accent} />
        <Rect x="63" y="132" width="74" height="46" rx="14" fill="#FFFFFF" stroke="#D8E7DA" strokeWidth="4" />
        <Path d="M82 144 L91 165 L100 144 L109 165 L118 144" stroke={accent} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Circle cx="58" cy="119" r="13" fill={color} />
        <Circle cx="142" cy="119" r="13" fill={color} />
      </Svg>
    </View>
  );
}

