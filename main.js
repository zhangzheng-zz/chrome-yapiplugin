"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
(function () {
    var _this = this;
    var currentApiId = "";
    var currentApiData;
    var initActionBtn = function () {
        var div = document.createElement("div");
        div.className = "btn-wrapper";
        div.innerHTML = "<button class='btn'>Copy query</button><button class='btn'>Copy req body</button><button class='btn'>Copy res body</button><button class='btn'>Copy template function</button>";
        document.body.appendChild(div);
        var configWrapper = document.createElement("div");
        configWrapper.className = "config-wrapper";
        configWrapper.innerHTML = "\n      <span class=\"config-input\"><span class=\"config-text\">functionName:</span><input type=\"text\" id=\"functionName\" name=\"functionName\"></span>\n      <span class=\"config-input\"><span class=\"config-text\">requestInstanceName:</span><input type=\"text\" id=\"requestInstanceName\" name=\"requestInstanceName\"></span>\n      <span class=\"config-input\"><span class=\"config-text\">baseUrl:</span><input type=\"text\" id=\"baseUrl\" name=\"baseUrl\"></span>";
        document.body.appendChild(configWrapper);
        history.pushState = bindEventListener("pushState");
        history.replaceState = bindEventListener("replaceState");
        window.addEventListener("replaceState", onUrlChange);
        window.addEventListener("pushState", onUrlChange);
        window.addEventListener("popstate", onUrlChange);
        function onUrlChange() {
            var url = location.href;
            div.style.display = /\/project\/\d+\/interface\/api\/\d+/.test(url)
                ? "flex"
                : "none";
            configWrapper.style.display = /\/project\/\d+\/interface\/api\/\d+/.test(url)
                ? "flex"
                : "none";
            currentApiId = "";
            // @ts-ignore
            currentApiData = null;
        }
        onUrlChange();
        div.addEventListener("click", function (e) { return __awaiter(_this, void 0, void 0, function () {
            var apiId, apiData, match, index_1, ret, btnText_1, err_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        apiId = "";
                        apiData = void 0;
                        match = /\/project\/\d+\/interface\/api\/(\d+)/.exec(location.href);
                        if (match) {
                            apiId = match[1];
                        }
                        if (!(apiId && apiId === currentApiId && currentApiData)) return [3 /*break*/, 1];
                        apiData = currentApiData;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, fetch("".concat(location.protocol, "//").concat(location.host, "/api/interface/get?id=").concat(apiId))
                            .then(function (res) { return res.json(); })
                            .then(function (res) {
                            if (res.errcode === 0) {
                                return res.data;
                            }
                            else {
                                return Promise.reject("data error");
                            }
                        })];
                    case 2:
                        apiData = _c.sent();
                        currentApiId = apiId;
                        currentApiData = apiData;
                        _c.label = 3;
                    case 3:
                        index_1 = __spreadArray([], div.children, true).findIndex(function (it) { return e.target === it; });
                        ret = "";
                        switch (index_1) {
                            case 0:
                                ret = genQueryType(apiData.req_query);
                                break;
                            case 1:
                                ret = apiData.req_body_other
                                    ? genDataType(JSON.parse(apiData.req_body_other))
                                    : "{}";
                                break;
                            case 2:
                                ret = genDataType((_b = (_a = JSON.parse(apiData.res_body)) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.data);
                                break;
                            case 3:
                                ret = genTemplateFunction();
                                break;
                            default:
                                break;
                        }
                        return [4 /*yield*/, copyToClipboard(ret)];
                    case 4:
                        _c.sent();
                        btnText_1 = div.children[index_1].innerHTML;
                        div.children[index_1].innerHTML = "Done!";
                        setTimeout(function () {
                            div.children[index_1].innerHTML = btnText_1;
                        }, 1500);
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _c.sent();
                        console.log(err_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    initActionBtn();
    function copyToClipboard(text) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2, inp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, navigator.clipboard.writeText(text)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        console.log(err_2);
                        inp = document.createElement("input");
                        inp.type = "text";
                        inp.value = text;
                        document.body.appendChild(inp);
                        inp.select();
                        document.execCommand("Copy");
                        document.body.removeChild(inp);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function snakeCaseToCamelCase(key) {
        if (key === void 0) { key = ""; }
        return key.replace(/_(\w)/g, function (match, p1) { return p1.toUpperCase(); });
    }
    function genQueryType(data) {
        if (!Array.isArray(data)) {
            return "";
        }
        if (data.length === 0) {
            return "{}";
        }
        var ret = [];
        ret.push("{\n");
        data.forEach(function (_a) {
            var name = _a.name, required = _a.required;
            ret.push("  ".concat(snakeCaseToCamelCase(name)).concat(required === "1" ? ":" : "?:", " string;\n"));
        });
        ret.push("}");
        return ret.join("");
    }
    function genDataType(data, tabCount) {
        if (tabCount === void 0) { tabCount = 0; }
        if (!data) {
            return "{}";
        }
        if (["boolean", "string", "number"].includes(data.type)) {
            return data.type;
        }
        if (data.type === "integer") {
            return "number";
        }
        if (data.type === "object") {
            return genObjectType(data, tabCount);
        }
        if (data.type === "array") {
            return genArrayType(data, tabCount);
        }
        return "";
    }
    function genObjectType(data, tabCount) {
        var _a, _b;
        if (tabCount === void 0) { tabCount = 0; }
        if (!data.properties) {
            return "{}";
        }
        var requiredFieldDict = (_b = (_a = data.required) === null || _a === void 0 ? void 0 : _a.reduce(function (acc, cur) {
            acc[cur] = true;
            return acc;
        }, {})) !== null && _b !== void 0 ? _b : {};
        var ret = [];
        ret.push("{\n");
        Object.entries(data.properties).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            return ret.push("".concat("  ".repeat(tabCount + 1)).concat(snakeCaseToCamelCase(key)).concat(requiredFieldDict[key] ? ":" : "?:", " ").concat(genDataType(value, tabCount + 1), ";\n"));
        });
        ret.push("".concat("  ".repeat(tabCount), "}"));
        return ret.join("");
    }
    function genArrayType(data, tabCount) {
        if (tabCount === void 0) { tabCount = 0; }
        var items = data.items;
        if (["string", "boolean", "number"].includes(items.type)) {
            return "".concat(data.items.type, "[]");
        }
        if (items.type === "integer") {
            return "number[]";
        }
        var ret = [];
        ret.push("Array<");
        if (items.type === "object") {
            ret.push(genObjectType(items, tabCount));
        }
        else if (items.type === "array") {
            ret.push(genArrayType(items, tabCount));
        }
        ret.push(">");
        return ret.join("");
    }
    function genTemplateFunction() {
        var ret = "";
        var c_method = currentApiData.method, _a = currentApiData.title, c_title = _a === void 0 ? '' : _a, c_path = currentApiData.path, c_req_query = currentApiData.req_query, c_req_body_other = currentApiData.req_body_other;
        // // 第一步： 配置
        var requestInstanceName = document.getElementById("requestInstanceName").value || "request";
        var baseUrl = document.getElementById("baseUrl").value || "";
        var funcName = document.getElementById("functionName").value || "";
        var options = {
            requestInstanceName: requestInstanceName,
            baseUrl: baseUrl,
            funcName: funcName,
        };
        // 第二步：方法名
        var functionName = funcName || camelCase(genFunctionName());
        // 第三步：请求方式和路径实例名称
        var method = c_method.toLowerCase();
        var path = options.baseUrl
            ? c_path.replace(options.baseUrl, "")
            : c_path;
        // 第四步：注释
        var comments = createComments(c_title || '');
        // 第五步：ts 类型
        var typescriptDeclaration = createTsDeclaration(options);
        var paramTypeName = getParamsTypesName(options);
        var responseTypeName = getResponseTypesName(options);
        var query = "";
        if ((c_req_query.length !== 0 && method === "get") ||
            (c_req_body_other && method !== "get")) {
            query = "params: ".concat(paramTypeName);
        }
        var paramsStr = "";
        if (!!query) {
            if (method === "get") {
                paramsStr = ", { params }";
            }
            else {
                paramsStr = ", { ...params }";
            }
        }
        // 第六步：生成模版代码
        ret += "\n    ".concat(typescriptDeclaration, "\n    ").concat(comments, "\nexport function ").concat(functionName, "(").concat(query, "): Promise<").concat(responseTypeName, "> {\n  return ").concat(options.requestInstanceName, ".").concat(method, "('").concat(path, "'").concat(paramsStr, ");\n}");
        return ret;
    }
    function getResponseTypesName(options) {
        return "Response".concat(options.funcName ? pascalCase(options.funcName) : pascalCase(genFunctionName()));
    }
    // 函数名由 api 地址的最后一个单词生成
    function genFunctionName() {
        var pathSplit = currentApiData.path.split("/");
        var name = pathSplit[pathSplit.length - 1] ?
            pathSplit[pathSplit.length - 1] :
            pathSplit[pathSplit.length - 2];
        return name || "functionName";
    }
    function createTsDeclaration(options) {
        var _a, _b, _c, _d;
        var c_method = currentApiData.method, c_req_query = currentApiData.req_query, c_req_body_other = currentApiData.req_body_other, c_res_body = currentApiData.res_body;
        var ret = "";
        // 响应体声明
        if (c_req_body_other && c_method.toLowerCase() !== "get") {
            var reqDataType = genDataType(JSON.parse(c_req_body_other));
            ret += "\nexport interface ".concat(getParamsTypesName(options), " ").concat(reqDataType);
        }
        // get 请求参数声明
        if (Array.isArray(c_req_query) && c_req_query.length !== 0 && c_method.toLowerCase() === "get") {
            var reqQueryType = genQueryType(currentApiData.req_query);
            ret += "\nexport interface ".concat(getParamsTypesName(options), " ").concat(reqQueryType);
        }
        if ((_b = (_a = JSON.parse(c_res_body)) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.data) {
            var resDataType = genDataType((_d = (_c = JSON.parse(c_res_body)) === null || _c === void 0 ? void 0 : _c.properties) === null || _d === void 0 ? void 0 : _d.data);
            var resTypeDes = pascalCase(genFunctionName());
            var resTypeName = "Response".concat(options.funcName ? pascalCase(options.funcName) : resTypeDes);
            // 处理返回为数组类型
            var content = resDataType.match(/^Array<([\s\S]*)>$/);
            if (content && content[1]) {
                ret += "\nexport type ".concat(resTypeDes, " = ").concat(content[1], "\nexport type ").concat(resTypeName, " = Array<").concat(resTypeDes, ">");
            }
            else {
                ret += "\nexport interface ".concat(resTypeName, " ").concat(resDataType);
            }
        }
        return ret;
    }
    function getParamsTypesName(options) {
        return "Params".concat(options.funcName ? pascalCase(options.funcName) : pascalCase(genFunctionName()));
    }
})();
function createComments(title) {
    var str = "\n/**\n * ".concat(title, "\n */");
    return str;
}
function titleCase(input) {
    return input[0].toLocaleUpperCase() + input.slice(1);
}
function pascalCase(value) {
    if (value === null || value === undefined)
        return "";
    if (typeof value.toString !== "function")
        return "";
    var input = value.toString().trim();
    if (input === "")
        return "";
    if (input.length === 1)
        return input.toLocaleUpperCase();
    var match = input.match(/[a-zA-Z0-9]+/g);
    if (match) {
        return match.map(function (m) { return titleCase(m); }).join("");
    }
    return input;
}
function camelCase(value) {
    var result = pascalCase(value);
    return result ? "".concat(result[0].toLocaleLowerCase()).concat(result.slice(1)) : "";
}
// 劫持路由事件 派发到 window 
function bindEventListener(type) {
    var historyEvent = history[type];
    return function () {
        //@ts-ignore
        var newEvent = historyEvent.apply(this, arguments);
        var e = new Event(type);
        //@ts-ignore
        e.arguments = arguments;
        window.dispatchEvent(e);
        return newEvent;
    };
}
;
