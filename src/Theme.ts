declare var window: any;

export const defaultColors = [
    ["0", "Background 0", "Sidebar Background"],
    ["1", "Background 1", "Left Bar Background"],
    ["2", "Background 2", "Main Background"],
    ["3", "Background 3", "Right Bar Background"],
    ["btn1", "Button 1", "Default button"],
    ["btn2", "Button 2", "Secondary button"],
    ["owner", "Owner Role", "Color of owner role"],
    ["admin", "Admin Role", "Color of admin role"],
    ["mod", "Mod Role", "Color of mod role"]
];

export const colorTypes = [
    ["bg", "Background", null],
    ["fg", "Foreground", (x)=>calcFg(x)]
];

export const defaultThemes = {
    "Light": {
        "bg0": "#babdb6", 
        "bg1": "#d3d7cf", 
        "bg2": "#ffffff", 
        "bg3": "#eeeeec",
        "bgbtn1": "#059669", 
        "bgbtn2": "#eab308",
        "bgowner": "#007b00",
        "bgadmin": "#2368D5",
        "bgmod": "#2e8336"
    },
    "Ignite": {
        "bg0": "#e31337", 
        "bg1": "#e31337", 
        "bg2": "#ffffff", 
        "bg3": "#ffffff",
        "bgbtn1": "#059669", 
        "bgbtn2": "#eab308",
        "bgowner": "#007b00",
        "bgadmin": "#2368D5",
        "bgmod": "#2e8336"
    },
    "Dark": {
        "bg0": "#353535", 
        "bg1": "#424242", 
        "bg2": "#555753", 
        "bg3": "#424242",
        "bgbtn1": "#059669", 
        "bgbtn2": "#eab308",
        "bgowner": "#5aff5a",
        "bgadmin": "#BBCEEC",
        "bgmod": "#7ee688"
    }
};

export class Theme {
    colorGroup: any = {}
    map: any = {}
    addGroup(name: string, colors: ThemeColor[]) {
        this.colorGroup[name] = colors;
        for(var color of colors)
            this.map[color.type+color.name] = color;
    }
    applyTheme(root: any) {
        if(root === null) root = document.querySelector(':root');
        for(var group in this.colorGroup)
            for(var color of this.colorGroup[group]) {
                if(color.color == null) console.log("color",color.type,color.name,"missing");
                else color.applyColor(root);
            }
    }
    clear() {
        for(var group in this.colorGroup)
            for(var color of this.colorGroup[group])
                color.color = null;
    }
    getColorString(typeName: string, defaultColor: string) {
        var themeColor = this.map[typeName];
        if(!themeColor || !themeColor.color) return defaultColor;
        return themeColor.colorToString();
    }
    set(colors: any) {
        this.clear();
        for(var typeName in colors) {
            var themeColor = this.map[typeName];
            if(themeColor) 
                themeColor.setColor(colors[typeName]);
        }
        for(var group in this.colorGroup)
            if(this.colorGroup[group][0].color)
                this.updateGroup(group, this.colorGroup[group][0].color);
    }
    updateGroup(name: string, col: number[]) {
        if(!this.colorGroup[name]) { console.log("unknown theme color", name); return; }
        for(var color of this.colorGroup[name])
            color.updateColor(col);
    }
    newTheme(): Theme {
        var theme = new Theme();
        for(var group in this.colorGroup) {
            var colors = [];
            for(var color of this.colorGroup[group])
                colors.push(color.copy());
            theme.addGroup(group, colors);
        }
        return theme;
    }
    toJSON() {
        var obj = {};
        for(var group in this.colorGroup) {
            var colors = [];
            for(var color of this.colorGroup[group])
                if(color.color && !color.color.computed)
                    obj[color.type+color.name] = color.color;
        }
        return obj;
    }
}
export class ThemeColor {
    type: string
    name: string
    color: number[]
    defaultFn: (col: number[]) => number[]
    constructor(name: string, type: string, color: any, fn: (col: number[]) => number[] = null) {
        this.name = name;
        this.type = type;
        this.color = parseRGB(color);
        this.defaultFn = fn;
    }
    applyColor(root: any = null) {
        if(root === null) root = document.querySelector(':root');
        root.style.setProperty('--app'+this.type+this.name, this.colorToString());
    }
    colorToString(): string {
        var a = this.color;
        if(a.length === 3) return `rgb(${a[0]}, ${a[1]}, ${a[2]})`;
        if(a.length === 4) return `rgba(${a[0]}, ${a[1]}, ${a[2]}, ${a[3]})`;
        console.log("warning: color", this.name, "is", this.color);
        return 'rgb(255,0,255)';
    }
    setColor(col:any) {
        this.color = parseRGB(col);
    }
    updateColor(col:number[]) {
        if(this.color !== null) return;
        var fn = this.defaultFn;
        if(fn !== null) { this.color = fn(col); this.color.computed = true; }
    }
    copy(): ThemeColor {
        return new ThemeColor(this.name, this.type, this.color, this.defaultFn);
    }
}
function loadThemes() {
    try {
        var themes = window.localStorage.getItem("themes");
        if(themes != null) {
            return JSON.parse(themes);
        }
    }
    catch(e) { console.log(e); }
    return {};
}
export const userThemes = loadThemes();
export function saveUserThemes() {
    try {
        window.localStorage.setItem("themes", JSON.stringify(userThemes));
    }
    catch(e) { console.log(e); }
}
export function colorHexString(color: any) {
    var rgb = parseRGB(color);
    var result = '#';
    for(var component of rgb) {
        if(component < 16) result += '0';
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
    for(var array in defaultColors) {
        var name = defaultColors[array][0];      
        var themeColors = [];
        for(var type of colorTypes) {
            console.log("color", type[0], name, type);
            var themeColor = new ThemeColor(name, type[0], '#ffffff', type[2]);
            themeColors.push(themeColor);
        }
        theme.addGroup(name, themeColors);
    }
    return theme;
}
export function findThemeByName(name: string) {
    var theme = defaultThemes[name];
    if(!theme) theme = userThemes[name];
    return (theme)?theme:null;
}
export const defaultTheme = initializeTheme();

export function loadTheme() {
    try {
        var obj = window.localStorage.getItem("theme");
        if(obj !== null && obj.length > 0) {
            if(obj.startsWith('{')) {
                obj = JSON.parse(obj);
            }
            else {
                var theme = findThemeByName(obj);
                if(theme) {
                    defaultTheme.set(theme);
                    defaultTheme.applyTheme();
                }
            }
        }
    }
    catch(e) { console.log("failed to load theme", e); }
}
export function setTheme(obj: any) {
    if(typeof obj !== 'string') obj = JSON.stringify(obj);
    window.localStorage.setItem("theme", obj);
}
function parseRGB(color): number[] {
    if(color == null) return null;
    if(Array.isArray(color)) return color; 
    if(color.startsWith("#")) {
        var len = Math.floor((color.length-1)/3);
        if(len === 0) return null;
        var array = [parseInt(color.substr(1,len),16), 
                parseInt(color.substr(1+len,len),16),
                parseInt(color.substr(1+len+len,len),16)];
        if(color.length === 9)
            array.push(parseInt(color.substr(1+len+len+len,len),16));
        return array;
    }
    if(color.startsWith("rgb")) {
        var start = color.indexOf('(');      if(start === -1) return null;
        var end = color.indexOf(')', start); if(end === -1) return null;
        color.substring(start+1, end).split(/[ ,]+/);
    }
    return null;    
}
function calcFg(rgb) {
    var sum = ((rgb[0]*299) + (rgb[1] * 587) + (rgb[2] * 114)) * 0.001;
    return (sum > 128) ? [0,0,0] : [255,255,255];
}
