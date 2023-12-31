declare var window: any;

export const defaultColors = [
  ["0", "Left Sidebar", "Background of left sidebar (bg0)"],
  ["1", "Middle Sidebar", "Background of middle sidebar (bg1)"],
  ["2", "Background", "Background of content (bg2)"],
  ["3", "Right Sidebar", "Background of right sidebar (bg3)"],
  ["btn1", "Default Button", "Confirmation button (btn1)"],
  ["btn2", "Secondary Button", "Edit, reset button (btn2)"],
  ["owner", "Community Owner", "Color of owner role (owner)"],
  ["admin", "Community Admin", "Color of admin role (admin)"],
  ["mod", "Community Moderator", "Color of moderator role (mod)"],
  ["conote", "Community Notification", "Color of community notifications (conote)"],
  ["unote", "User Notification", "Color of user notifications (unote)"],
];

export const colorTypes = [
  ["bg", "Background", null],
  ["hv", "Hover", (x) => calcHv(x)],
  ["fg", "Foreground", (x) => calcFg(x)],
  ["sg", "Selection", (x) => calcSg(x)],
  ["hg", "Highlight", (x) => calcHg(x)],
];

export const defaultThemes = {
  Light: {
    bg0: "#dfdfdd",
    bg1: "#eeeeec",
    bg2: "#ffffff",
    bg3: "#eeeeec",
    bgbtn1: "#f50057",
    bgbtn2: "#d9d9d7",
    bgowner: "#f50057",
    bgadmin: "#2368D5",
    bgmod: "#f50057",
    bgconote: "#f50057",
    bgunote: "#f50057",
  },
  Ignite: {
    bg0: "#860e18",
    bg1: "#9d212c",
    bg2: "#ffffff",
    bg3: "#ffffff",
    bgbtn1: "#f50057",
    bgbtn2: "#d9d9d7",
    bgowner: "#f50057",
    bgadmin: "#2368D5",
    bgmod: "#f50057",
    bgconote: "#f50057",
    bgunote: "#f50057",
  },
  Dark: {
    bg0: "#353535",
    bg1: "#424242",
    bg2: "#555753",
    bg3: "#424242",
    bgbtn1: "#f50057",
    bgbtn2: "#d9d9d7",
    bgowner: "#f50057",
    bgadmin: "#BBCEEC",
    bgmod: "#f50057",
    bgconote: "#f50057",
    bgunote: "#f50057",
  },
  Sky: {
    bg0: "#075985",
    bg1: "#075985",
    bg2: "#0c4a6e",
    bg3: "#0369a1",
    bgbtn1: "#facc15",
    bgbtn2: "#facc15",
    bgowner: "#ec4899",
    bgadmin: "#fdba74",
    bgmod: "#a5b4fc",
    bgconote: "#f50057",
    bgunote: "#f50057",
  },
};

export class Theme {
  themeName: string = "";
  colorGroup: any = {};
  map: any = {};
  addGroup(name: string, colors: ThemeColor[]) {
    this.colorGroup[name] = colors;
    for (var color of colors) this.map[color.type + color.name] = color;
  }
  applyTheme(root: any) {
    if (root === null) root = document.querySelector(":root");
    for (var group in this.colorGroup)
      for (var color of this.colorGroup[group]) {
        if (color.color == null) console.log("color", color.type, color.name, "missing");
        else color.applyColor(root);
      }
  }
  clear() {
    for (var group in this.colorGroup) for (var color of this.colorGroup[group]) color.color = null;
  }
  getColorString(typeName: string, defaultColor: string) {
    var themeColor = this.map[typeName];
    if (!themeColor || !themeColor.color) return defaultColor;
    return themeColor.colorToString();
  }
  set(colors: any) {
    this.clear();
    for (var typeName in colors) {
      var themeColor = this.map[typeName];
      if (themeColor) themeColor.setColor(colors[typeName]);
    }
    for (var group in this.colorGroup) if (this.colorGroup[group][0].color) this.updateGroup(group, this.colorGroup[group][0].color);
  }
  updateGroup(name: string, col: number[]) {
    if (!this.colorGroup[name]) {
      console.log("unknown theme color", name);
      return;
    }
    for (var color of this.colorGroup[name]) color.updateColor(col);
  }
  newTheme(): Theme {
    var theme = new Theme();
    for (var group in this.colorGroup) {
      var colors = [];
      for (var color of this.colorGroup[group]) colors.push(color.copy());
      theme.addGroup(group, colors);
    }
    return theme;
  }
  toJSON() {
    var obj = {};
    for (var group in this.colorGroup) {
      var colors = [];
      for (var color of this.colorGroup[group]) if (color.color && !color.color.computed) obj[color.type + color.name] = color.color;
    }
    return obj;
  }
}
export class ThemeColor {
  type: string;
  name: string;
  color: number[];
  defaultFn: (col: number[]) => number[];
  constructor(name: string, type: string, color: any, fn: (col: number[]) => number[] = null) {
    this.name = name;
    this.type = type;
    this.color = parseRGB(color);
    this.defaultFn = fn;
  }
  applyColor(root: any = null) {
    if (root === null) root = document.querySelector(":root");
    root.style.setProperty("--app" + this.type + this.name, this.colorToString());
  }
  colorToString(): string {
    var a = this.color;
    if (a.length === 3) return `rgb(${a[0]}, ${a[1]}, ${a[2]})`;
    if (a.length === 4) return `rgba(${a[0]}, ${a[1]}, ${a[2]}, ${a[3] / 255.0})`;
    console.log("warning: color", this.name, "is", this.color);
    return "rgb(255,0,255)";
  }
  setColor(col: any) {
    this.color = parseRGB(col);
  }
  updateColor(col: number[]) {
    if (this.color !== null) return;
    var fn = this.defaultFn;
    if (fn !== null) {
      this.color = fn(col);
      this.color.computed = true;
    }
  }
  copy(): ThemeColor {
    return new ThemeColor(this.name, this.type, this.color, this.defaultFn);
  }
}
var cssOverridePropertyName = "css";
export function setCssOverridePropertyName(name) {
    cssOverridePropertyName = (name == null)?"css":("css#"+name);
}
export function loadCssOverrides() {
  try {
    var css = window.localStorage.getItem(cssOverridePropertyName);
    if (css != null) {
      return JSON.parse(css);
    }
  } catch (e) {
    console.log(e);
  }
  return {};
}
export function saveCssOverrides(css, append = false) {
  try {
    if (append) {
      var obj = loadCssOverrides();
      for(var item in css) {
        if(css[item] == null) delete obj[item];
        else obj[item] = css[item];
      }
      css = obj;
    }
    window.localStorage.setItem(cssOverridePropertyName, JSON.stringify(css));
  } catch (e) {
    console.log(e);
  }
}
function loadThemes() {
  try {
    var themes = window.localStorage.getItem("themes");
    if (themes != null) {
      return JSON.parse(themes);
    }
  } catch (e) {
    console.log(e);
  }
  return {};
}
export const userThemes = loadThemes();
export function saveUserThemes() {
  try {
    window.localStorage.setItem("themes", JSON.stringify(userThemes));
  } catch (e) {
    console.log(e);
  }
}
export function colorHexString(color: any) {
  var rgb = parseRGB(color);
  var result = "#";
  for (var component of rgb) {
    if (component < 16) result += "0";
    result += component.toString(16);
  }
  return result;
}
export function initializeTheme() {
  var theme = new Theme();
  theme.defaultColors = defaultColors;
  theme.colorTypes = colorTypes;
  theme.defaultThemes = defaultThemes;
  theme.userThemes = userThemes;
  theme.saveUserThemes = saveUserThemes;
  theme.loadTheme = loadTheme;
  theme.setTheme = setTheme;
  theme.findThemeByName = findThemeByName;
  theme.colorHexString = colorHexString;
  theme.setCssOverridePropertyName = setCssOverridePropertyName;
  theme.loadCssOverrides = loadCssOverrides;
  theme.saveCssOverrides = saveCssOverrides;
  for (var array in defaultColors) {
    var name = defaultColors[array][0];
    var themeColors = [];
    for (var type of colorTypes) {
      var themeColor = new ThemeColor(name, type[0], "#ffffff", type[2]);
      themeColors.push(themeColor);
    }
    theme.addGroup(name, themeColors);
  }
  return theme;
}
export function findThemeByName(name: string) {
  var theme = defaultThemes[name];
  if (!theme) theme = userThemes[name];
  return theme ? theme : null;
}
export const defaultTheme = initializeTheme();
export function applyTheme(obj: any) {
  var theme = typeof obj === "string" ? findThemeByName(obj) : obj;
  if (theme) {
    defaultTheme.set(theme);
    if (typeof obj === "string") defaultTheme.themeName = obj;
    defaultTheme.applyTheme();
  }
}
export function loadTheme(def = null) {
  try {
    var obj = window.localStorage.getItem("theme");
    if (obj !== null && obj.length > 0) {
      if (obj.startsWith("{")) {
        obj = JSON.parse(obj);
      } else applyTheme(obj);
    } else if (def != null) applyTheme(def);
  } catch (e) {
    console.log("failed to load theme", e);
  }
}
export function setTheme(obj: any) {
  if (typeof obj !== "string") obj = JSON.stringify(obj);
  window.localStorage.setItem("theme", obj);
}
function parseRGB(color): number[] {
  if (color == null) return null;
  if (Array.isArray(color)) return color;
  if (color.startsWith("#")) {
    var len = Math.floor((color.length - 1) / 3);
    if (len === 0) return null;
    var array = [parseInt(color.substr(1, len), 16), parseInt(color.substr(1 + len, len), 16), parseInt(color.substr(1 + len + len, len), 16)];
    if (color.length === 9) array.push(parseInt(color.substr(1 + len + len + len, len), 16));
    return array;
  }
  if (color.startsWith("rgb")) {
    var start = color.indexOf("(");
    if (start === -1) return null;
    var end = color.indexOf(")", start);
    if (end === -1) return null;
    color.substring(start + 1, end).split(/[ ,]+/);
  }
  return null;
}
function calcFg(rgb, compare = 128) {
  var sum = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) * 0.001;
  return sum > compare ? [0, 0, 0] : [255, 255, 255];
}
function calcHv(rgb) {
  return [rgb[0], rgb[1], rgb[2], 215];
}
function calcSg(rgb) {
  var sg = calcFg(rgb, 200);
  sg.push(sg[0] === 0 ? 23 : 95);
  return sg;
}
function calcHg(rgb) {
  var sg = calcFg(rgb, 200);
  sg.push(sg[0] === 0 ? 42 : 25);
  return sg;
}
